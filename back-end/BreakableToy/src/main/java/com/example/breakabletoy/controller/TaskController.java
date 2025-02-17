package com.example.breakabletoy.controller;

import com.example.breakabletoy.model.Task;
import com.example.breakabletoy.services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// COMMENT: Aquí en general sería cuestión de agregar algun tipo de error handling, 
// preferiblemente algo que puedas poner de forma global y luego especificar para cada request

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        taskService.addTask(task);
        return new ResponseEntity<>(task, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        return new ResponseEntity<>(taskService.getAllTasks(), HttpStatus.OK);
    }

    // COMMENT: Ésto definitivamente se puede mejorar...
    @GetMapping("/{taskId}")
    public ResponseEntity<Task> getTask(@PathVariable int taskId) {
        Task task = taskService.getTask(taskId);
        if (task != null) {
            return new ResponseEntity<>(task, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<Task> updateTask(@PathVariable int taskId, @RequestBody Task updatedTask) {
        taskService.updateTask(updatedTask);
        return new ResponseEntity<>(updatedTask, HttpStatus.OK);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<HttpStatus> deleteTask(@PathVariable int taskId) {
        taskService.removeTask(taskId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Task>> getFilteredTasks(
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false) String dueDate,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority) {
        List<Task> filteredTasks = taskService.filterTasks(searchText, dueDate, status, priority);
        return new ResponseEntity<>(filteredTasks, HttpStatus.OK);
    }
    @GetMapping("/average")
    public ResponseEntity<Double> getAverageTime(){
        double response = taskService.getAverageTimeToComplete(null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @GetMapping("/average/{priority}")
    public ResponseEntity<Double> getAverageTimeWithPriority(@PathVariable String priority){
        double response = taskService.getAverageTimeToComplete(priority);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/toggle/{taskId}")
    public ResponseEntity<Task> toggleTask(@PathVariable int taskId) {
        Task updatedTask = taskService.getTask(taskId);
        taskService.toggleTask(updatedTask);
        return new ResponseEntity<>(updatedTask, HttpStatus.OK);
    }
}