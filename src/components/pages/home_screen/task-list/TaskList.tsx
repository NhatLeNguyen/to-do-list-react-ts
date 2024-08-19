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
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Task } from "../types";
import "./_taskList.scss";

interface TaskListProps {
  tasks: Task[];
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
  setSelectedTask: (task: Task) => void;
  addNewTask: () => void;
}

const TaskList = ({
  tasks,
  toggleTaskCompletion,
  deleteTask,
  setSelectedTask,
  addNewTask,
}: TaskListProps) => {
  return (
    <div className="task-list">
      <Typography variant="h4" className="task-list-header">
        Today <span className="task-count">{tasks.length}</span>
      </Typography>
      <ListItem button onClick={addNewTask} className="add-task-item">
        <AddIcon className="add-icon" />
        <ListItemText primary="Add New Task" />
      </ListItem>
      <List>
        {tasks.map((task) => (
          <ListItem
            key={task.id}
            button
            onClick={() => setSelectedTask(task)}
            className="task-item"
          >
            <Checkbox
              className="task-checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
              onClick={(e) => e.stopPropagation()}
            />
            <ListItemText className="task-title" primary={task.title} />
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
            <ChevronRightIcon />
          </ListItem>
        ))}
      </List>
    </div>
  );
};
export default TaskList;
