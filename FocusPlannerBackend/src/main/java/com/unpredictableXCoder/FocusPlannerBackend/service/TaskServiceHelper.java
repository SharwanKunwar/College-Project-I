package com.unpredictableXCoder.FocusPlannerBackend.service;

import com.unpredictableXCoder.FocusPlannerBackend.dto.TaskRequestDTO;
import com.unpredictableXCoder.FocusPlannerBackend.dto.TaskResponseDTO;
import com.unpredictableXCoder.FocusPlannerBackend.enums.ForWhen;

import java.util.List;

public interface TaskServiceHelper {

    TaskResponseDTO createTask(TaskRequestDTO request);
    List<TaskResponseDTO> getAllTasks();
    List<TaskResponseDTO> getAllTasksByForWhen(ForWhen forWhen);
    TaskResponseDTO getTaskById(Long id);
    TaskResponseDTO startTask(Long id);
    TaskResponseDTO completeTask(Long id);
    void deleteTaskById(Long id);
}
