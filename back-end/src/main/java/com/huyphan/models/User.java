package com.huyphan.models;

import com.huyphan.models.converters.CountryConverter;
import com.huyphan.models.enums.Country;
import com.huyphan.models.enums.Role;
import java.time.Instant;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
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
import javax.persistence.NamedAttributeNode;
import javax.persistence.NamedEntityGraph;
import javax.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.Nationalized;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "[User]")
@NamedEntityGraph(name = "UserEntityGraph", attributeNodes = {
        @NamedAttributeNode(value = "favoriteSections"),
})
@DynamicInsert
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id", nullable = false)
    private Long id;

    @Column(name = "Username", nullable = false, length = 20, unique = true)
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
    private String provider;

    @ManyToMany
    @JoinTable(name = "SavedPost",
            joinColumns = @JoinColumn(name = "UserId"),
            inverseJoinColumns = @JoinColumn(name = "PostId"))
    private Set<Post> savedPosts = new LinkedHashSet<>();

    @ManyToMany(mappedBy = "users", fetch = FetchType.EAGER)
    private Set<Section> favoriteSections = new LinkedHashSet<>();

    @Column(name = "Created")
    private Instant created;

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
    @JoinTable(name = "UpvotedPost",
            joinColumns = @JoinColumn(name = "UserId"),
            inverseJoinColumns = @JoinColumn(name = "PostId"))
    private Set<Post> upvotedPosts = new LinkedHashSet<>();

    @ManyToMany
    @JoinTable(name = "DownvotedPost",
            joinColumns = @JoinColumn(name = "UserId"),
            inverseJoinColumns = @JoinColumn(name = "PostId"))
    private Set<Post> downvotedPosts = new LinkedHashSet<>();

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
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
