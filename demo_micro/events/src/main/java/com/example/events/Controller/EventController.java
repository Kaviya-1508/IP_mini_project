package com.example.events.Controller;

import com.example.events.Model.EventModel;
import com.example.events.Service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/stu_events")
public class EventController {

    private final EventService service;

    public EventController(EventService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<EventModel> create(@RequestBody EventModel event) {
        return ResponseEntity.ok(service.register(event));
    }

    @GetMapping
    public List<EventModel> getAll() {
        return service.getAll();
    }

    // ✅ NEW: Get all events for a student (returns array)
    @GetMapping("/student/{rNo}")
    public ResponseEntity<List<EventModel>> getEventsByStudent(@PathVariable Integer rNo) {
        List<EventModel> events = service.getEventsByrNo(rNo);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<EventModel> getOne(@PathVariable String eventId) {
        EventModel event = service.getById(eventId);
        return event != null ? ResponseEntity.ok(event) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<EventModel> update(@PathVariable String eventId,
                                             @RequestBody EventModel event) {
        EventModel updated = service.update(eventId, event);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<?> delete(@PathVariable String eventId,
                                    @RequestParam String facultyId) {
        try {
            service.delete(eventId, facultyId);
            return ResponseEntity.ok().body("Event deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Delete failed: " + e.getMessage());
        }
    }

    @GetMapping("/month")
    public List<EventModel> getByMonth(@RequestParam int month,
                                       @RequestParam int year) {
        return service.getByMonth(month, year);
    }
}