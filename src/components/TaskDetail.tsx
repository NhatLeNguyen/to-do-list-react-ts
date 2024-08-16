import React, { useState, useEffect } from "react";
import { TextField, Button, Box, MenuItem } from "@mui/material";
import { Task, Category } from "./types";
import "../styles/_taskDetail.scss";

interface TaskDetailProps {
  selectedTask: Task | null;
  categories: Category[];
  updateTask: (task: Task) => void;
  addTask: (task: Task) => void;
  setSelectedTask: (task: Task | null) => void;
}

const TaskDetail = ({
  selectedTask,
  categories,
  updateTask,
  addTask,
  setSelectedTask,
}: TaskDetailProps) => {
  const [task, setTask] = useState<Task | null>(selectedTask);

  useEffect(() => {
    setTask(
      selectedTask || {
        id: "",
        title: "",
        description: "",
        dueDate: "",
        list: "",
        completed: false,
      }
    );
  }, [selectedTask]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTask((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      if (task.id) {
        updateTask(task);
      } else {
        addTask(task);
      }
      setSelectedTask(null);
    }
  };

  if (!task) return null;

  return (
    <Box component="form" onSubmit={handleSubmit} className="task-detail">
      <TextField
        className="form-field"
        fullWidth
        label="Title"
        name="title"
        value={task.title}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        className="form-field"
        fullWidth
        label="Description"
        name="description"
        value={task.description}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={4}
      />
      <TextField
        className="form-field"
        select
        fullWidth
        label="List"
        name="list"
        value={task.list}
        onChange={handleChange}
        margin="normal"
      >
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        className="form-field"
        fullWidth
        label="Due Date"
        name="dueDate"
        type="date"
        value={task.dueDate}
        onChange={handleChange}
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />

      <Box className="action-buttons">
        <Button className="submit-btn" type="submit" variant="contained">
          {(task.id = "Update")}
        </Button>
        <Button variant="outlined" className="submit-btn" type="submit">
          {(task.id = "Delete")}
        </Button>
      </Box>
    </Box>
  );
};

export default TaskDetail;
