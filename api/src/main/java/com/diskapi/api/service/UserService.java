package com.diskapi.api.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.diskapi.api.dto.UserDTO;
import com.diskapi.api.model.User;
import com.diskapi.api.repositories.UserRepository;

@Service
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository){
        this.repository = repository;
    }

    public User getUser(UUID id){
        return repository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public User createUser(UserDTO.PostUserDTO data){
        User newUser = new User(data);
        repository.save(newUser);
        return newUser;
    }

    public List<User> getAllUsers(){
       return repository.findAll();
    }

    public User updateUser(UUID id, UserDTO.PostUserDTO data){
        User user = getUser(id);
        user.setUsername(data.username());
        user.setName(data.name());
        user.setEmail(data.email());
        user.setPassword(data.password());
        user.setBirthday(java.time.LocalDate.parse(data.birthday()));
        repository.save(user);
        return user;
    }

    public void deleteUser(UUID id){
        User user = getUser(id);
        repository.delete(user);
    }

    public boolean validateUsername(String username){
        return repository.existsByUsername(username);
    }
}
