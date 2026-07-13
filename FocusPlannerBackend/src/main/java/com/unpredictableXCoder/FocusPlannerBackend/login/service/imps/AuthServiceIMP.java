package com.unpredictableXCoder.FocusPlannerBackend.login.service.imps;

import com.unpredictableXCoder.FocusPlannerBackend.login.dtos.UserDTO;
import com.unpredictableXCoder.FocusPlannerBackend.login.service.AuthServiceHelper;
import com.unpredictableXCoder.FocusPlannerBackend.login.service.UserServiceHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceIMP implements AuthServiceHelper
{

    private final UserServiceHelper userServiceHelper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDTO registerUser(UserDTO userDTO)
    {
        //logic : verify email, password, and default role
        userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        UserDTO userDTO1 = userServiceHelper.createUser(userDTO);
        return userDTO1;
    }
}
