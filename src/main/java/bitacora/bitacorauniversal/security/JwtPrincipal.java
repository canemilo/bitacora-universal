package bitacora.bitacorauniversal.security;

import java.util.UUID;

public record JwtPrincipal(UUID userId, String email) {}
