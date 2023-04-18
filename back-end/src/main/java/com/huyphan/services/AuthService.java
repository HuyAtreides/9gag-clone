package com.huyphan.services;

import com.huyphan.models.LoginData;
import com.huyphan.models.RegisterData;
import com.huyphan.models.SocialLoginData;
import com.huyphan.models.User;
import com.huyphan.models.UserSecret;
import com.huyphan.models.exceptions.AuthException;
import com.huyphan.models.exceptions.UserAlreadyExistsException;
import com.huyphan.repositories.UserRepository;
import com.huyphan.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {


    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepo;

    /**
     * Log user in.
     *
     * @param loginData Data required for login.
     * @throws UsernameNotFoundException if user is not found or the provided password isn't
     *                                   correct.
     */
    public UserSecret login(LoginData loginData) throws AuthException {
        try {
            String username = loginData.getUsername();
            UserDetails user = userService.loadUserByUsername(username);
            String password = user.getPassword();
            String providedPassword = loginData.getPassword();

            if (password != null && passwordEncoder.matches(providedPassword, password)) {
                String token = jwtUtil.generateToken(user);
                return new UserSecret(token);
            }

            throw new AuthException("Username or password is incorrect");
        } catch (UsernameNotFoundException exception) {
            throw new AuthException("Username or password is incorrect");
        }
    }

    public UserSecret login(SocialLoginData socialLoginData) {
        String username = socialLoginData.getUsername();

        if (userRepo.existsByUsername(username)) {
            UserDetails user = userService.loadUserByUsername(username);
            String token = jwtUtil.generateToken(user);
            return new UserSecret(token);
        }

        User newUser = new User();
        newUser.setAvatarUrl(socialLoginData.getAvatarUrl());
        newUser.setCountry(socialLoginData.getCountry());
        newUser.setDisplayName(socialLoginData.getDisplayName());
        newUser.setUsername(socialLoginData.getUsername());
        newUser.setProvider(socialLoginData.getProvider());
        User savedUser = userRepo.save(newUser);
        String token = jwtUtil.generateToken(savedUser);

        return new UserSecret(token);
    }

    /**
     * Register an user.
     *
     * @param registerData Data required for registration.
     * @throws UsernameNotFoundException if user is not found or the provided password isn't
     *                                   correct.
     */
    public UserSecret register(RegisterData registerData) throws UserAlreadyExistsException {
        User newUser = userService.register(registerData);
        String token = jwtUtil.generateToken(newUser);
        return new UserSecret(token);
    }

    /**
     * Refresh an expired user secret.
     *
     * @param userSecret The expired user secret
     */
    public UserSecret refreshToken(UserSecret userSecret) {
        Claims claims = jwtUtil.parseExpiredToken(userSecret.getToken());
        String username = claims.getSubject();
        String token = jwtUtil.generateToken(userService.loadUserByUsername(username));
        return new UserSecret(token);
    }
}
