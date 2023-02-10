package com.example.socialv.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table
@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationFriendRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "userSend_id")
    private Users usersSend;
    @ManyToOne
    @JoinColumn(name = "userReceive_id")
    private Users usersReceive;
    @ManyToOne
    @JoinColumn(name = "notificationType_id")
    private NotificationType notificationType;
}
