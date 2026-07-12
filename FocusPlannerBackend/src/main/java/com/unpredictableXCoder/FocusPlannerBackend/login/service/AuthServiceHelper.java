package com.unpredictableXCoder.FocusPlannerBackend.login.service;

import com.unpredictableXCoder.FocusPlannerBackend.login.dtos.UserDTO;

public interface AuthServiceHelper {
    //Register user
    UserDTO registerUser(UserDTO userDTO);

    //Login user
}
