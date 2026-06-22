package com.unpredictableXCoder.FocusPlannerBackend.controller;

import com.unpredictableXCoder.FocusPlannerBackend.dto.TaskRequestDTO;
import com.unpredictableXCoder.FocusPlannerBackend.dto.TaskResponseDTO;
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

    // Add task into tb table
    @PostMapping
    public ResponseEntity<TaskResponseDTO> addTask(@Valid @RequestBody TaskRequestDTO Request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(Request));
    }

    // get all task from the db
    @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    // get task by
    @GetMapping("/id/{id}")
    public ResponseEntity<TaskResponseDTO> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }
    

    //Todo: add further end points before 10:00 PM
    // add Task is add
    // getAllTask is add
    // getTaskById is add
    // ...

    // note : and remaining package for handling exceptions point to be noted.




}
