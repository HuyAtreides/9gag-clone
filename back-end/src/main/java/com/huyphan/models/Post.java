package com.huyphan.models;

import com.huyphan.models.converters.CountryConverter;
import com.huyphan.models.converters.PostContentTypeConverter;
import com.huyphan.models.enums.PostContentType;
import com.huyphan.services.UserService;
import com.huyphan.services.followactioninvoker.Followable;
import com.huyphan.services.togglenotificationinvoker.Notifiable;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Convert;
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
import javax.persistence.OneToMany;
import javax.persistence.Transient;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Nationalized;

@NoArgsConstructor
@Getter
@Setter
@Entity
@NamedEntityGraph(name = "PostEntityGraph", attributeNodes = {
        @NamedAttributeNode("section"),
        @NamedAttributeNode("user")
})
@DynamicInsert
@DynamicUpdate
public class Post implements Followable, Notifiable, SharedPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id", nullable = false)
    private Long id;
    @Column(name = "Title")
    @Nationalized
    private String title;
    @Lob
    @Column(name = "MediaUrl")
    private String mediaUrl;
    @Column(name = "MediaType", length = 70)
    private String mediaType;

    @Lob
    @Column(name = "Text")
    private String text;

    @Column(name = "ContentType")
    @Convert(converter = PostContentTypeConverter.class)
    private PostContentType contentType;

    @Column(name = "Upvotes")
    private Integer upvotes;
    @Column(name = "Downvotes")
    private Integer downvotes;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "UserId", nullable = false)
    private User user;
    @ManyToOne(optional = false)
    @JoinColumn(name = "SectionId", nullable = false)
    private Section section;
    @Column(name = "UploadTime")
    private Instant uploadTime;
    @Column(name = "NotificationEnabled")
    private boolean notificationEnabled;
    @Column(name = "Anonymous")
    private boolean anonymous;

    @Column(name = "SharedPostId")
    private Long sharedPostId;

    @Lob
    @Column(name = "Tags")
    @Nationalized
    private String tags;
    @OneToMany(mappedBy = "post")
    private Set<Comment> comments = new LinkedHashSet<>();
    @ManyToMany
    @JoinTable(name = "SavedPost",
            joinColumns = @JoinColumn(name = "PostId"),
            inverseJoinColumns = @JoinColumn(name = "UserId"))
    private Set<User> saveUsers = new LinkedHashSet<>();
    @ManyToMany
    @JoinTable(name = "UpvotedPost",
            joinColumns = @JoinColumn(name = "PostId"),
            inverseJoinColumns = @JoinColumn(name = "UserId"))
    private Set<User> upvoteUsers = new LinkedHashSet<>();
    @ManyToMany
    @JoinTable(name = "DownvotedPost",
            joinColumns = @JoinColumn(name = "PostId"),
            inverseJoinColumns = @JoinColumn(name = "UserId"))
    private Set<User> downvoteUsers = new LinkedHashSet<>();
    @ManyToMany
    @JoinTable(name = "PostFollower",
            joinColumns = @JoinColumn(name = "PostId"),
            inverseJoinColumns = @JoinColumn(name = "UserId"))
    private Set<User> followers = new LinkedHashSet<>();

    @Transient
    private int totalComments;
    @Transient
    private boolean isUpvoted;
    @Transient
    private boolean isDownvoted;
    @Transient
    private boolean isInUserFavSections;
    @Transient
    private boolean followed;
    @Transient
    private boolean isSaved;

    @Override
    public User getOwner() {
        return user;
    }

    public boolean getIsSaved() {
        return isSaved;
    }

    public void setIsSaved(boolean saved) {
        isSaved = saved;
    }

    public boolean getIsDownvoted() {
        return isDownvoted;
    }

    public void setIsDownvoted(boolean isDownvoted) {
        this.isDownvoted = isDownvoted;
    }

    public boolean getIsUpvoted() {
        return isUpvoted;
    }

    public void setIsUpvoted(boolean isUpvoted) {
        this.isUpvoted = isUpvoted;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(
                o)) {
            return false;
        }
        Post post = (Post) o;
        return Objects.equals(id, post.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public User getOriginalPoster() {
        return isAnonymous() ? null : getOwner();
    }
}