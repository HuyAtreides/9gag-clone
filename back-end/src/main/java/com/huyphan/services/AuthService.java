package com.huyphan.services;

import com.huyphan.models.LoginData;
import com.huyphan.models.UserSecret;
import com.huyphan.models.exceptions.AuthException;
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
            System.out.println(loginData.getPassword());
            String username = loginData.getUsername();
            System.out.println(username);
            UserDetails user = userService.loadUserByUsername(username);
            String password = user.getPassword();
            String providedPassword = loginData.getPassword();

            if (!passwordEncoder.matches(providedPassword, password)) {
                String token = jwtUtil.generateToken(user);
                return new UserSecret(token);
            }

            throw new AuthException("Username or password is incorrect");
        } catch (UsernameNotFoundException exception) {
            throw new AuthException("Username or password is incorrect");
        }
    }
}
