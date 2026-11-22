package com.diskapi.api.dto;

import com.diskapi.api.common.Address;
import com.diskapi.api.enums.CourtType;
import com.diskapi.api.model.Court;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class CourtDTO {
    public record PostCourtDTO(
            @NotNull String name,
            @NotNull CourtType type,
            @NotNull float hourValue
    ){}

    public record CourtResponseDTO(
            UUID id,
            String name,
            float hourValue,
            CourtType type
    ) {
        public CourtResponseDTO(Court c) {
            this(c.getId(), c.getName(), c.getHourValue(), c.getType());
        }
    }
}
