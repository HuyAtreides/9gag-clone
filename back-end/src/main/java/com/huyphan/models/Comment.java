package com.huyphan.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonIgnore
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ReplyToId")
    @JsonIgnore
    private Comment replyTo;

    @Lob
    @Column(name = "Text")
    private String text;

    @Lob
    @Column(name = "MediaUrl")
    private String mediaUrl;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "UserId")
    private User user;

    @Column(name = "Upvotes", nullable = false)
    private Integer upvotes;

    @Column(name = "Downvotes", nullable = false)
    private Integer downvotes;

    @OneToMany(mappedBy = "replyTo", fetch = FetchType.EAGER)
    private Set<Comment> replies = new LinkedHashSet<>();
}