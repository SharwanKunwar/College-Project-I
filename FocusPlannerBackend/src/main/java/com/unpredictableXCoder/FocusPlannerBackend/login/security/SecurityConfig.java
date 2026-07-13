package com.unpredictableXCoder.FocusPlannerBackend.login.security;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig
{
    /*
    @Bean
    public UserDetailsService users()
    {
        User.UserBuilder userBuilder = User.withDefaultPasswordEncoder();
        UserDetails user1 = userBuilder.username("sharwan").password("xyz").roles("ADMIN").build();
        return new InMemoryUserDetailsManager(user1);
    }
    */

    @Bean
    public PasswordEncoder passwordEncoder()
    {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain  securityFilterChain(HttpSecurity http) throws Exception
    {

        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/v1/auth/register",
                                "/api/v1/auth/login"
                        ).permitAll()
                        .anyRequest().authenticated()
                ).httpBasic(Customizer.withDefaults());

        return http.build();
    }



}
