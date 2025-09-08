package com.tastyload.tastyload.users;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class UserService {
    
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    /**
     * 모든 사용자 조회
     */
    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }
    
    /**
     * ID로 사용자 조회
     */
    public Optional<UserEntity> getUserById(UUID id) {
        return userRepository.findById(id);
    }
    
    /**
     * 이메일로 사용자 조회
     */
    public Optional<UserEntity> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    /**
     * 사용자 생성
     */
    @Transactional
    public UserEntity createUser(UserEntity user) {
        // 이메일 중복 체크
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다: " + user.getEmail());
        }
        
        // 닉네임 중복 체크
        if (userRepository.existsByNickname(user.getNickname())) {
            throw new IllegalArgumentException("이미 존재하는 닉네임입니다: " + user.getNickname());
        }
        
        // 비밀번호 암호화 (실제로는 BCrypt 등 사용)
        // user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        return userRepository.save(user);
    }
    
    /**
     * 사용자 정보 수정
     */
    @Transactional
    public UserEntity updateUser(UUID id, UserEntity updatedUser) {
        UserEntity existingUser = userRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + id));
        
        // 이메일 변경 시 중복 체크
        if (!existingUser.getEmail().equals(updatedUser.getEmail()) && 
            userRepository.existsByEmail(updatedUser.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다: " + updatedUser.getEmail());
        }
        
        // 닉네임 변경 시 중복 체크
        if (!existingUser.getNickname().equals(updatedUser.getNickname()) && 
            userRepository.existsByNickname(updatedUser.getNickname())) {
            throw new IllegalArgumentException("이미 존재하는 닉네임입니다: " + updatedUser.getNickname());
        }
        
        // 기존 정보 업데이트
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setNickname(updatedUser.getNickname());
        // 비밀번호는 별도 처리 (암호화 등)
        
        return userRepository.save(existingUser);
    }
    
    /**
     * 사용자 삭제
     */
    @Transactional
    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다: " + id);
        }
        userRepository.deleteById(id);
    }
    
    /**
     * 이메일 중복 체크
     */
    public boolean isEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }
    
    /**
     * 닉네임 중복 체크
     */
    public boolean isNicknameExists(String nickname) {
        return userRepository.existsByNickname(nickname);
    }
    
    /**
     * 사용자 수 조회
     */
    public long getUserCount() {
        return userRepository.count();
    }
    
    /**
     * OAuth 사용자 생성 (카카오, 구글 등)
     */
    @Transactional
    public UserEntity createOAuthUser(String email, String nickname, String profileImageUrl) {
        // 이메일 중복 체크
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다: " + email);
        }
        
        // 닉네임 중복 체크
        if (userRepository.existsByNickname(nickname)) {
            throw new IllegalArgumentException("이미 존재하는 닉네임입니다: " + nickname);
        }
        
        UserEntity oauthUser = new UserEntity();
        oauthUser.setEmail(email);
        oauthUser.setNickname(nickname);
        oauthUser.setProfileImageUrl(profileImageUrl);
        
        return userRepository.save(oauthUser);
    }
    
    /**
     * OAuth 사용자 존재 여부 확인 (email로 확인)
     */
    public boolean isOAuthUserExists(String email) {
        return userRepository.existsByEmail(email);
    }
    
    /**
     * OAuth 사용자 정보 업데이트
     */
    @Transactional
    public UserEntity updateOAuthUser(String email, String nickname, String profileImageUrl) {
        UserEntity existingUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + email));
        
        // 닉네임이 변경된 경우에만 중복 체크
        if (!existingUser.getNickname().equals(nickname) && 
            userRepository.existsByNickname(nickname)) {
            throw new IllegalArgumentException("이미 존재하는 닉네임입니다: " + nickname);
        }
        
        existingUser.setNickname(nickname);
        existingUser.setProfileImageUrl(profileImageUrl);
        
        return userRepository.save(existingUser);
    }
}
