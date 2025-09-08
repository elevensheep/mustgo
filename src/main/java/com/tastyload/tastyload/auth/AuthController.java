package com.tastyload.tastyload.auth;

import com.tastyload.tastyload.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "인증", description = "JWT, Kakao OAuth, Google OAuth 인증 API")
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private static final String BEARER_PREFIX = "Bearer ";
    private static final int BEARER_PREFIX_LENGTH = BEARER_PREFIX.length();
    
    private final AuthService authService;
    
    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    
    /**
     * Bearer 토큰에서 실제 토큰 추출 (공통 메서드)
     */
    private String extractToken(String bearerToken) {
        if (bearerToken != null && bearerToken.startsWith(BEARER_PREFIX)) {
            return bearerToken.substring(BEARER_PREFIX_LENGTH);
        }
        return bearerToken;
    }
    
    /**
     * 에러 응답 생성 (공통 메서드)
     */
    private ResponseEntity<ApiResponse<Map<String, Object>>> createErrorResponse(String message) {
        return ResponseEntity.badRequest().body(ApiResponse.error(message));
    }
    
    @PostMapping("/signup")
    @Operation(summary = "이메일 회원가입", description = "이메일과 비밀번호로 회원가입")
    public ResponseEntity<ApiResponse<Map<String, Object>>> signUp(
            @RequestParam String email,
            @RequestParam String password) {
        
        Map<String, Object> result = authService.signUpWithEmail(email, password);
        
        if (result.containsKey("error")) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(result.get("error").toString()));
        }
        
        return ResponseEntity.ok(ApiResponse.success("회원가입 성공", result));
    }
    
    @PostMapping("/signin")
    @Operation(summary = "이메일 로그인", description = "이메일과 비밀번호로 로그인")
    public ResponseEntity<ApiResponse<Map<String, Object>>> signIn(
            @RequestParam String email,
            @RequestParam String password) {
        
        Map<String, Object> result = authService.signInWithEmail(email, password);
        
        if (result.containsKey("error")) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(result.get("error").toString()));
        }
        
        return ResponseEntity.ok(ApiResponse.success("로그인 성공", result));
    }
    
    // Google OAuth 제거 - 카카오 OAuth만 사용
    
    @GetMapping("/kakao")
    @Operation(summary = "Kakao OAuth 로그인 URL", description = "Kakao OAuth 로그인 URL을 반환")
    public ResponseEntity<ApiResponse<String>> getKakaoAuthUrl() {
        String authUrl = authService.getKakaoAuthUrl();
        return ResponseEntity.ok(ApiResponse.success("Kakao OAuth URL 생성 성공", authUrl));
    }
    
    @GetMapping("/callback")
    @Operation(summary = "카카오 OAuth 콜백", description = "카카오 OAuth 인증 후 콜백 처리")
    public ResponseEntity<ApiResponse<Map<String, Object>>> handleKakaoCallback(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String access_token,
            @RequestParam(required = false) String refresh_token,
            @RequestParam(required = false) String error) {
        
        // 에러 처리
        if (error != null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("OAuth 인증 실패: " + error));
        }
        
        // access_token이 있는 경우 (프론트엔드에서 전달)
        if (access_token != null) {
            Map<String, Object> result = authService.handleKakaoCallbackWithToken(access_token, refresh_token);
            
            if (result.containsKey("error")) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error(result.get("error").toString()));
            }
            
            return ResponseEntity.ok(ApiResponse.success("카카오 로그인 성공", result));
        }
        
        // code가 있는 경우 (기존 방식)
        if (code != null) {
            Map<String, Object> result = authService.handleKakaoCallback(code);
            
            if (result.containsKey("error")) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error(result.get("error").toString()));
            }
            
            return ResponseEntity.ok(ApiResponse.success("카카오 로그인 성공", result));
        }
        
        return ResponseEntity.badRequest()
                .body(ApiResponse.error("필수 파라미터가 없습니다: code 또는 access_token"));
    }
    
    @PostMapping("/validate")
    @Operation(summary = "JWT 토큰 검증", description = "JWT 토큰의 유효성을 검증")
    public ResponseEntity<ApiResponse<Map<String, Object>>> validateToken(
            @RequestHeader("Authorization") String token) {
        
        String actualToken = extractToken(token);
        Map<String, Object> result = authService.validateToken(actualToken);
        
        if (!(Boolean) result.get("valid")) {
            return createErrorResponse(result.get("error").toString());
        }
        
        return ResponseEntity.ok(ApiResponse.success("토큰 검증 성공", result));
    }
    
    @PostMapping("/signout")
    @Operation(summary = "로그아웃", description = "사용자 로그아웃")
    public ResponseEntity<ApiResponse<Map<String, Object>>> signOut(
            @RequestHeader("Authorization") String token) {
        
        String actualToken = extractToken(token);
        Map<String, Object> result = authService.signOut(actualToken);
        
        if (!(Boolean) result.get("success")) {
            return createErrorResponse(result.get("error").toString());
        }
        
        return ResponseEntity.ok(ApiResponse.success("로그아웃 성공", result));
    }
    
    @GetMapping("/me")
    @Operation(summary = "사용자 정보 조회", description = "현재 로그인한 사용자 정보 조회")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUser(
            @RequestHeader("Authorization") String token) {
        
        String actualToken = extractToken(token);
        Map<String, Object> result = authService.getCurrentUser(actualToken);
        
        if (result.containsKey("error")) {
            return createErrorResponse(result.get("error").toString());
        }
        
        return ResponseEntity.ok(ApiResponse.success("사용자 정보 조회 성공", result));
    }
}
