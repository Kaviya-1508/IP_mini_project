package com.example.student.Service;

import com.example.student.Model.LoginModel;
import com.example.student.Model.RegisterModel;
import com.example.student.Repository.RegisterRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

@Service
public class LoginService {

    public final RegisterRepo repo;
    public final RestTemplate restTemplate;

    public LoginService(RegisterRepo repo, RestTemplate restTemplate) {
        this.repo = repo;
        this.restTemplate = restTemplate;
    }

    public RegisterModel findStudent(LoginModel login) {
        try {
            RegisterModel stuDetails = repo.findByEmail(login.getEmail());
            if (stuDetails == null) {
                System.out.println("Student not found with email: " + login.getEmail());
                return null;
            }
            if (stuDetails.getPassword().equals(login.getPassword())) {
                System.out.println("Password verified for student: " + login.getEmail());
                return stuDetails;
            } else {
                System.out.println("Invalid password for student: " + login.getEmail());
                return null;
            }
        } catch (Exception e) {
            System.err.println("Error in findStudent: " + e.getMessage());
            return null;
        }
    }

  public Object getEventByRoll(Integer rNo) {
    try {
        // Change this:
        // String StuEventUrl = "http://localhost:8081/api/stu_events/student/" + rNo;
        
        // To this:
        String StuEventUrl = "https://event-management-events.onrender.com/api/stu_events/student/" + rNo;
        
        System.out.println("Calling events service at: " + StuEventUrl);
        ResponseEntity<Object> response = restTemplate.getForEntity(StuEventUrl, Object.class);
        return response.getBody();
    } catch (Exception e) {
        System.out.println("Error calling events service: " + e.getMessage());
        return null;
    }
}
}
