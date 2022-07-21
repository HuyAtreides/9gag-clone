package com.huyphan.models;

import java.util.LinkedHashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@Entity
public class Section {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id", nullable = false)
    private Long id;

    @Column(name = "Name", nullable = false, length = 50, unique = true)
    private String name;

    @Lob
    @Column(name = "ImgUrl", nullable = false)
    private String imgUrl;

    @ManyToMany
    @JoinTable(name = "FavoriteSection",
            joinColumns = @JoinColumn(name = "SectionId"),
            inverseJoinColumns = @JoinColumn(name = "UserId"))
    private Set<User> users = new LinkedHashSet<>();

    @OneToMany(mappedBy = "section")
    private Set<Post> posts = new LinkedHashSet<>();
}