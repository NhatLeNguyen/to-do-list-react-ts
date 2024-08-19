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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // const addTask = async (task: Task) => {
  //   const docRef = await addDoc(collection(db, "tasks"), task);
  //   setTasks([{ ...task, id: docRef.id }, ...tasks]);
  // };

  // const updateTask = async (updatedTask: Task) => {
  //   const taskDoc = doc(db, "tasks", updatedTask.id);
  //   await updateDoc(taskDoc, updatedTask);
  //   setTasks(
  //     tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
  //   );
  // };

  // const deleteTask = async (id: string) => {
  //   const taskDoc = doc(db, "tasks", id);
  //   await deleteDoc(taskDoc);
  //   setTasks(tasks.filter((task) => task.id !== id));
  // };

  // const toggleTaskCompletion = async (id: string) => {
  //   const task = tasks.find((task) => task.id === id);
  //   if (task) {
  //     const updatedTask = { ...task, completed: !task.completed };
  //     await updateTask(updatedTask);
  //   }
  // };
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

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Sidebar
              categories={categories}
              addCategory={addCategory}
              isOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              onLogout={onLogout}
            />
          </Grid>
          <Grid item xs={5}>
            <TaskList
              tasks={tasks}
              toggleTaskCompletion={toggleTaskCompletion}
              deleteTask={deleteTask}
              setSelectedTask={setSelectedTask}
              addNewTask={() => {}}
            />
          </Grid>
          <Grid item xs={4}>
            <TaskDetail
              selectedTask={selectedTask}
              categories={categories}
              updateTask={updateTask}
              addTask={addTask}
              setSelectedTask={setSelectedTask}
              deleteTask={deleteTask}
            />
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
};

export default HomeScreen;
