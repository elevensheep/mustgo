package com.tastyload.tastyload.auth;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Map;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private static final String BEARER_PREFIX = "Bearer ";
    private static final int BEARER_PREFIX_LENGTH = BEARER_PREFIX.length();

    private final AuthService authService;
    private final ObjectMapper objectMapper;

    @Autowired
    public JwtAuthenticationFilter(AuthService authService) {
        this.authService = authService;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String jwt = extractJwtFromRequest(request);
        
        if (jwt != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                String username = extractUsernameFromToken(jwt);
                if (username != null && isValidJwtFormat(jwt)) {
                    setAuthentication(username, request);
                }
            } catch (Exception e) {
                logger.error("JWT 토큰 처리 실패", e);
            }
        }
        
        filterChain.doFilter(request, response);
    }
    
    /**
     * 요청에서 JWT 토큰 추출 (최적화)
     */
    private String extractJwtFromRequest(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith(BEARER_PREFIX)) {
            return authorizationHeader.substring(BEARER_PREFIX_LENGTH);
        }
        return null;
    }
    
    /**
     * JWT 토큰에서 사용자명 추출 (최적화)
     */
    private String extractUsernameFromToken(String jwt) {
        try {
            Map<String, Object> userInfo = authService.extractUserInfoFromToken(jwt);
            if (!userInfo.containsKey("error")) {
                String email = (String) userInfo.get("email");
                return email != null && !email.isEmpty() ? email : "oauth_" + userInfo.get("id") + "@oauth.local";
            }
        } catch (Exception e) {
            logger.error("JWT 토큰에서 사용자명 추출 실패", e);
        }
        return null;
    }
    
    /**
     * 인증 설정 (최적화)
     */
    private void setAuthentication(String username, HttpServletRequest request) {
        UserDetails userDetails = new User(username, "", new ArrayList<>());
        UsernamePasswordAuthenticationToken authToken = 
            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);
    }
    
    private boolean isValidJwtFormat(String jwt) {
        if (jwt == null || jwt.isEmpty()) {
            return false;
        }
        
        String[] parts = jwt.split("\\.");
        if (parts.length != 3) {
            return false;
        }
        
        try {
            // JWT 토큰의 만료 시간 확인
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
            JsonNode payloadNode = objectMapper.readTree(payload);
            
            if (payloadNode.has("exp")) {
                long exp = payloadNode.get("exp").asLong();
                long currentTime = System.currentTimeMillis() / 1000;
                return exp > currentTime;
            }
            
            return true; // exp가 없으면 일단 통과
        } catch (Exception e) {
            logger.error("JWT 토큰 형식 검증 실패", e);
            return false;
        }
    }
}
