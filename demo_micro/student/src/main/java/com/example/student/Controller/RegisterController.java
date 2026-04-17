package com.example.student.Controller;

import com.example.student.Model.RegisterModel;
import com.example.student.Service.RegisterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://ip-mini-project-xi.vercel.app"
}, allowCredentials = "true")
@RestController
public class RegisterController {

    private final RegisterService registerService;

    public RegisterController(RegisterService registerService) {
        this.registerService = registerService;
    }

    // Fix: Remove @RequestMapping, use direct @PostMapping
    @PostMapping("/regStudent")
    public ResponseEntity<?> SaveStuDet(@RequestBody RegisterModel registerModel) {
        try {
            System.out.println("📝 Registering student: " + registerModel.getEmail());
            RegisterModel savedStudent = registerService.SaveStu(registerModel);

            if (savedStudent != null) {
                System.out.println("✅ Student registered: " + savedStudent.getEmail());
                return ResponseEntity.ok(savedStudent);
            } else {
                System.out.println("❌ Student already exists: " + registerModel.getEmail());
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Student already exists with this email");
            }
        } catch (Exception e) {
            System.err.println("❌ Registration error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed: " + e.getMessage());
        }
    }
}
