import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Task, Category } from "../types";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../../firebase";
import "./_taskDetail.scss";

interface TaskDetailProps {
  selectedTask: Task | null;
  categories: Category[];
  updateTask: (task: Task) => void;
  addTask: (task: Task) => void;
  setSelectedTask: (task: Task | null) => void;
  deleteTask: (id: string) => void;
  closeTaskDetail: () => void;
}

const TaskDetail = ({
  selectedTask,
  categories,
  updateTask,
  addTask,
  setSelectedTask,
  closeTaskDetail,
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

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTask((prev) => (prev ? { ...prev, [name]: value } : null));

    if (task && task.id) {
      try {
        const taskRef = doc(db, "tasks", task.id);
        await updateDoc(taskRef, { [name]: value });
        updateTask({ ...task, [name]: value });
      } catch (error) {
        console.error("Error updating task in Firestore:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      if (task.id) {
        try {
          const taskRef = doc(db, "tasks", task.id);
          await updateDoc(taskRef, {
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            list: task.list,
            completed: task.completed,
          });
          updateTask(task);
        } catch (error) {
          console.error("Error updating task in Firestore:", error);
        }
      } else {
        const currentUser = auth.currentUser;
        if (currentUser) {
          try {
            const taskData = {
              userId: currentUser.uid,
              title: task.title,
              description: task.description,
              dueDate: task.dueDate,
              list: task.list,
              completed: task.completed,
            };
            const docRef = await addDoc(collection(db, "tasks"), taskData);
            console.log(
              "Task added successfully to Firestore with ID: ",
              docRef.id
            );
            addTask({ ...task, id: docRef.id });
          } catch (error) {
            console.error("Error adding task to Firestore:", error);
          }
        } else {
          console.error("User is not authenticated");
        }
      }
      setSelectedTask(task);
      setTask({
        id: "",
        title: "",
        description: "",
        dueDate: "",
        list: "",
        completed: false,
      });
      closeTaskDetail();
    }
  };

  if (!task) return null;

  return (
    <Box component="form" onSubmit={handleSubmit} className="task-detail">
      <Box className="task-detail-header">
        <Typography className="task-detail-title" variant="h6">
          Task
        </Typography>
        <IconButton className="close-icon" onClick={closeTaskDetail}>
          <CloseIcon />
        </IconButton>
      </Box>
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
        fullWidth
        label="Due Date"
        name="dueDate"
        type="date"
        value={task.dueDate}
        onChange={handleChange}
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        className="form-field"
        fullWidth
        select
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
      <Box className="action-buttons">
        <Button className="submit-btn" type="submit" variant="contained">
          {task.id ? "Update" : "Add"}
        </Button>
      </Box>
    </Box>
  );
};

export default TaskDetail;
