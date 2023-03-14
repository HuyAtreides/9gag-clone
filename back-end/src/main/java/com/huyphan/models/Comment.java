package com.huyphan.models;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
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
import javax.persistence.NamedEntityGraphs;
import javax.persistence.NamedSubgraph;
import javax.persistence.OneToMany;
import javax.persistence.Transient;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.Nationalized;

@NoArgsConstructor
@Getter
@Setter
@Entity
@NamedEntityGraphs({
        @NamedEntityGraph(name = "CommentEntityGraph", attributeNodes = {
                @NamedAttributeNode(value = "replyTo", subgraph = "CommentEntityGraph"),
                @NamedAttributeNode(value = "user")
        }, subgraphs = {
                @NamedSubgraph(name = "CommentEntityGraph", attributeNodes = {
                        @NamedAttributeNode(value = "user")
                })
        }),
})
@DynamicInsert
@DynamicUpdate
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id", nullable = false)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PostId")
    private Post post;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ReplyToId")
    private Comment replyTo;
    @Lob
    @Column(name = "Text")
    @Nationalized
    private String text;
    @Lob
    @Column(name = "MediaUrl")
    private String mediaUrl;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserId")
    private User user;
    @Column(name = "Upvotes")
    private Integer upvotes;
    @Column(name = "Downvotes")
    private Integer downvotes;
    @OneToMany(mappedBy = "replyTo")
    private Set<Comment> replies = new LinkedHashSet<>();
    @Column(name = "MediaType", length = 70)
    private String mediaType;
    @Column(name = "CommentDate")
    private Instant date;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ParentId")
    private Comment parent;
    @OneToMany(mappedBy = "parent")
    @Fetch(FetchMode.SUBSELECT)
    private Set<Comment> children = new LinkedHashSet<>();

    @ManyToMany
    @JoinTable(name = "UpvotedComment",
            joinColumns = @JoinColumn(name = "CommentId"),
            inverseJoinColumns = @JoinColumn(name = "UserId"))
    @Fetch(FetchMode.SUBSELECT)
    private Set<User> usersUpvote = new LinkedHashSet<>();

    @ManyToMany
    @JoinTable(name = "DownvotedComment",
            joinColumns = @JoinColumn(name = "CommentId"),
            inverseJoinColumns = @JoinColumn(name = "UserId"))
    @Fetch(FetchMode.SUBSELECT)
    private Set<User> usersDownvote = new LinkedHashSet<>();

    @ManyToMany
    @JoinTable(name = "CommentFollower",
            joinColumns = @JoinColumn(name = "CommentId"),
            inverseJoinColumns = @JoinColumn(name = "UserId"))
    private Set<User> followers = new LinkedHashSet<>();

    @Transient
    private boolean isUpvoted;

    @Transient
    private boolean isDownvoted;

    @Transient
    private int totalChildren;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Comment comment = (Comment) o;
        return id.equals(comment.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    public boolean getIsDownvoted() {
        return isDownvoted;
    }

    public boolean getIsUpvoted() {
        return isUpvoted;
    }
}