package com.example.student.Service;

import com.example.student.Model.RegisterModel;
import com.example.student.Repository.RegisterRepo;
import org.springframework.stereotype.Service;

@Service
public class RegisterService {

    private final RegisterRepo registerRepo;

    public RegisterService(RegisterRepo registerRepo) {
        this.registerRepo = registerRepo;
    }

    public RegisterModel SaveStu(RegisterModel registerModel) {
        try {
            // Check if student already exists by email
            RegisterModel existingStudent = registerRepo.findByEmail(registerModel.getEmail());

            if (existingStudent != null) {
                System.out.println("Student already exists with email: " + registerModel.getEmail());
                return null;
            }

            // Save new student
            System.out.println("Saving new student: " + registerModel.getEmail());
            return registerRepo.save(registerModel);

        } catch (Exception e) {
            System.err.println("Error saving student: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}