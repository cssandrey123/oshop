package com.twproject.oshop.service;

import com.twproject.oshop.exceptions.NotFoundException;
import com.twproject.oshop.model.User;
import com.twproject.oshop.persistence.UserRepository;
import com.twproject.oshop.util.CustomPasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private UserRepository userRepository;
    private CustomPasswordEncoder passwordEncoder;
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
//        User admin = new User();
//        admin.setUsername("adminAcc");
//        admin.setEmail("admin@admin");
//        admin.setRole("ADMIN");
//        admin.setPassword(new CustomPasswordEncoder().encode("admin123"));
//        userRepository.save(admin);
    }


    private User fetchUser(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) {
            throw new NotFoundException();
        }
        return user.get();
    }

    public User getUser(Long id) {
        return fetchUser(id);
    }

    public List<User> getUsers() {
        List<User> users = new ArrayList<User>();
        userRepository.findAll().iterator().forEachRemaining(users::add);
        return users;
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User editUser(Long userId, User user) {
        User foundUser = fetchUser(userId);
        foundUser.setRole(user.getRole());
        return foundUser;

    }
    public Long getIdByUsername(String username)
    {
        Optional<User> userOptional=userRepository.findByUsername(username);
        if(userOptional.isEmpty())
        {
            throw new NotFoundException();
        }
        User foundUser=userOptional.get();
        return foundUser.getId();
    }

    public boolean isUsernameTaken(String username) {
        Optional<User> userOptional=userRepository.findByUsername(username);
        return userOptional.isPresent();
    }
}