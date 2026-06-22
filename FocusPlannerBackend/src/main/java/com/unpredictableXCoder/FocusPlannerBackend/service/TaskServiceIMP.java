package com.unpredictableXCoder.FocusPlannerBackend.service;

import com.unpredictableXCoder.FocusPlannerBackend.dto.TaskRequestDTO;
import com.unpredictableXCoder.FocusPlannerBackend.dto.TaskResponseDTO;
import com.unpredictableXCoder.FocusPlannerBackend.entity.TaskEntity;
import com.unpredictableXCoder.FocusPlannerBackend.enums.ForWhen;
import com.unpredictableXCoder.FocusPlannerBackend.mapper.TaskMapper;
import com.unpredictableXCoder.FocusPlannerBackend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
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

    //Todo: implement belows methods before 10:00 PM
    //NOTE: I'm at the service layer

    @Override
    public List<TaskResponseDTO> getAllTasks() {
        return List.of();
    }

    @Override
    public List<TaskResponseDTO> getAllTasksByForWhen(ForWhen forWhen) {
        return List.of();
    }

    @Override
    public TaskResponseDTO getTaskById(Long id) {
        return null;
    }

    @Override
    public TaskResponseDTO startTask(Long id) {
        return null;
    }

    @Override
    public TaskResponseDTO completeTask(Long id) {
        return null;
    }

    @Override
    public void deleteTaskById(Long id) {

    }
}
