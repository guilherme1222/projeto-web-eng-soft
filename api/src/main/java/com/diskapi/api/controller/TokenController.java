package com.diskapi.api.controller;

import com.diskapi.api.dto.LoginRequestDTO;
import com.diskapi.api.dto.LoginResponseDTO;
import com.diskapi.api.model.User;
import com.diskapi.api.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Optional;

@RestController
@RequestMapping("login")
public class TokenController {
    private final JwtEncoder jwtEncoder;
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public TokenController(JwtEncoder jwtEncoder, UserRepository userRepository, Argon2PasswordEncoder passwordEncoder) {
        this.jwtEncoder = jwtEncoder;
        this.repository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        Optional<User> user = repository.findByUsername(loginRequest.username());
        if (user.isEmpty() || !passwordEncoder.matches(loginRequest.password(), user.get().getPassword()))
            throw new BadCredentialsException("user or password invalid");

        Instant now = Instant.now();
        long expiresIn = 600L;

        var claims = JwtClaimsSet.builder()
                .issuer("backend")
                .subject(user.get().getId().toString())
                .expiresAt(now.plusSeconds(expiresIn))
                .build();

        String token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
        return ResponseEntity.status(HttpStatus.OK).body(new LoginResponseDTO(token, expiresIn));
    }
}