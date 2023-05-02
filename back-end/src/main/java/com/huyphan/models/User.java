package com.huyphan.models;

import com.huyphan.models.converters.CountryConverter;
import com.huyphan.models.converters.SocialProviderConverter;
import com.huyphan.models.enums.Country;
import com.huyphan.models.enums.Role;
import com.huyphan.models.enums.SocialProvider;
import com.huyphan.services.UserService;
import com.huyphan.services.followactioninvoker.Followable;
import java.time.Instant;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
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
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Nationalized;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "[User]")
@DynamicInsert
@DynamicUpdate
public class User implements UserDetails, Followable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id", nullable = false)
    private Long id;
    @Column(name = "Username", nullable = false, length = 100, unique = true)
    private String username;
    @Column(name = "AvatarUrl")
    private String avatarUrl;
    @Column(name = "DisplayName", nullable = false, length = 30)
    @Nationalized
    private String displayName;
    @Column(name = "Country", length = 70)
    @Convert(converter = CountryConverter.class)
    private Country country;
    @Column(name = "Password")
    private String password;
    @Column(name = "Provider", length = 20)
    @Convert(converter = SocialProviderConverter.class)
    private SocialProvider provider;
    @ManyToMany
    @JoinTable(name = "SavedPost",
            joinColumns = @JoinColumn(name = "UserId"),
            inverseJoinColumns = @JoinColumn(name = "PostId"))
    private Set<Post> savedPosts = new LinkedHashSet<>();
    @ManyToMany
    @JoinTable(name = "FavoriteSection",
            joinColumns = @JoinColumn(name = "UserId"),
            inverseJoinColumns = @JoinColumn(name = "SectionId"))
    private Set<Section> favoriteSections = new LinkedHashSet<>();
    @Column(name = "Created")
    private Instant created;

    @Column(name = "IsPrivate")
    private boolean isPrivate;

    @Column(name = "SocialId")
    private String socialId;

    public boolean getIsPrivate() {
        return isPrivate;
    }

    @ManyToMany
    @JoinTable(name = "UpvotedComment",
            joinColumns = @JoinColumn(name = "UserId"),
            inverseJoinColumns = @JoinColumn(name = "CommentId"))
    private Set<Comment> upvotedComments = new LinkedHashSet<>();
    @ManyToMany
    @JoinTable(name = "DownvotedComment",
            joinColumns = @JoinColumn(name = "UserId"),
            inverseJoinColumns = @JoinColumn(name = "CommentId"))
    private Set<Comment> downvotedComments = new LinkedHashSet<>();
    @ManyToMany
    @JoinTable(name = "FollowingUser",
            joinColumns = @JoinColumn(name = "UserId"),
            inverseJoinColumns = @JoinColumn(name = "FollowerId"))
    private Set<User> followers = new LinkedHashSet<>();
    @ManyToMany
    @JoinTable(name = "PostFollower",
            joinColumns = @JoinColumn(name = "UserId"),
            inverseJoinColumns = @JoinColumn(name = "PostId"))
    private Set<Post> followingPosts = new LinkedHashSet<>();

    @ManyToMany(mappedBy = "followers")
    private Set<User> following = new LinkedHashSet<>();

    @ManyToMany
    @JoinTable(name = "CommentFollower",
            joinColumns = @JoinColumn(name = "UserId"),
            inverseJoinColumns = @JoinColumn(name = "CommentId"))
    private Set<Comment> followingComments = new LinkedHashSet<>();
    @ManyToMany(mappedBy = "followers")
    private Set<User> followingUsers = new LinkedHashSet<>();
    @ManyToMany
    @JoinTable(name = "UpvotedPost",
            joinColumns = @JoinColumn(name = "UserId"),
            inverseJoinColumns = @JoinColumn(name = "PostId"))
    private Set<Post> upvotedPosts = new LinkedHashSet<>();
    @OneToMany(mappedBy = "user")
    private Set<Comment> comments = new LinkedHashSet<>();

    @OneToMany(mappedBy = "user")
    private Set<Post> posts = new LinkedHashSet<>();

    @OneToMany(mappedBy = "sender")
    private Set<FollowRequest> sentRequests = new LinkedHashSet<>();

    @OneToMany(mappedBy = "receiver")
    private Set<FollowRequest> receivedRequests = new LinkedHashSet<>();

    @ManyToMany
    @JoinTable(name = "DownvotedPost",
            joinColumns = @JoinColumn(name = "UserId"),
            inverseJoinColumns = @JoinColumn(name = "PostId"))
    private Set<Post> downvotedPosts = new LinkedHashSet<>();
    @Transient
    private boolean followed;

    @Transient
    private boolean receivedFollowRequest;

    @Override
    public User getOwner() {
        return this;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        GrantedAuthority grantedAuthority = Role.USER::getRoleName;
        return List.of(grantedAuthority);
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
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

        User user = (User) o;

        return Objects.equals(user.getId(), id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
