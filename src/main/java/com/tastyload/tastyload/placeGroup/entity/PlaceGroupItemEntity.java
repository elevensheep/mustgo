package com.tastyload.tastyload.placeGroup.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

import com.tastyload.tastyload.place.PlaceEntity;

@Entity
@Table(name = "place_group_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaceGroupItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_group_id", referencedColumnName = "id")
    private PlaceGroupEntity placeGroup;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id", referencedColumnName = "id")
    private PlaceEntity place;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
}
