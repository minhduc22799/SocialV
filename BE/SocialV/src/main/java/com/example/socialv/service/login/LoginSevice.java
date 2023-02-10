package com.example.socialv.service.login;

import com.example.socialv.model.Users;
import com.example.socialv.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class LoginSevice {
    @Autowired
    private IUserRepository userRepository;

    public boolean login(Users users) {
        List<Users> usersList = userRepository.findAll();
        for (Users us : usersList) {
            if (us.getUsername().equals(users.getUsername()) && us.getPassword().equals(users.getPassword())) {
                us.setCheckOn(true);
                return true;
            }
        }
        return false;
    }

}
