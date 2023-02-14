package com.example.socialv.service.roleService;

import com.example.socialv.model.Role;
import com.example.socialv.model.Users;
import com.example.socialv.repository.IRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

public class RoleService implements IRoleService{

    @Autowired
    private IRoleRepository roleRepository;
    @Override
    public Iterable<Role> findAll() {
        return roleRepository.findAll();
    }

    @Override
    public Optional<Role> findById(Long id) {
        return roleRepository.findById(id);
    }

    @Override
    public Users save(Role role) {
        roleRepository.save(role);
        return null;
    }

    @Override
    public void remove(Long id) {
        roleRepository.deleteById(id);
    }
}
