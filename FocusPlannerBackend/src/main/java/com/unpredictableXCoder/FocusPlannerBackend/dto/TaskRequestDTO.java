package com.unpredictableXCoder.FocusPlannerBackend.dto;

import com.unpredictableXCoder.FocusPlannerBackend.enums.ForWhen;
import com.unpredictableXCoder.FocusPlannerBackend.enums.Priority;
import com.unpredictableXCoder.FocusPlannerBackend.enums.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TaskRequestDTO {

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title cannot exceed 100 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 300, message = "Description cannot exceed 300 characters")
    private String description;

    @NotNull(message = "Priority is required")
    private Priority priority;

    @NotNull(message = "Status is required")
    private Status status;

    @NotNull(message = "ForWhen is required")
    private ForWhen forWhen;
}
