package com.huyphan.models;

import com.huyphan.enums.Role;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
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
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "[User]")
@NamedEntityGraph(name = "UserEntityGraph", attributeNodes = {
        @NamedAttributeNode("favoriteSections"),
})
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id", nullable = false)
    private Long id;

    @Column(name = "Username", nullable = false, length = 20, unique = true)
    private String username;

    @Column(name = "AvatarUrl", nullable = false)
    private String avatarUrl;

    @Column(name = "DisplayName", nullable = false, length = 30)
    private String displayName;

    @Column(name = "Country", nullable = false, length = 70)
    private String country;

    @Column(name = "Password")
    private String password;

    @Column(name = "Provider", length = 20)
    private String provider;

    @ManyToMany
    @JoinTable(name = "SavedPost",
            joinColumns = @JoinColumn(name = "UserId"),
            inverseJoinColumns = @JoinColumn(name = "PostId"))
    private Set<Post> savedPosts = new LinkedHashSet<>();

    @ManyToMany
    @JoinTable(name = "VotedPost",
            joinColumns = @JoinColumn(name = "UserId"),
            inverseJoinColumns = @JoinColumn(name = "PostId"))
    private Set<Post> votedPosts = new LinkedHashSet<>();

    @ManyToMany(mappedBy = "users")
    private Set<Section> favoriteSections = new LinkedHashSet<>();

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
