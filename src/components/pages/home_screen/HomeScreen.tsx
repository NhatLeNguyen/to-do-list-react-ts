import React, { useEffect, useState } from "react";
import { Grid, ThemeProvider, createTheme } from "@mui/material";
import Sidebar from "./sidebar/Sidebar";
import TaskList from "./task-list/TaskList";
import TaskDetail from "./task-detail/TaskDetail";
import { Task, Category } from "@components/types";
import "./_homeScreen.scss";
import Settings from "../setting_modal/Setting";
import { db, auth } from "@components/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { HomeScreenProps } from "../../interfaces";

const theme = createTheme();

const HomeScreen: React.FC<HomeScreenProps> = ({ onLogout, userId }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem("categories");
    return savedCategories ? JSON.parse(savedCategories) : [];
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isTaskDetailVisible, setIsTaskDetailVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  const fetchTasksAndCategories = async () => {
    try {
      const { currentUser } = auth;
      if (currentUser) {
        // Fetch tasks
        const tasksQuery = query(
          collection(db, "tasks"),
          where("userId", "==", currentUser.uid)
        );
        const tasksSnapshot = await getDocs(tasksQuery);
        const fetchedTasks: Task[] = tasksSnapshot.docs.reduce(
          (acc: Task[], doc) => {
            acc.push({ id: doc.id, ...doc.data() } as Task);
            return acc;
          },
          []
        );

        setTasks(fetchedTasks);
        localStorage.setItem("tasks", JSON.stringify(fetchedTasks));

        // Fetch categories
        const categoriesQuery = query(
          collection(db, "categories"),
          where("userId", "==", currentUser.uid)
        );
        const categoriesSnapshot = await getDocs(categoriesQuery);
        const fetchedCategories: Category[] = categoriesSnapshot.docs.reduce(
          (acc: Category[], doc) => {
            acc.push({ id: doc.id, ...doc.data() } as Category);
            return acc;
          },
          []
        );
        setCategories(fetchedCategories);
        localStorage.setItem("categories", JSON.stringify(fetchedCategories));
      }
    } catch (error) {
      console.error("Error fetching tasks and categories: ", error);
    }
  };
  useEffect(() => {
    fetchTasksAndCategories();
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

  const handleSettingsClick = () => {
    setIsSettingsVisible(true);
    setIsTaskDetailVisible(false);
  };

  const handleCloseSettings = () => {
    setIsSettingsVisible(false);
  };

  const addTask = (newTask: Task) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks, newTask];
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      return updatedTasks;
    });
  };
  const updateTask = (updatedTask: Task) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const deleteTask = async (id: string) => {
    try {
      const taskRef = doc(db, "tasks", id);
      await deleteDoc(taskRef);

      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Error deleting task from Firestore:", error);
    }
  };

  const toggleTaskCompletion = async (id: string) => {
    try {
      const task = tasks.find((task) => task.id === id);
      if (task) {
        const updatedTask = { ...task, completed: !task.completed };
        const taskRef = doc(db, "tasks", id);
        await updateDoc(taskRef, { completed: updatedTask.completed });
        updateTask(updatedTask);
      }
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  const addCategory = async (name: string, color: string) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const categoryData = {
          userId: currentUser.uid,
          name,
          taskCount: 0,
          color,
        };
        const docRef = await addDoc(collection(db, "categories"), categoryData);
        const updatedCategories = [
          ...categories,
          { ...categoryData, id: docRef.id },
        ];
        setCategories(updatedCategories);
        localStorage.setItem("categories", JSON.stringify(updatedCategories));
      }
    } catch (error) {
      console.error("Error adding category to Firestore:", error);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      const categoryRef = doc(db, "categories", categoryId);
      await deleteDoc(categoryRef);
      const updatedCategories = categories.filter(
        (category) => category.id !== categoryId
      );
      setCategories(updatedCategories);
      localStorage.setItem("categories", JSON.stringify(updatedCategories));
    } catch (error) {
      console.error("Error deleting category from Firestore:", error);
    }
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
              categories={categories}
              toggleTaskCompletion={toggleTaskCompletion}
              deleteTask={deleteTask}
              setSelectedTask={handleEditTask}
              addNewTask={handleAddNewTask}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              tasks={tasks}
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
