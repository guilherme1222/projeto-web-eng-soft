package com.diskapi.api.config;

import com.diskapi.api.model.User;
import com.diskapi.api.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.xml.crypto.Data;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@Configuration
public class AdminUserConfig implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public AdminUserConfig(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (!userRepository.existsByUsername("admin")){
            var a = userRepository.findByUsername("admin");
            System.out.println(a);
            var admin = new User("admin","","Admin","", passwordEncoder.encode("admin123"), LocalDate.parse("2026-01-01") );
            userRepository.save(admin);
        }
    }
}
