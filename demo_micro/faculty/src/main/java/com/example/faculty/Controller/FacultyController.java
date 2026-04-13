package com.example.faculty.Controller;

import com.example.faculty.Dto.FacultyLoginModel;
import com.example.faculty.Model.FacultyModel;
import com.example.faculty.Service.FacultyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/faculty")
public class FacultyController {

    private final FacultyService service;

    public FacultyController(FacultyService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody FacultyModel faculty) {
        try {
            FacultyModel registered = service.register(faculty);
            return ResponseEntity.ok(registered);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody FacultyLoginModel login) {
        try {
            FacultyModel faculty = service.login(login.getEmail(), login.getPassword());

            if (faculty != null) {
                // Return faculty data without password
                Map<String, Object> response = new HashMap<>();
                response.put("id", faculty.getId());
                response.put("facultyId", faculty.getFacultyId());
                response.put("facultyName", faculty.getFacultyName());
                response.put("email", faculty.getEmail());
                // Don't include password

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid email or password");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login failed: " + e.getMessage());
        }
    }
}