package com.tastyload.tastyload.placeGroup.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "place_group_tags")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TagsEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_group_id", referencedColumnName = "id")
    private PlaceGroupEntity placeGroup;

    @Column(name = "tag")
    private String tag;

}
