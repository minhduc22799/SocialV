package com.example.socialv.service.admin;

import com.example.socialv.model.Users;
import com.example.socialv.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    @Autowired
    private IUserRepository iUserRepository;

    public boolean blockAndUnLockUsers(Users users) {
        if (!users.isStatus()) {
            users.setStatus(true);
            iUserRepository.save(users);
            return true;
        } else {
            users.setStatus(false);
            iUserRepository.save(users);
            return true;
        }
    }

}
