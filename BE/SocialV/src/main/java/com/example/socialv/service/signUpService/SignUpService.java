package com.example.socialv.service.signUpService;

import com.example.socialv.model.User;
import com.example.socialv.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SignUpService {
    @Autowired
    private IUserRepository userRepository;

    public boolean signUp(User user) {

        if (!checkUserExist(user)) {
            if (user.getPassword().equals(user.getConfirmPassword())) {
                userRepository.save(user);
                return true;
            }
            return false;
        }
        return false;

    }

    public boolean checkUserExist(User user) {
        List<User> users = userRepository.findAll();
        for (User u : users) {
            if (user.getUsername().equals(u.getUsername()) || user.getEmail().equals(u.getEmail())) {
                return true;
            }
        }
        return false;
    }

}
