package com.tastyload.tastyload.users;

import com.tastyload.tastyload.common.dto.ApiResponse;
import com.tastyload.tastyload.users.dto.UserRequest;
import com.tastyload.tastyload.users.dto.UserResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@Tag(name = "사용자 관리", description = "사용자 CRUD API")
public class UsersController {
    
    private final UserService userService;
    
    public UsersController(UserService userService) {
        this.userService = userService;
    }
    
    /**
     * 모든 사용자 조회
     */
    @Operation(summary = "모든 사용자 조회", description = "시스템에 등록된 모든 사용자 목록을 조회합니다")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "사용자 목록 조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserEntity> users = userService.getAllUsers();
        List<UserResponse> userResponses = users.stream()
                .map(UserResponse::from)
                .toList();
        return ResponseEntity.ok(ApiResponse.success(userResponses));
    }
    
    /**
     * ID로 사용자 조회
     */
    @Operation(summary = "사용자 ID로 조회", description = "UUID를 사용하여 특정 사용자 정보를 조회합니다")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "사용자 조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없음"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 UUID 형식")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(
            @Parameter(description = "사용자 UUID", example = "550e8400-e29b-41d4-a716-446655440000")
            @PathVariable UUID id) {
        Optional<UserEntity> user = userService.getUserById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success(UserResponse.from(user.get())));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("사용자를 찾을 수 없습니다", "USER_NOT_FOUND"));
        }
    }
    
    /**
     * 사용자 생성
     */
    @Operation(summary = "새 사용자 생성", description = "새로운 사용자 계정을 생성합니다")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "사용자 생성 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청 데이터"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "이미 존재하는 이메일 또는 닉네임")
    })
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "사용자 생성 정보")
            @RequestBody UserRequest userRequest) {
        try {
            // UserRequest를 UserEntity로 변환
            UserEntity user = new UserEntity();
            user.setEmail(userRequest.getEmail());
            user.setNickname(userRequest.getNickname());
            
            UserEntity createdUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("사용자가 성공적으로 생성되었습니다", UserResponse.from(createdUser)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage(), "INVALID_REQUEST"));
        }
    }
    
    /**
     * 사용자 정보 수정
     */
    @Operation(summary = "사용자 정보 수정", description = "기존 사용자의 정보를 수정합니다")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "사용자 정보 수정 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청 데이터"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없음")
    })
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @Parameter(description = "사용자 UUID", example = "550e8400-e29b-41d4-a716-446655440000")
            @PathVariable UUID id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "수정할 사용자 정보")
            @RequestBody UserRequest userRequest) {
        try {
            // UserRequest를 UserEntity로 변환
            UserEntity user = new UserEntity();
            user.setEmail(userRequest.getEmail());
            user.setNickname(userRequest.getNickname());
            
            UserEntity updatedUser = userService.updateUser(id, user);
            return ResponseEntity.ok(ApiResponse.success("사용자 정보가 성공적으로 수정되었습니다", UserResponse.from(updatedUser)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage(), "INVALID_REQUEST"));
        }
    }
    
    /**
     * 사용자 삭제
     */
    @Operation(summary = "사용자 삭제", description = "특정 사용자 계정을 삭제합니다")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "사용자 삭제 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없음")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @Parameter(description = "사용자 UUID", example = "550e8400-e29b-41d4-a716-446655440000")
            @PathVariable UUID id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(ApiResponse.success("사용자가 성공적으로 삭제되었습니다", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("사용자를 찾을 수 없습니다", "USER_NOT_FOUND"));
        }
    }
    
    /**
     * 이메일 중복 체크
     */
    @Operation(summary = "이메일 중복 체크", description = "이메일 주소가 이미 사용 중인지 확인합니다")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "이메일 중복 체크 완료")
    })
    @GetMapping("/check-email")
    public ResponseEntity<ApiResponse<Boolean>> checkEmail(
            @Parameter(description = "확인할 이메일 주소", example = "user@example.com")
            @RequestParam String email) {
        boolean exists = userService.isEmailExists(email);
        return ResponseEntity.ok(ApiResponse.success(exists ? "이메일이 이미 사용 중입니다" : "사용 가능한 이메일입니다", exists));
    }
    
}
