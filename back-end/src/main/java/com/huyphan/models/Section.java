package com.huyphan.models;

import java.util.LinkedHashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.Nationalized;

@NoArgsConstructor
@Getter
@Setter
@Entity
@DynamicInsert
public class Section {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id", nullable = false)
    private Long id;

    @Column(name = "Name", nullable = false, length = 50, unique = true)
    @Nationalized
    private String name;

    @Lob
    @Column(name = "ImgUrl", nullable = false)
    private String imgUrl;

    @ManyToMany(mappedBy = "favoriteSections")
    private Set<User> users = new LinkedHashSet<>();

    @OneToMany(mappedBy = "section", cascade = {CascadeType.REMOVE})
    private Set<Post> posts = new LinkedHashSet<>();

    @Nationalized
    @Lob
    @Column(name = "displayname")
    private String displayName;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        Section section = (Section) o;

        return id != null ? id.equals(section.id) : section.id == null;
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
}