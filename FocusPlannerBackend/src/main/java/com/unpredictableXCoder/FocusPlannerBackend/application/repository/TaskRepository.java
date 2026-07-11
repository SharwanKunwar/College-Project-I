package com.unpredictableXCoder.FocusPlannerBackend.application.repository;

import com.unpredictableXCoder.FocusPlannerBackend.application.entity.TaskEntity;
import com.unpredictableXCoder.FocusPlannerBackend.application.enums.ForWhen;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<TaskEntity, Long>
{
    List<TaskEntity> findTaskByForWhen(ForWhen forWhen);
}
