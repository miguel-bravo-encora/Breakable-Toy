package com.example.breakabletoy.services;

import com.example.breakabletoy.model.Task;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {
    private final List<Task> tasks;
    private int idCounter = 0;

    public TaskService() {
        this.tasks = new ArrayList<>();
    }

    public void addTask(Task task) {
        while(getTask(idCounter) != null){
            idCounter++;
        }
        task.setId(idCounter);
        task.setCreatedDate(java.time.LocalDateTime.now());
        tasks.add(task);
    }

    public void removeTask(int taskId) {
        tasks.removeIf(task -> task.getId() == taskId);
    }

    public Task getTask(int taskId) {
        return tasks.stream()
                .filter(task -> task.getId() == taskId)
                .findFirst()
                .orElse(null);
    }

    public List<Task> getAllTasks() {
        return tasks;
    }

    // COMMENT: Aquí podrías usar algún tipo de mapping para no tener que estar repitiendo los sets y gets (tómalo como prioridad baja, porque podría llegar a complicarse)
    public void updateTask(Task updatedTask) {
        Task existingTask = getTask(updatedTask.getId());
        if (existingTask != null) {
            existingTask.setDescription(updatedTask.getDescription());
            existingTask.setCompleted(updatedTask.getCompleted());
            existingTask.setDueDate(updatedTask.getDueDate());
            existingTask.setFinishDate(updatedTask.getFinishDate());
            existingTask.setCreatedDate(updatedTask.getCreatedDate());
            existingTask.setPriority(updatedTask.getPriority());
        }
    }

    public double getAverageTimeToComplete(String priority) {
        return tasks.stream()
                .filter(Task::getCompleted)
                .filter(task -> task.getPriority().equals(priority))
                .mapToDouble(
                        Task::getTimeToComplete)
                .average()
                .orElse(1111000);
    }

    public void toggleTask(Task updatedTask) {
        Task existingTask = getTask(updatedTask.getId());
        if (existingTask != null) {
            if(existingTask.getCompleted()){
                existingTask.setFinishDate(null);
            }
            else{
                existingTask.setFinishDate(java.time.LocalDateTime.now());
            }
            existingTask.toggleCompleted();
        }
    }

    // COMMENT: esta función podría mejorar... Más que nada que sea más fácil de entenderse o de seguir
    public List<Task> filterTasks(String searchText, String dueDate, String status, String priority) {
        return tasks.stream()
                .filter(task -> {
                    if (searchText != null && !searchText.isEmpty()) {
                        return task.getDescription().toLowerCase().contains(searchText.toLowerCase());
                    } else {
                        return true;
                    }
                })
                .filter(task -> {
                    if (dueDate != null && !dueDate.isEmpty()) {
                        return task.getDueDate().toString().contains(dueDate);
                    } else {
                        return true;
                    }
                })
                .filter(task -> {
                    if (status != null && !status.isEmpty()) {
                        return task.getCompleted() == (status.equals("completed") || status.equals("incomplete"));
                    } else {
                        return true;
                    }
                })
                .filter(task -> {
                    if (priority != null && !priority.isEmpty()) {
                        return task.getPriority().toString().contains(priority);
                    } else {
                        return true;
                    }
                })
                .collect(Collectors.toList());
    }
}