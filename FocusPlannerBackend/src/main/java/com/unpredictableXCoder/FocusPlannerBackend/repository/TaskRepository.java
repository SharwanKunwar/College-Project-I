package com.unpredictableXCoder.FocusPlannerBackend.repository;

import com.unpredictableXCoder.FocusPlannerBackend.entity.TaskEntity;
import com.unpredictableXCoder.FocusPlannerBackend.enums.ForWhen;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<TaskEntity, Long>
{
    List<TaskEntity> findTaskByForWhen(ForWhen forWhen);
}
