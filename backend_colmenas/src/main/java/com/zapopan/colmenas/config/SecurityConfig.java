package com.zapopan.colmenas.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable) // Deshabilita CSRF para APIs REST sin sesiones
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/api/auth/**").permitAll() // Permite acceso público a endpoints de autenticación
                .anyRequest().permitAll() // Permite acceso público a cualquier solicitud (TEMPORAL PARA PRUEBAS DE FRONTEND)
            );
            // No se requiere configuración de sesión o JWT por ahora, según el requerimiento.
            // Si se implementa JWT, se añadiría .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)

        return http.build();
    }
}


