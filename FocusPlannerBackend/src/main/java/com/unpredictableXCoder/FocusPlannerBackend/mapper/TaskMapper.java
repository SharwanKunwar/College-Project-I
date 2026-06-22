package com.unpredictableXCoder.FocusPlannerBackend.mapper;

import com.unpredictableXCoder.FocusPlannerBackend.dto.TaskRequestDTO;
import com.unpredictableXCoder.FocusPlannerBackend.dto.TaskResponseDTO;
import com.unpredictableXCoder.FocusPlannerBackend.entity.TaskEntity;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class TaskMapper
{
    //ToEntity
    public TaskEntity mapToEntity(TaskRequestDTO request){
        return TaskEntity.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .status(request.getStatus())
                .forWhen(request.getForWhen())
                .createdAt(LocalDateTime.now())
                .build();
    }

    //ToResponse
    public TaskResponseDTO mapToResponse(TaskEntity task){
        return TaskResponseDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .status(task.getStatus())
                .forWhen(task.getForWhen())
                .createdAt(task.getCreatedAt())
                .startedAt(task.getStartedAt())
                .finishedAt(task.getFinishedAt())
                .build();
    }

}
