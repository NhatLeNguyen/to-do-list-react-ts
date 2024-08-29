import { Category, Task } from "./types";

//route
export interface AppRoutesProps {
  isAuthenticated: boolean;
  handleLogin: (token: string) => void;
  handleLogout: () => void;
}

//home_screen
export interface HomeScreenProps {
  onLogout: () => void;
  userId: string;
}

export interface SidebarProps {
  categories: Category[];
  addCategory: (name: string, color: string) => void;
  deleteCategory: (categoryId: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  onLogout: () => void;
  setSelectedCategory: (categoryId: string | null) => void;
  selectedCategory: string | null;
  tasks: Task[];
  onSettingsClick: () => void;
}

export interface TaskDetailProps {
  selectedTask: Task | null;
  categories: Category[];
  updateTask: (task: Task) => void;
  addTask: (task: Task) => void;
  setSelectedTask: (task: Task | null) => void;
  deleteTask: (id: string) => void;
  closeTaskDetail: () => void;
}

export interface TaskListProps {
  categories: Category[];
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
  setSelectedTask: (task: Task) => void;
  addNewTask: () => void;
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string | null) => void;
  tasks: Task[];
}

//setting
export interface SettingsProps {
  closeSettings: () => void;
  userId: string;
}

//login
export interface LoginProps {
  onLogin: (token: string) => void;
}

//register
export interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
  [key: string]: string | boolean;
}
export interface FormErrors {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree: string;
  [key: string]: string;
}

//validate
export interface ValidationRule {
  validate: (value: string) => boolean;
  message: string;
}

export interface Validation {
  id: string;
  validate: (value: string) => string | string[];
}
