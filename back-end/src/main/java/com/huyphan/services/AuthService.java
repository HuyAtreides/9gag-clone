package com.huyphan.services;

import com.huyphan.models.LoginData;
import com.huyphan.models.RegisterData;
import com.huyphan.models.User;
import com.huyphan.models.UserSecret;
import com.huyphan.models.exceptions.AuthException;
import com.huyphan.models.exceptions.UserAlreadyExistsException;
import com.huyphan.utils.JwtUtil;
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

            if (passwordEncoder.matches(providedPassword, password)) {
                String token = jwtUtil.generateToken(user);
                return new UserSecret(token);
            }

            throw new AuthException("Username or password is incorrect");
        } catch (UsernameNotFoundException exception) {
            throw new AuthException("Username or password is incorrect");
        }
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
}
