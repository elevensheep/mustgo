package com.tastyload.tastyload.users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {

    List<UserEntity> findAll();
    
    Optional<UserEntity> findByEmail(String email);
    
    Optional<UserEntity> findById(UUID id);
    
    boolean existsByEmail(String email);
    
    boolean existsByNickname(String nickname);
}
