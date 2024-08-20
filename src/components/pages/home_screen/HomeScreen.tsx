import React, { useEffect, useState } from "react";
import { Grid, ThemeProvider, createTheme } from "@mui/material";
import Sidebar from "./sidebar/Sidebar";
import TaskList from "./task-list/TaskList";
import TaskDetail from "./task-detail/TaskDetail";
import { Task, Category } from "./types";
import "./_homeScreen.scss";
import Settings from "../setting_modal/Setting";

const theme = createTheme();

interface HomeScreenProps {
  onLogout: () => void;
  userId: string; // Add userId prop
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onLogout, userId }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isTaskDetailVisible, setIsTaskDetailVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  const updateCategoryCounts = () => {
    const newCategories = categories.map((category) => ({
      ...category,
      taskCount: tasks.filter((task) => task.list === category.id).length,
    }));
    setCategories(newCategories);
  };

  useEffect(() => {
    updateCategoryCounts();
  }, [tasks]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSettingsClick = () => {
    setIsSettingsVisible(true);
    setIsTaskDetailVisible(false);
  };

  const handleCloseSettings = () => {
    setIsSettingsVisible(false);
  };

  const addTask = (newTask: Task) => {
    setTasks([...tasks, { ...newTask, id: Date.now().toString() }]);
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

  const deleteCategory = (categoryId: string) => {
    setCategories(categories.filter((category) => category.id !== categoryId));
  };

  const handleAddNewTask = () => {
    setSelectedTask(null);
    setIsTaskDetailVisible(true);
    setIsSettingsVisible(false);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailVisible(true);
    setIsSettingsVisible(false);
  };

  const handleCloseTaskDetail = () => {
    setIsTaskDetailVisible(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Sidebar
              categories={categories}
              addCategory={addCategory}
              deleteCategory={deleteCategory}
              isOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              onLogout={onLogout}
              setSelectedCategory={setSelectedCategory}
              selectedCategory={selectedCategory}
              tasks={tasks}
              onSettingsClick={handleSettingsClick}
            />
          </Grid>
          <Grid item xs={5}>
            <TaskList
              tasks={tasks}
              categories={categories}
              toggleTaskCompletion={toggleTaskCompletion}
              deleteTask={deleteTask}
              setSelectedTask={handleEditTask}
              addNewTask={handleAddNewTask}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </Grid>
          <Grid item xs={4}>
            {isTaskDetailVisible && (
              <div className="task-detail-container">
                <TaskDetail
                  selectedTask={selectedTask}
                  categories={categories}
                  updateTask={updateTask}
                  addTask={addTask}
                  setSelectedTask={setSelectedTask}
                  deleteTask={deleteTask}
                  closeTaskDetail={handleCloseTaskDetail}
                />
              </div>
            )}
            {isSettingsVisible && (
              <Settings userId={userId} closeSettings={handleCloseSettings} />
            )}
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
};

export default HomeScreen;
