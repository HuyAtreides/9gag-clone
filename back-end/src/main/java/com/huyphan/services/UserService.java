package com.huyphan.services;

import com.huyphan.models.Post;
import com.huyphan.models.RegisterData;
import com.huyphan.models.User;
import com.huyphan.models.exceptions.UserAlreadyExistsException;
import com.huyphan.models.exceptions.UserException;
import com.huyphan.repositories.UserRepository;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Get current authenticated user.
     */
    static public User getUser() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Object principal = securityContext.getAuthentication().getPrincipal();

        if (!(principal instanceof UserDetails)) {
            return null;
        }

        return (User) principal;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username is not found"));
    }

    @Transactional
    public void removeSavedPost(Post post) {
        Long userId = getUser().getId();

        try {
            getUserById(userId).getSavedPosts()
                    .removeIf((savedPost) -> Objects.equals(savedPost.getId(), post.getId()));
        } catch (UserException e) {
            e.printStackTrace();
        }
    }

    @Transactional
    public void savePost(Post post) {
        Long userId = getUser().getId();
        try {
            getUserById(userId).getSavedPosts().add(post);
        } catch (UserException e) {
            e.printStackTrace();
        }
    }

    public User register(RegisterData registerData) throws UserAlreadyExistsException {
        User newUser = new User();
        String username = registerData.getUsername();
        String encodedPassword = passwordEncoder.encode(registerData.getPassword());
        newUser.setUsername(username);
        newUser.setDisplayName(registerData.getDisplayName());
        newUser.setCountry(registerData.getCountry());
        newUser.setPassword(encodedPassword);

        if (userRepo.existsByUsername(username)) {
            throw new UserAlreadyExistsException("Username is taken");
        }

        return userRepo.save(newUser);
    }

    /**
     * Get a specific user using user's id.
     */
    public User getUserById(Long id) throws UserException {
        return userRepo.findById(id).orElseThrow(() -> new UserException("User is not found"));
    }
}
