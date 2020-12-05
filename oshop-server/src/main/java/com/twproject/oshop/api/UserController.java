package com.twproject.oshop.api;

import com.twproject.oshop.exceptions.NotAllowedException;
import com.twproject.oshop.model.User;
import com.twproject.oshop.service.UserService;
import com.twproject.oshop.util.CustomPasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class UserController {
    private UserService userService;

    @Autowired
    public UserController(UserService userService) {
       this.userService = userService;
    }

    @GetMapping("/user")
    public ResponseEntity getCurrentUser(Authentication authentication)
    {
        UserService service=this.userService;
        String currentUserName=authentication.getName();
        User user=service.getUser(service.getIdByUsername(currentUserName));
        return new ResponseEntity<>(user,HttpStatus.OK);
    }
    @GetMapping("/users/{userId}")
    public ResponseEntity getUser(@PathVariable Long userId, Authentication authentication) {
        if(hasAuthority(authentication, "ADMIN") || (userService.getIdByUsername(authentication.getName()).equals(userId))) {
            User user = userService.getUser(userId);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            throw new NotAllowedException();
        }
    }

    @GetMapping("/users")
    public ResponseEntity getUsers(Authentication authentication) {
        if (hasAuthority(authentication, "ADMIN")) {
            List<User> userList = userService.getUsers();
            return new ResponseEntity<>(userList, HttpStatus.OK);
        } else {
            throw  new NotAllowedException();
        }
    }

    private static List<String> getAuthorityList(Authentication authentication) {
        return authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
    }

    private static boolean hasAuthority(Authentication authentication, String authorityName) {
        return getAuthorityList(authentication).contains(authorityName);
    }


    @PostMapping("/register")
    public ResponseEntity createUser(@RequestBody User user) {
        String rawPassword = user.getPassword();
        String encoded = new CustomPasswordEncoder().encode(rawPassword);
        user.setPassword(encoded);
        user.setRole("DEFAULT");
        User createdUser = userService.createUser(user);
        return new ResponseEntity<>(createdUser, HttpStatus.OK);
    }

}
