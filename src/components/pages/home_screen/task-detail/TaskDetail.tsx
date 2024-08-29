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
import { Task } from "@/components/types";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/components/firebase";
import "./_taskDetail.scss";
import { TaskDetailProps } from "@/components/interfaces";

const initDefaultTask = {
  id: "",
  title: "",
  description: "",
  dueDate: "",
  list: "",
  completed: false,
};
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
    setTask(selectedTask || initDefaultTask);
  }, [selectedTask]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTask((prev) => (prev ? { ...prev, [name]: value } : null));
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
        const { currentUser } = auth;
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
      setTask(initDefaultTask);
      closeTaskDetail();
    }
  };

  if (!task) return null;

  return (
    <form onSubmit={handleSubmit} className="task-detail">
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
        type="datetime-local"
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
    </form>
  );
};

export default TaskDetail;
