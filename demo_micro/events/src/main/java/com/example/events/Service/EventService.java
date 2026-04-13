package com.example.events.Service;

import com.example.events.Model.EventModel;
import com.example.events.Repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class EventService {

    private final EventRepository repo;

    public EventService(EventRepository repo) {
        this.repo = repo;
    }

    public EventModel register(EventModel event) {
        return repo.save(event);
    }

    public List<EventModel> getAll() {
        return repo.findAll();
    }

    public EventModel getbyrNo(Integer rNo) {
        return repo.findByrNo(rNo);
    }

    public EventModel update(Integer rNo, EventModel newEvent) {
        EventModel existing = repo.findByrNo(rNo);

        if (existing != null) {

            if (!existing.getFacultyId().equals(newEvent.getFacultyId())) {
                throw new RuntimeException("Unauthorized: Cannot update others' records");
            }

            existing.setStudentName(newEvent.getStudentName());
            existing.setEventName(newEvent.getEventName());
            existing.setEventLocation(newEvent.getEventLocation());
            existing.setEventDate(newEvent.getEventDate());
            existing.setEventDescription(newEvent.getEventDescription());

            return repo.save(existing);
        }
        return null;
    }

    public void delete(Integer rNo, String facultyId) {
        EventModel existing = repo.findByrNo(rNo);

        if (existing != null) {

            if (!existing.getFacultyId().equals(facultyId)) {
                throw new RuntimeException("Unauthorized: Cannot delete others' records");
            }

            repo.delete(existing);
        }
    }

    public List<EventModel> getByMonth(int month, int year) {

        Calendar cal = Calendar.getInstance();

        cal.set(year, month - 1, 1, 0, 0, 0);
        Date start = cal.getTime();

        cal.set(year, month - 1, cal.getActualMaximum(Calendar.DAY_OF_MONTH), 23, 59, 59);
        Date end = cal.getTime();

        return repo.findByEventDateBetween(start, end);
    }
}