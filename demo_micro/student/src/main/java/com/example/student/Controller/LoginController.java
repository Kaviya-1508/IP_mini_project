package com.example.student.Controller;

import com.example.events.Model.EventModel;
import com.example.student.Model.LoginModel;
import com.example.student.Model.RegisterModel;
import com.example.student.Service.LoginService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
public class LoginController {

    public final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping("/StuLogin")
    public ResponseEntity<?> disEvent(@RequestBody LoginModel loginModel) {
        try {
            System.out.println("🔐 Student login attempt: " + loginModel.getEmail());

            // Get student details
            RegisterModel student = loginService.findStudent(loginModel);

            if (student != null) {
                System.out.println("✅ Login successful for: " + loginModel.getEmail());

                // Get event details if exists (404 is handled gracefully)
                EventModel event = null;
                try {
                    event = loginService.getEventByRoll(student.getRNo());
                } catch (Exception e) {
                    // Event not found is fine
                    System.out.println("No event found for student");
                }

                // Create response with student data
                Map<String, Object> response = new HashMap<>();
                response.put("id", student.getId());
                response.put("name", student.getName());
                response.put("rNo", student.getRNo());
                response.put("email", student.getEmail());
                response.put("event", event); // Can be null

                return ResponseEntity.ok(response);
            } else {
                System.out.println("❌ Login failed for: " + loginModel.getEmail());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid email or password");
            }
        } catch (Exception e) {
            System.err.println("❌ Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login failed: " + e.getMessage());
        }
    }
}