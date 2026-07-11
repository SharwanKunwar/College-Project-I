package com.unpredictableXCoder.FocusPlannerBackend.login.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id")
    private UUID id;

    @Column(name = "user_name")
    private String name;
    @Column(name = "user_email")
    private String email;
    private String password;
    private String image;
    private boolean enabled = true;
    private Instant createdAT = Instant.now();
    private Instant updatedAT = Instant.now();

    @Enumerated(EnumType.STRING)
    private Provider provider = Provider.LOCAL;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_role", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @PrePersist
    public void prePersist() {
        Instant now = Instant.now();
        if(createdAT == null) createdAT = now;
        else updatedAT = now;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAT = Instant.now();
    }

}
