package com.example.faculty.Repository;

import com.example.faculty.Model.FacultyModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacultyRepository extends MongoRepository<FacultyModel, String> {

    FacultyModel findByEmail(String email);
}