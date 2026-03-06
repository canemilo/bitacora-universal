package bitacora.bitacorauniversal.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(

            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        System.out.println("[JWT FILTER] " + method + " " + path);

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        if (path.startsWith("/api/v1/auth/") || path.equals("/health")) {
            System.out.println("[JWT FILTER] ruta publica");
            filterChain.doFilter(request, response);
            return;
        }

        String auth = request.getHeader("Authorization");
        System.out.println("[JWT FILTER] Authorization header = " + auth);

        if (auth != null && auth.startsWith("Bearer ")) {
            String token = auth.substring(7);
            try {
                JwtPrincipal p = jwtService.parse(token);
                var authentication =
                        new UsernamePasswordAuthenticationToken(p, null, List.of());
                SecurityContextHolder.getContext().setAuthentication(authentication);

                System.out.println("[JWT FILTER] autenticado userId=" + p.userId() + " email=" + p.email());
            } catch (Exception e) {
                SecurityContextHolder.clearContext();
                System.out.println("[JWT FILTER] token invalido: " + e.getMessage());
            }
        } else {
            System.out.println("[JWT FILTER] no hay bearer token");
        }

        filterChain.doFilter(request, response);
    }
}