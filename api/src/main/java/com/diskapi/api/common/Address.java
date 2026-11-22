package com.diskapi.api.common;

import jakarta.persistence.Embeddable;

@Embeddable
public class Address {

    private int number;
    private String street;
    private String city;
    private String state;
    private String cep;

    protected Address() {}

    public Address(
            String street,
            String city,
            String state,
            String cep
    ) {
        this.street = street;
        this.city = city;
        this.state = state;
        this.cep = cep;
    }

    public String fullAddress() {
        return street + ", " + city;
    }
}
