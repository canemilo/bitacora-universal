package bitacora.bitacorauniversal.application.auth;

import bitacora.bitacorauniversal.infrastructure.persistence.AppUserEntity;
import bitacora.bitacorauniversal.infrastructure.persistence.AppUserRepository;
import bitacora.bitacorauniversal.security.JwtService;
import bitacora.bitacorauniversal.shared.errors.ConflictException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(AppUserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String register(String email, String password) {
        String norm = normalizeEmail(email);

        if (userRepository.existsByEmail(norm)) {
            throw new ConflictException("Email ya registrado");
        }

        AppUserEntity u = new AppUserEntity();
        u.setEmail(norm);
        u.setPasswordHash(passwordEncoder.encode(password));

        AppUserEntity saved = userRepository.save(u);
        return jwtService.createToken(saved.getId(), saved.getEmail());
    }

    public String login(String email, String password) {
        String norm = normalizeEmail(email);

        AppUserEntity u = userRepository.findByEmail(norm)
                .orElseThrow(() -> new ConflictException("Credenciales inválidas"));

        if (!passwordEncoder.matches(password, u.getPasswordHash())) {
            throw new ConflictException("Credenciales inválidas");
        }

        return jwtService.createToken(u.getId(), u.getEmail());
    }

    private String normalizeEmail(String email) {
        if (email == null) throw new ConflictException("Email requerido");
        String norm = email.trim().toLowerCase();
        if (norm.isBlank()) throw new ConflictException("Email requerido");
        return norm;
    }
}
