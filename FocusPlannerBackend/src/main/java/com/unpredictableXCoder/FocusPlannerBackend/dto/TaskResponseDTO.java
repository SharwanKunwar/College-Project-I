package com.unpredictableXCoder.FocusPlannerBackend.dto;

import com.unpredictableXCoder.FocusPlannerBackend.enums.ForWhen;
import com.unpredictableXCoder.FocusPlannerBackend.enums.Priority;
import com.unpredictableXCoder.FocusPlannerBackend.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponseDTO
{
    private Long id;
    private String title;
    private String description;
    private String taskNote;
    private Priority priority;
    private Status status;
    private ForWhen forWhen;
    private LocalDateTime createdAt;
    private LocalDateTime startedAt;
    private LocalDateTime finishedAt;
}
