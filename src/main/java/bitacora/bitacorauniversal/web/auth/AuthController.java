package bitacora.bitacorauniversal.web.auth;

import bitacora.bitacorauniversal.application.auth.AuthService;
import bitacora.bitacorauniversal.web.auth.dto.AuthResponse;
import bitacora.bitacorauniversal.web.auth.dto.LoginRequest;
import bitacora.bitacorauniversal.web.auth.dto.RegisterRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
        String token = service.register(req.getEmail(), req.getPassword());
        return new AuthResponse(token);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        String token = service.login(req.getEmail(), req.getPassword());
        return new AuthResponse(token);
    }
}
