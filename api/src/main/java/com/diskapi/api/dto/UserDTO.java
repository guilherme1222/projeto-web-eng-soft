package com.diskapi.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class UserDTO {

    public record  PublicUserDTO(
        String username,
        String nome,
        String img_url
    ){}

    public record  PostUserDTO(
        @NotBlank String username,
        @NotBlank String name,
        @NotBlank String cpf,
        @NotBlank @Email() String email,
        @NotBlank String password,
        @NotBlank String birthday
    ){}
}