package com.example.student.Controller;

import com.example.student.Model.LoginModel;
import com.example.student.Model.RegisterModel;
import com.example.student.Service.LoginService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://ip-mini-project-xi.vercel.app"
}, allowCredentials = "true")
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
            
            RegisterModel student = loginService.findStudent(loginModel);
            
            if (student != null) {
                System.out.println("✅ Login successful for: " + loginModel.getEmail());
                
                Object event = loginService.getEventByRoll(student.getRNo());
                
                Map<String, Object> response = new HashMap<>();
                response.put("id", student.getId());
                response.put("name", student.getName());
                response.put("rNo", student.getRNo());
                response.put("email", student.getEmail());
                response.put("event", event);
                
                return ResponseEntity.ok(response);
            } else {
                System.out.println("❌ Login failed for: " + loginModel.getEmail());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid email or password");
            }
        } catch (Exception e) {
            System.err.println("❌ Login error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login failed: " + e.getMessage());
        }
    }
}
