package com.tastyload.tastyload.auth;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tastyload.tastyload.users.UserEntity;
import com.tastyload.tastyload.users.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    
    private final SupabaseConfig supabaseConfig;
    private final RestTemplate restTemplate;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final ObjectMapper objectMapper;
    
    @Value("${app.oauth.redirect.url:http://localhost:8080/auth/callback}")
    private String redirectUrl;
    
    @Value("${kakao.client.id:your-kakao-client-id}")
    private String kakaoClientId;
    
    // 공통 HTTP 헤더 캐싱
    private HttpHeaders commonHeaders;
    
    @Autowired
    public AuthService(SupabaseConfig supabaseConfig, RestTemplate restTemplate, 
                      JwtUtil jwtUtil, UserService userService) {
        this.supabaseConfig = supabaseConfig;
        this.restTemplate = restTemplate;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.objectMapper = new ObjectMapper();
        this.commonHeaders = createCommonHeaders();
    }
    
    /**
     * 공통 HTTP 헤더 생성 (성능 최적화)
     */
    private HttpHeaders createCommonHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", supabaseConfig.getSupabaseAnonKey());
        headers.set("Authorization", "Bearer " + supabaseConfig.getSupabaseAnonKey());
        return headers;
    }
    
    /**
     * 공통 Supabase 요청 실행 (중복 코드 제거)
     */
    private Map<String, Object> executeSupabaseRequest(String url, Map<String, String> requestBody, String operation) {
        try {
            HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, commonHeaders);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            return parseAuthResponse(response.getBody());
        } catch (Exception e) {
            logger.error("{} 실패: {}", operation, e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", operation + " 실패: " + e.getMessage());
            return errorResponse;
        }
    }
    
    /**
     * 이메일/비밀번호로 로그인
     */
    public Map<String, Object> signInWithEmail(String email, String password) {
        String url = supabaseConfig.getAuthUrl() + "/token?grant_type=password";
        
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("email", email);
        requestBody.put("password", password);
        
        return executeSupabaseRequest(url, requestBody, "로그인");
    }
    
    /**
     * 이메일/비밀번호로 회원가입
     */
    public Map<String, Object> signUpWithEmail(String email, String password) {
        String url = supabaseConfig.getAuthUrl() + "/signup";
        
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("email", email);
        requestBody.put("password", password);
        
        return executeSupabaseRequest(url, requestBody, "회원가입");
    }
    
    // Google OAuth 제거 - 카카오 OAuth만 사용
    
    /**
     * Kakao OAuth 로그인 URL 생성 (Supabase 사용)
     */
    public String getKakaoAuthUrl() {
        String url = supabaseConfig.getAuthUrl() + "/authorize";
        return url + "?provider=kakao&redirect_to=" + 
               java.net.URLEncoder.encode(redirectUrl, java.nio.charset.StandardCharsets.UTF_8);
    }
    
    /**
     * 카카오 OAuth 콜백 처리 (Supabase 사용)
     */
    public Map<String, Object> handleKakaoCallback(String code) {
        String url = supabaseConfig.getAuthUrl() + "/token?grant_type=id_token";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", supabaseConfig.getSupabaseAnonKey());
        headers.set("Authorization", "Bearer " + supabaseConfig.getSupabaseAnonKey());
        
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("provider", "kakao");
        requestBody.put("code", code);
        
        HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);
        
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            Map<String, Object> authResult = parseAuthResponse(response.getBody());
            
            // 카카오 사용자 정보를 우리 users 테이블에 저장/업데이트
            if (authResult.containsKey("user") && !authResult.containsKey("error")) {
                saveKakaoUserToDatabase(authResult);
            }
            
            return authResult;
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "카카오 로그인 실패: " + e.getMessage());
            return errorResponse;
        }
    }
    
    /**
     * 카카오 OAuth 콜백 처리 (토큰 직접 전달)
     */
    public Map<String, Object> handleKakaoCallbackWithToken(String accessToken, String refreshToken) {
        try {
            // JWT 토큰에서 사용자 정보 추출
            Map<String, Object> userInfo = extractUserInfoFromToken(accessToken);
            
            if (userInfo.containsKey("error")) {
                return userInfo;
            }
            
            // 사용자 정보를 우리 users 테이블에 저장/업데이트
            saveOAuthUserToDatabase(userInfo, accessToken, refreshToken);
            
            // 응답 구성
            Map<String, Object> result = new HashMap<>();
            result.put("access_token", accessToken);
            if (refreshToken != null) {
                result.put("refresh_token", refreshToken);
            }
            result.put("user", userInfo);
            
            return result;
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "카카오 로그인 실패: " + e.getMessage());
            return errorResponse;
        }
    }
    
    /**
     * JWT 토큰으로 우리 users 테이블에서 사용자 정보 조회
     */
    public Map<String, Object> getCurrentUser(String token) {
        try {
            // JWT 토큰에서 사용자 정보 추출
            Map<String, Object> userInfo = extractUserInfoFromToken(token);
            
            if (userInfo.containsKey("error")) {
                return userInfo;
            }
            
            String email = (String) userInfo.get("email");
            if (email == null || email.isEmpty()) {
                String userId = (String) userInfo.get("id");
                email = "oauth_" + userId + "@oauth.local";
            }
            
            // 우리 users 테이블에서 사용자 정보 조회
            Optional<UserEntity> userEntity = userService.getUserByEmail(email);
            
            if (userEntity.isPresent()) {
                UserEntity user = userEntity.get();
                Map<String, Object> result = new HashMap<>();
                result.put("id", user.getId());
                result.put("email", user.getEmail());
                result.put("nickname", user.getNickname());
                result.put("profileImageUrl", user.getProfileImageUrl());
                result.put("createdAt", user.getCreatedAt());
                result.put("updatedAt", user.getUpdatedAt());
                return result;
            } else {
                // 우리 users 테이블에 사용자가 없는 경우, 토큰에서 정보를 가져와서 저장
                String fullName = (String) userInfo.get("full_name");
                String avatarUrl = (String) userInfo.get("avatar_url");
                String nickname = fullName != null ? fullName : "OAuth사용자" + userInfo.get("id").toString().substring(0, 8);
                
                try {
                    UserEntity newUser = userService.createOAuthUser(email, nickname, avatarUrl);
                    Map<String, Object> result = new HashMap<>();
                    result.put("id", newUser.getId());
                    result.put("email", newUser.getEmail());
                    result.put("nickname", newUser.getNickname());
                    result.put("profileImageUrl", newUser.getProfileImageUrl());
                    result.put("createdAt", newUser.getCreatedAt());
                    result.put("updatedAt", newUser.getUpdatedAt());
                    return result;
                } catch (Exception e) {
                    Map<String, Object> error = new HashMap<>();
                    error.put("error", "사용자 생성 실패: " + e.getMessage());
                    return error;
                }
            }
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "사용자 정보 조회 실패: " + e.getMessage());
            return error;
        }
    }

    
    /**
     * JWT 토큰 검증
     */
    public Map<String, Object> validateToken(String token) {
        try {
            String username = jwtUtil.extractUsername(token);
            if (jwtUtil.validateToken(token, username)) {
                Map<String, Object> result = new HashMap<>();
                result.put("valid", true);
                result.put("username", username);
                return result;
            } else {
                Map<String, Object> result = new HashMap<>();
                result.put("valid", false);
                result.put("error", "유효하지 않은 토큰");
                return result;
            }
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("valid", false);
            result.put("error", "토큰 검증 실패: " + e.getMessage());
            return result;
        }
    }
    
    /**
     * 로그아웃
     */
    public Map<String, Object> signOut(String accessToken) {
        String url = supabaseConfig.getAuthUrl() + "/logout";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", supabaseConfig.getSupabaseAnonKey());
        headers.set("Authorization", "Bearer " + accessToken);
        
        HttpEntity<String> request = new HttpEntity<>(headers);
        
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "로그아웃 성공");
            return result;
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("error", "로그아웃 실패: " + e.getMessage());
            return result;
        }
    }
    
    /**
     * JWT 토큰에서 사용자 정보 추출 (최적화)
     */
    public Map<String, Object> extractUserInfoFromToken(String accessToken) {
        try {
            // JWT 토큰 형식 검증
            if (!isValidJwtFormat(accessToken)) {
                return createErrorResponse("유효하지 않은 JWT 토큰 형식");
            }
            
            // Payload 디코딩
            String[] tokenParts = accessToken.split("\\.");
            String payload = new String(java.util.Base64.getUrlDecoder().decode(tokenParts[1]));
            JsonNode payloadNode = objectMapper.readTree(payload);
            
            // 토큰 만료 시간 확인
            if (payloadNode.has("exp")) {
                long exp = payloadNode.get("exp").asLong();
                long currentTime = System.currentTimeMillis() / 1000;
                if (exp <= currentTime) {
                    return createErrorResponse("토큰이 만료되었습니다");
                }
            }
            
            return extractUserInfoFromPayload(payloadNode);
            
        } catch (Exception e) {
            logger.error("JWT 토큰 파싱 실패: {}", e.getMessage(), e);
            return createErrorResponse("토큰 파싱 실패: " + e.getMessage());
        }
    }
    
    /**
     * JWT 토큰 형식 검증
     */
    private boolean isValidJwtFormat(String jwt) {
        if (jwt == null || jwt.isEmpty()) {
            return false;
        }
        String[] parts = jwt.split("\\.");
        return parts.length == 3;
    }
    
    /**
     * Payload에서 사용자 정보 추출
     */
    private Map<String, Object> extractUserInfoFromPayload(JsonNode payloadNode) {
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", payloadNode.get("sub").asText());
        userInfo.put("email", payloadNode.has("email") ? payloadNode.get("email").asText() : null);
        
        // user_metadata에서 추가 정보 추출
        if (payloadNode.has("user_metadata")) {
            JsonNode userMetadata = payloadNode.get("user_metadata");
            userInfo.put("full_name", userMetadata.has("full_name") ? userMetadata.get("full_name").asText() : null);
            userInfo.put("avatar_url", userMetadata.has("avatar_url") ? userMetadata.get("avatar_url").asText() : null);
            userInfo.put("provider_id", userMetadata.has("provider_id") ? userMetadata.get("provider_id").asText() : null);
        }
        
        return userInfo;
    }
    
    /**
     * 에러 응답 생성 (공통 메서드)
     */
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
    
    /**
     * OAuth 사용자 정보를 데이터베이스에 저장/업데이트 (토큰 기반)
     */
    public void saveOAuthUserToDatabase(Map<String, Object> userInfo, String accessToken, String refreshToken) {
        try {
            String userId = (String) userInfo.get("id");
            String email = (String) userInfo.get("email");
            String fullName = (String) userInfo.get("full_name");
            String avatarUrl = (String) userInfo.get("avatar_url");
            
            // 이메일이 없는 경우 생성
            if (email == null || email.isEmpty()) {
                email = "oauth_" + userId + "@oauth.local";
            }
            
            // 닉네임 설정
            String nickname = fullName != null ? fullName : "OAuth사용자" + userId.substring(0, Math.min(8, userId.length()));
            
            // 기존 OAuth 사용자 확인 (email로 확인)
            if (userService.isOAuthUserExists(email)) {
                // 기존 사용자 정보 업데이트
                try {
                    userService.updateOAuthUser(email, nickname, avatarUrl);
                    System.out.println("기존 OAuth 사용자 정보 업데이트: " + email + ", 닉네임: " + nickname);
                } catch (Exception e) {
                    System.err.println("OAuth 사용자 정보 업데이트 실패: " + e.getMessage());
                }
            } else {
                // 신규 OAuth 사용자 생성
                try {
                    userService.createOAuthUser(email, nickname, avatarUrl);
                    System.out.println("신규 OAuth 사용자 생성: " + email + ", 닉네임: " + nickname);
                } catch (Exception e) {
                    System.err.println("OAuth 사용자 생성 실패: " + e.getMessage());
                    // 닉네임 중복 등의 경우 닉네임에 타임스탬프 추가
                    String uniqueNickname = nickname + "_" + System.currentTimeMillis();
                    try {
                        userService.createOAuthUser(email, uniqueNickname, avatarUrl);
                        System.out.println("고유 닉네임으로 OAuth 사용자 생성: " + email + ", 닉네임: " + uniqueNickname);
                    } catch (Exception e2) {
                        System.err.println("OAuth 사용자 생성 최종 실패: " + e2.getMessage());
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("OAuth 사용자 정보 저장 중 오류: " + e.getMessage());
        }
    }
    
    /**
     * 카카오 사용자 정보를 데이터베이스에 저장/업데이트
     */
    private void saveKakaoUserToDatabase(Map<String, Object> authResult) {
        try {
            JsonNode userNode = (JsonNode) authResult.get("user");
            
            if (userNode != null) {
                String kakaoId = userNode.get("id").asText();
                // 카카오 ID를 email로 사용 (카카오에서 이메일을 제공하지 않는 경우)
                String email = userNode.has("email") && !userNode.get("email").isNull() ? 
                              userNode.get("email").asText() : 
                              "kakao_" + kakaoId + "@kakao.local";
                
                String nickname = userNode.has("user_metadata") && 
                                 userNode.get("user_metadata").has("full_name") ? 
                                 userNode.get("user_metadata").get("full_name").asText() : 
                                 "카카오사용자" + kakaoId.substring(0, Math.min(8, kakaoId.length()));
                
                String profileImageUrl = userNode.has("user_metadata") && 
                                        userNode.get("user_metadata").has("avatar_url") ? 
                                        userNode.get("user_metadata").get("avatar_url").asText() : null;
                
                // 기존 OAuth 사용자 확인 (email로 확인)
                if (userService.isOAuthUserExists(email)) {
                    // 기존 사용자 정보 업데이트 (닉네임, 프로필 이미지 등)
                    try {
                        userService.updateOAuthUser(email, nickname, profileImageUrl);
                        System.out.println("기존 OAuth 사용자 정보 업데이트: " + email + ", 닉네임: " + nickname);
                    } catch (Exception e) {
                        System.err.println("OAuth 사용자 정보 업데이트 실패: " + e.getMessage());
                    }
                } else {
                    // 신규 OAuth 사용자 생성
                    try {
                        userService.createOAuthUser(email, nickname, profileImageUrl);
                        System.out.println("신규 OAuth 사용자 생성: " + email + ", 닉네임: " + nickname);
                    } catch (Exception e) {
                        System.err.println("OAuth 사용자 생성 실패: " + e.getMessage());
                        // 닉네임 중복 등의 경우 닉네임에 타임스탬프 추가
                        String uniqueNickname = nickname + "_" + System.currentTimeMillis();
                        try {
                            userService.createOAuthUser(email, uniqueNickname, profileImageUrl);
                            System.out.println("고유 닉네임으로 OAuth 사용자 생성: " + email + ", 닉네임: " + uniqueNickname);
                        } catch (Exception e2) {
                            System.err.println("OAuth 사용자 생성 최종 실패: " + e2.getMessage());
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("카카오 사용자 정보 저장 중 오류: " + e.getMessage());
        }
    }
    
    /**
     * Supabase 응답 파싱
     */
    private Map<String, Object> parseAuthResponse(String responseBody) {
        try {
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            Map<String, Object> result = new HashMap<>();
            
            if (jsonNode.has("access_token")) {
                result.put("access_token", jsonNode.get("access_token").asText());
            }
            if (jsonNode.has("refresh_token")) {
                result.put("refresh_token", jsonNode.get("refresh_token").asText());
            }
            if (jsonNode.has("user")) {
                result.put("user", jsonNode.get("user"));
            }
            if (jsonNode.has("error")) {
                result.put("error", jsonNode.get("error").asText());
            }
            
            return result;
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "응답 파싱 실패: " + e.getMessage());
            return errorResponse;
        }
    }
}
