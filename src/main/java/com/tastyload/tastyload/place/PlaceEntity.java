package com.tastyload.tastyload.place;

import com.tastyload.tastyload.users.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "places")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaceEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
    @Column(nullable = false, name = "place_id", unique = true)
    private String placeId;

    @Column(nullable = false, name = "place_name")
    private String placeName;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "uuid")
    private UserEntity user;
    
    // @Column(name = "tags")
    // private String tags;
    
    // @Column(name = "views")
    // private int views;
    
    // @Column(name = "rating_avg")
    // private double ratingAvg;
    
    // @Column(name = "rating_count")
    // private int ratingCount;

    // @Column(name = "like_count")
    // private int likeCount;
    
    // @Column(name = "comment_count")
    // private int commentCount;
    

    @Column(name = "latitude")
    private double latitude;

    @Column(name = "longitude")
    private double longitude;
    
    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
        updatedAt = java.time.LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.LocalDateTime.now();
    }
}