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

    // ✅ Returns LIST of events for a student
    public List<EventModel> getEventsByrNo(Integer rNo) {
        return repo.findByrNo(rNo);
    }

    // ✅ Get by ID
    public EventModel getById(String eventId) {
        Optional<EventModel> event = repo.findById(eventId);
        return event.orElse(null);
    }

    // ✅ Update by ID
    public EventModel update(String eventId, EventModel newEvent) {
        Optional<EventModel> existingOpt = repo.findById(eventId);

        if (existingOpt.isPresent()) {
            EventModel existing = existingOpt.get();

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

    // ✅ Delete by ID
    public void delete(String eventId, String facultyId) {
        Optional<EventModel> existingOpt = repo.findById(eventId);

        if (existingOpt.isEmpty()) {
            throw new RuntimeException("Event not found for id: " + eventId);
        }

        EventModel existing = existingOpt.get();

        if (!existing.getFacultyId().equals(facultyId)) {
            throw new RuntimeException("Unauthorized: Cannot delete others' records");
        }

        repo.delete(existing);
        System.out.println("Event deleted successfully for id: " + eventId);
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