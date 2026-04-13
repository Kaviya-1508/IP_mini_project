package com.example.student.Repository;

import com.example.student.Model.RegisterModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegisterRepo extends MongoRepository<RegisterModel,String> {
    RegisterModel findByEmail(String email);
}
