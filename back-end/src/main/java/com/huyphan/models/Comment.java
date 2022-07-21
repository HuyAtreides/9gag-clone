package com.huyphan.models;

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
    private String text;

    @Lob
    @Column(name = "MediaUrl")
    private String mediaUrl;

    @ManyToOne
    @JoinColumn(name = "UserId")
    private User user;

    @Column(name = "Upvotes", nullable = false)
    private Integer upvotes;

    @Column(name = "Downvotes", nullable = false)
    private Integer downvotes;

    @OneToMany(mappedBy = "replyTo")
    private Set<Comment> replies = new LinkedHashSet<>();

    @Column(name = "MediaType", length = 70)
    private String mediaType;

    @Column(name = "CommentDate", nullable = false)
    private Instant commentDate;

}