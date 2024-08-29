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
import { format, isValid } from "date-fns";
import "./_taskList.scss";
import { TaskListProps } from "../../../interfaces";

const TaskList = ({
  categories,
  toggleTaskCompletion,
  deleteTask,
  setSelectedTask,
  addNewTask,
  selectedCategory,
  tasks,
}: TaskListProps) => {
  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.color : "gray";
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    if (!isValid(date)) {
      return "Invalid date";
    }
    return format(date, "HH:mm - dd/MM/yyyy");
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
              className={`task-title ${task.completed ? "completed-task" : ""}`}
              primary={task.title}
              secondary={formatDueDate(task.dueDate)}
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
