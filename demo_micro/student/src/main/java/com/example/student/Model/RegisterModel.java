package com.example.student.Model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "StudentReg")
@Data
public class RegisterModel {
    @Id
    private String id;
    private String name;
    private Integer rNo;
    private String email;
    private String password;
}
