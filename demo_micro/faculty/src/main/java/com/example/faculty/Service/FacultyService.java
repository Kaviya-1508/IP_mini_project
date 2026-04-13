package com.example.faculty.Service;


import com.example.faculty.Model.FacultyModel;
import com.example.faculty.Repository.FacultyRepository;
import org.springframework.stereotype.Service;

@Service
public class FacultyService {

    private final FacultyRepository repo;

    public FacultyService(FacultyRepository repo) {
        this.repo = repo;
    }

    public FacultyModel register(FacultyModel faculty) {
        return repo.save(faculty);
    }

    public FacultyModel login(String email, String password) {
        FacultyModel faculty = repo.findByEmail(email);

        if (faculty != null && faculty.getPassword().equals(password)) {
            return faculty;
        }
        return null;
    }
}