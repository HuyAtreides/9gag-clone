package com.huyphan.services;

import com.huyphan.models.RegisterData;
import com.huyphan.models.User;
import com.huyphan.models.exceptions.UserAlreadyExistsException;
import com.huyphan.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username is not found"));
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

    public User getUser() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return (User) securityContext.getAuthentication().getPrincipal();
    }
}
