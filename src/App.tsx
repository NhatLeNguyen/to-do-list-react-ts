import React, { useState } from "react";
import { Grid, ThemeProvider, createTheme } from "@mui/material";
import Sidebar from "./components/Sidebar";
import TaskList from "./components/TaskList";
import TaskDetail from "./components/TaskDetail";
import { Task, Category } from "./components/types";
import "./styles/_app.scss";

const theme = createTheme();

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const addTask = (task: Task) => {
    setTasks([...tasks, { ...task, id: Date.now().toString() }]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addCategory = (name: string, color: string) => {
    setCategories([
      ...categories,
      { id: Date.now().toString(), name, taskCount: 0, color },
    ]);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Sidebar categories={categories} addCategory={addCategory} />
          </Grid>
          <Grid item xs={5}>
            <TaskList
              tasks={tasks}
              toggleTaskCompletion={toggleTaskCompletion}
              deleteTask={deleteTask}
              setSelectedTask={setSelectedTask}
            />
          </Grid>
          <Grid item xs={4}>
            <TaskDetail
              selectedTask={selectedTask}
              categories={categories}
              updateTask={updateTask}
              addTask={addTask}
              setSelectedTask={setSelectedTask}
            />
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
};

export default App;
