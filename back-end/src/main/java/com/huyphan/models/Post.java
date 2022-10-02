package com.huyphan.models;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.NamedAttributeNode;
import javax.persistence.NamedEntityGraph;
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
@NamedEntityGraph(name = "PostEntityGraph", attributeNodes = {
        @NamedAttributeNode("section"),
})
@DynamicInsert
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id", nullable = false)
    private Long id;

    @Column(name = "Title")
    @Nationalized
    private String title;

    @Lob
    @Column(name = "MediaUrl", nullable = false)
    private String mediaUrl;

    @Column(name = "MediaType", nullable = false, length = 70)
    private String mediaType;

    @Column(name = "Upvotes")
    private Integer upvotes;

    @Column(name = "Downvotes")
    private Integer downvotes;

    @ManyToOne(optional = false)
    @JoinColumn(name = "UserId", nullable = false)
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "SectionId", nullable = false)
    private Section section;

    @Column(name = "UploadTime")
    private Instant uploadTime;

    @Lob
    @Column(name = "Tags")
    @Nationalized
    private String tags;

    @OneToMany(mappedBy = "post", cascade = {CascadeType.REMOVE})
    private Set<Comment> comments = new LinkedHashSet<>();

    @Column(name = "TotalComments")
    private Long totalComments;

    @ManyToMany
    @JoinTable(name = "SavedPost",
            joinColumns = @JoinColumn(name = "PostId"),
            inverseJoinColumns = @JoinColumn(name = "UserId"))
    private Set<User> saveUsers = new LinkedHashSet<>();

    @ManyToMany
    @JoinTable(name = "VotedPost",
            joinColumns = @JoinColumn(name = "PostId"),
            inverseJoinColumns = @JoinColumn(name = "UserId"))
    private Set<User> voteUsers = new LinkedHashSet<>();
}