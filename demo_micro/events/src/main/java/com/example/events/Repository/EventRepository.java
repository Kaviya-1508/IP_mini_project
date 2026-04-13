package com.example.events.Repository;

import com.example.events.Model.EventModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface EventRepository extends MongoRepository<EventModel, String> {

    // ✅ Returns LIST for multiple events per student
    List<EventModel> findByrNo(Integer rNo);

    List<EventModel> findByEventDateBetween(Date start, Date end);
}