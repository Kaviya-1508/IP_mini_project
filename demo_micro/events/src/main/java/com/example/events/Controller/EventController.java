package com.example.events.Controller;

import com.example.events.Model.EventModel;
import com.example.events.Service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;

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

    @GetMapping("/{rNo}")
    public ResponseEntity<EventModel> getOne(@PathVariable Integer rNo) {
        EventModel event = service.getbyrNo(rNo);
        return event != null ? ResponseEntity.ok(event) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{rNo}")
    public ResponseEntity<EventModel> update(@PathVariable Integer rNo,
                                             @RequestBody EventModel event) {
        EventModel updated = service.update(rNo, event);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{rNo}")
    public ResponseEntity<Void> delete(@PathVariable Integer rNo,
                                       @RequestParam String facultyId) {
        service.delete(rNo, facultyId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/month")
    public List<EventModel> getByMonth(@RequestParam int month,
                                       @RequestParam int year) {
        return service.getByMonth(month, year);
    }
}