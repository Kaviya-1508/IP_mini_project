package com.example.events.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventModel {

    @Id
    private String id;

    private String studentName;
    private Integer rNo;

    private String eventName;
    private String eventLocation;
    private Date eventDate;
    private String eventDescription;
    private String facultyId;
}