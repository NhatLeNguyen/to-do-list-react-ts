import React, { useState, useEffect } from "react";
import { Grid, ThemeProvider, createTheme } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Sidebar from "./sidebar/Sidebar";
import TaskList from "./task-list/TaskList";
import TaskDetail from "./task-detail/TaskDetail";
import { Task, Category } from "./types";
import "./_homeScreen.scss";

const theme = createTheme();

interface HomeScreenProps {
  onLogout: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isTaskDetailVisible, setIsTaskDetailVisible] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const tasksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks(tasksData);
    };

    fetchTasks();
  }, []);

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
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailVisible(true);
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
              <TaskDetail
                selectedTask={selectedTask}
                categories={categories}
                updateTask={updateTask}
                addTask={addTask}
                setSelectedTask={setSelectedTask}
                deleteTask={deleteTask}
                closeTaskDetail={handleCloseTaskDetail}
              />
            )}
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
};

export default HomeScreen;
