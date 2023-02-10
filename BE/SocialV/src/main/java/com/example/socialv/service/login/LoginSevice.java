package com.example.socialv.service.login;

import com.example.socialv.model.User;
import com.example.socialv.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class LoginSevice {
    @Autowired
    private IUserRepository userRepository;

    public boolean login(User user) {
        List<User> userList = userRepository.findAll();
        for (User us : userList) {
            if (us.getUsername().equals(user.getUsername()) && us.getPassword().equals(user.getPassword())) {
                us.setCheckOn(true);
                return true;
            }
        }
        return false;
    }

}
