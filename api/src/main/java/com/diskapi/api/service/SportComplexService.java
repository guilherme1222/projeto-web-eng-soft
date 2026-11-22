package com.diskapi.api.service;

import com.diskapi.api.dto.SportComplexDTO.*;
import com.diskapi.api.model.SportComplex;
import com.diskapi.api.repositories.CourtRepository;
import com.diskapi.api.repositories.ManagerRepository;
import com.diskapi.api.repositories.SportComplexRespository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SportComplexService {
    private final SportComplexRespository repository;
    private final CourtRepository courtRepository;
    private final ManagerRepository managerRepository;

    public SportComplexService(SportComplexRespository repository, CourtRepository courtRepository, ManagerRepository managerRepository) {
        this.repository = repository;
        this.courtRepository = courtRepository;
        this.managerRepository = managerRepository;
    }

    public List<SportComplexResponseDTO> getAll() {
        return repository.findAll().stream().map(SportComplexResponseDTO::new).toList();
    }

    public SportComplexResponseDTO getById(UUID id) {

        SportComplex complex = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complexo não encontrado"));

        // A conversão acontece AQUI, em um ambiente seguro!
        return new SportComplexResponseDTO(complex);
    }

    public SportComplex create(PostSportComplexDTO data) {
        SportComplex complex = new SportComplex();
        complex.setCnpj(data.cnpj());
        complex.setName(data.name());
        complex.setAddress(data.address());

        return repository.save(complex);
    }

    public SportComplex update(UUID id, PostSportComplexDTO data) {
        SportComplex complex = repository.findById(id).orElseThrow();
        complex.setCnpj(data.cnpj());
        complex.setName(data.name());
        complex.setAddress(data.address());
        return repository.save(complex);
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Complexo não encontrado.");
        }
        repository.deleteById(id);
    }

}
