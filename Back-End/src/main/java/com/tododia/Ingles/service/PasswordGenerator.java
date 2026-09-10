package com.tododia.Ingles.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


public class PasswordGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String hash = encoder.encode("12345");

        System.out.println(hash);
        System.out.println(encoder.matches("12345", hash));
    }
}
