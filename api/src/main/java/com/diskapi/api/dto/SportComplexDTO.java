package com.diskapi.api.dto;

import com.diskapi.api.common.Address;
import com.diskapi.api.model.SportComplex;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public class SportComplexDTO {
    public record PostSportComplexDTO(
            @NotNull String cnpj,
            @NotNull String name,
            @NotNull Address address
    ){}

    public record SportComplexResponseDTO(
            UUID id,
            String name,
            String cnpj,
            Address address,
            List<CourtDTO.CourtResponseDTO> courts
    ) {
        public SportComplexResponseDTO(SportComplex c){
            this(c.getId(), c.getName(), c.getCnpj(), c.getAddress(), c.getCourts().stream().map(CourtDTO.CourtResponseDTO::new).toList());
        }
    }
}
