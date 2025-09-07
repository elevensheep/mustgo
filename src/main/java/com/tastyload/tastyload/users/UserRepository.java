package com.tastyload.tastyload.users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    
    Optional<UserEntity> findByEmail(String email);
    
    Optional<UserEntity> findByUuid(UUID uuid);
    
    boolean existsByEmail(String email);
    
    boolean existsByNickname(String nickname);
}
