import {
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { Task, Category } from "../types";
import "./_taskList.scss";

interface TaskListProps {
  categories: Category[];
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
  setSelectedTask: (task: Task) => void;
  addNewTask: () => void;
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string | null) => void;
  tasks: Task[]; // Add tasks as props
}

const TaskList = ({
  categories,
  toggleTaskCompletion,
  deleteTask,
  setSelectedTask,
  addNewTask,
  selectedCategory,
  tasks, // Destructure tasks from props
}: TaskListProps) => {
  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.color : "gray";
  };

  const filteredTasks = selectedCategory
    ? tasks.filter((task) => task.list === selectedCategory)
    : tasks;

  return (
    <div className="task-list">
      <Typography variant="h4" className="task-list-header">
        Todo - List
      </Typography>

      <ListItem button onClick={addNewTask} className="add-task-item">
        <AddIcon className="add-icon" />
        <ListItemText primary="Add New Task" />
      </ListItem>
      <List>
        {filteredTasks.map((task) => (
          <ListItem key={task.id} button className="task-item">
            <Checkbox
              className="task-checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
              onClick={(e) => e.stopPropagation()}
            />
            <ListItemText
              className="task-title"
              primary={task.title}
              secondary={task.dueDate}
            />
            <div
              className="list-color-indicator"
              style={{
                backgroundColor: getCategoryColor(task.list),
              }}
            />
            <div className="task-actions">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTask(task);
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTask(task.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default TaskList;
