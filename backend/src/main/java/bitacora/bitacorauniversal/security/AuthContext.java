package bitacora.bitacorauniversal.security;

import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

public final class AuthContext {

    private AuthContext() {}

    public static UUID requireUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof JwtPrincipal p) return p.userId();
        throw new IllegalStateException("No authenticated principal");
    }
}
