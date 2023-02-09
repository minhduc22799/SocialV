package com.example.socialv.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    private String name;
    private String email;
    private String phone;
    private LocalDate birthday;
    //status block hoac active( default true)
    private boolean status;
    //default false , khi dang nhap thi chuyen thanh true, log out thi thanh false
    private boolean checkOn;
    // default true: cho xem bạn bè
    private boolean seeFriendPermission;
    //default true: cho người lạ comment
    private boolean commentPermission;
    private String avatar;
    private String address;
    private String hobby;
    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;
}
