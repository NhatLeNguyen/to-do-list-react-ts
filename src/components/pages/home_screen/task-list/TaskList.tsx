import {
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Task } from "../types";
import "./_taskList.scss";

interface TaskListProps {
  tasks: Task[];
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
  setSelectedTask: (task: Task) => void;
}

const TaskList = ({
  tasks,
  toggleTaskCompletion,
  deleteTask,
  setSelectedTask,
}: TaskListProps) => {
  return (
    <div className="task-list">
      <Button
        className="add-task-btn"
        variant="contained"
        color="primary"
        fullWidth
        onClick={() =>
          setSelectedTask({
            id: "",
            title: "",
            description: "",
            dueDate: "",
            list: "",
            completed: false,
          })
        }
      >
        Add New Task
      </Button>
      <List>
        {tasks.map((task) => (
          <ListItem key={task.id} className="task-item">
            <Checkbox
              className="task-checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
            />
            <ListItemText className="task-title" primary={task.title} />
            <div className="task-actions">
              <IconButton onClick={() => setSelectedTask(task)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => deleteTask(task.id)}>
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
