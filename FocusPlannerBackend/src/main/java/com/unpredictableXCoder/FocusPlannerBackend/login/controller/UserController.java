package com.unpredictableXCoder.FocusPlannerBackend.login.controller;

import com.unpredictableXCoder.FocusPlannerBackend.login.dtos.UserDTO;
import com.unpredictableXCoder.FocusPlannerBackend.login.service.UserServiceHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
public class UserController {

    private final UserServiceHelper  userServiceHelper;

    // post user
    public ResponseEntity<UserDTO> createUser(UserDTO userDTO)
    {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userServiceHelper.createUser(userDTO));
    }

    //Get all users
    public ResponseEntity<Iterable<UserDTO>> getAllUsers()
    {
        return ResponseEntity
                .ok(userServiceHelper.getAllUsers());
    }
}
