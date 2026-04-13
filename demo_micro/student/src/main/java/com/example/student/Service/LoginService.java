package com.example.student.Service;

import com.example.events.Model.EventModel;
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

            // Verify password
            if (stuDetails.getPassword().equals(login.getPassword())) {
                System.out.println("Password verified for student: " + login.getEmail());
                return stuDetails;
            } else {
                System.out.println("Invalid password for student: " + login.getEmail());
                return null;
            }
        } catch (Exception e) {
            System.err.println("Error in findStudent: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    public EventModel getEventByRoll(Integer rNo) {
        try {
            String StuEventUrl = "http://localhost:8081/api/stu_events/" + rNo;
            System.out.println("Calling events service at: " + StuEventUrl);

            ResponseEntity<EventModel> response = restTemplate.getForEntity(StuEventUrl, EventModel.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                System.out.println("Event found for roll number: " + rNo);
                return response.getBody();
            } else {
                System.out.println("No event found for roll number: " + rNo);
                return null;
            }
        } catch (HttpClientErrorException.NotFound e) {
            // This is expected when student has no event registered
            System.out.println("No event found for roll number: " + rNo + " (this is normal)");
            return null;
        } catch (Exception e) {
            System.err.println("Error calling events service: " + e.getMessage());
            return null;
        }
    }
}