package com.huyphan.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@Entity
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id", nullable = false)
    private Long id;

    @Lob
    @Column(name = "Title")
    private String title;

    @Lob
    @Column(name = "MediaUrl", nullable = false)
    private String mediaUrl;

    @Column(name = "MediaType", nullable = false, length = 70)
    private String mediaType;

    @Column(name = "Upvotes", nullable = false)
    private Integer upvotes;

    @Column(name = "Downvotes", nullable = false)
    private Integer downvotes;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "UserId", nullable = false)
    private User user;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "SectionId", nullable = false)
    private Section section;

    @Column(name = "UploadTime", nullable = false)
    private Instant uploadTime;

    @OneToMany(mappedBy = "post", fetch = FetchType.EAGER)
    private Set<Comment> comments = new LinkedHashSet<>();
}