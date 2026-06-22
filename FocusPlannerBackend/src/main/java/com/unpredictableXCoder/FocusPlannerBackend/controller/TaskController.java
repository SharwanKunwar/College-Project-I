package com.unpredictableXCoder.FocusPlannerBackend.controller;

import com.unpredictableXCoder.FocusPlannerBackend.dto.TaskRequestDTO;
import com.unpredictableXCoder.FocusPlannerBackend.dto.TaskResponseDTO;
import com.unpredictableXCoder.FocusPlannerBackend.enums.ForWhen;
import com.unpredictableXCoder.FocusPlannerBackend.service.TaskServiceHelper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskServiceHelper taskService;

    // Create a new task and save it to the database
    @PostMapping
    public ResponseEntity<TaskResponseDTO> addTask(@Valid @RequestBody TaskRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.createTask(request));
    }

    // Retrieve all tasks from the database
    @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    // Retrieve tasks filtered by "forWhen" category (e.g., TODAY, TOMORROW, LATER)
    @GetMapping("/filter/forWhen/{forWhen}")
    public ResponseEntity<List<TaskResponseDTO>> getTasksByForWhen(@PathVariable ForWhen forWhen) {
        return ResponseEntity.ok(taskService.getAllTasksByForWhen(forWhen));
    }

    // Retrieve a single task by its unique ID
    @GetMapping("/id/{id}")
    public ResponseEntity<TaskResponseDTO> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    // Mark a task as "in progress" or started
    @PutMapping("/{id}/start")
    public ResponseEntity<TaskResponseDTO> startTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.startTask(id));
    }

    // Mark a task as completed
    @PutMapping("/{id}/complete")
    public ResponseEntity<TaskResponseDTO> completeTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.completeTask(id));
    }

    // Delete a task permanently by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTaskById(id);
        return ResponseEntity.noContent().build();
    }
}