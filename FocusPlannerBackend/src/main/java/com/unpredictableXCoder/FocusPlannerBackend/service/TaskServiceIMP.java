package com.unpredictableXCoder.FocusPlannerBackend.service;

import com.unpredictableXCoder.FocusPlannerBackend.dto.CompleteTaskNoteAdd;
import com.unpredictableXCoder.FocusPlannerBackend.dto.TaskRequestDTO;
import com.unpredictableXCoder.FocusPlannerBackend.dto.TaskResponseDTO;
import com.unpredictableXCoder.FocusPlannerBackend.entity.TaskEntity;
import com.unpredictableXCoder.FocusPlannerBackend.enums.ForWhen;
import com.unpredictableXCoder.FocusPlannerBackend.enums.Status;
import com.unpredictableXCoder.FocusPlannerBackend.mapper.TaskMapper;
import com.unpredictableXCoder.FocusPlannerBackend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskServiceIMP implements TaskServiceHelper{

    private final TaskRepository repository;
    private final TaskMapper mapper;


    @Override
    public TaskResponseDTO createTask(TaskRequestDTO request) {
        TaskEntity task = mapper.mapToEntity(request);
        TaskEntity savedTask = repository.save(task);
        return mapper.mapToResponse(savedTask);
    }


    @Override
    public List<TaskResponseDTO> getAllTasks()
    {
        List<TaskEntity> tasks = repository.findAll();
        return tasks.stream().map(mapper::mapToResponse).toList();
    }


    @Override
    public List<TaskResponseDTO> getAllTasksByForWhen(ForWhen forWhen)
    {
        List<TaskEntity> tasksByForWhen = repository.findTaskByForWhen(forWhen);
        return tasksByForWhen.stream().map(mapper::mapToResponse).toList();
    }


    @Override
    public TaskResponseDTO getTaskById(Long id)
    {
        TaskEntity task = repository.findById(id).orElseThrow(()-> new RuntimeException("Task with id " + id + " not found"));
        return mapper.mapToResponse(task);
    }


    @Override
    public TaskResponseDTO startTask(Long id)
    {
        TaskEntity task = repository.findById(id).orElseThrow(()-> new RuntimeException("Task with id " + id + " not found"));

        if (task.getStatus() == Status.COMPLETED) {
            throw new IllegalStateException("Completed tasks cannot be started.");
        }

        task.setStatus(Status.IN_PROGRESS);
        task.setStartedAt(LocalDateTime.now());

        return mapper.mapToResponse(repository.save(task));
    }



    @Override
    public TaskResponseDTO completeTask(Long id, CompleteTaskNoteAdd taskNote) {

        TaskEntity task = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task with id " + id + " not found"));

        if (task.getStatus() == Status.COMPLETED) {
            throw new IllegalStateException("Task is already completed.");
        }

        task.setStatus(Status.COMPLETED);
        task.setFinishedAt(LocalDateTime.now());

        if (taskNote != null && taskNote.getTaskNote() != null && !taskNote.getTaskNote().isBlank()) {
            task.setTaskNote(taskNote.getTaskNote().trim());
        }

        return mapper.mapToResponse(repository.save(task));
    }


    @Override
    public void deleteTaskById(Long id)
    {
        TaskEntity task = repository.findById(id).orElseThrow(()-> new RuntimeException("Task with id " + id + " not found"));
        repository.delete(task);

    }
}
