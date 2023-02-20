package com.example.socialv.service.admin;

import com.example.socialv.model.Users;
import com.example.socialv.repository.IRoleRepository;
import com.example.socialv.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {
    @Autowired
    private IUserRepository iUserRepository;
    @Autowired
    private IRoleRepository iRoleRepository;

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
    public boolean loginAdmin(Users users) {
        List<Users> usersList = iUserRepository.findAll();
        for (Users us : usersList) {
            if (us.getUsername().equals(users.getUsername()) && us.getPassword().equals(users.getPassword()) && us.getRole()==iRoleRepository.findById(2l).get()) {
                us.setCheckOn(true);
                return true;
            }
        }
        return false;
    }
       public List<Users> findAllUser(){
            return iUserRepository.showAllUser();
        }
}
