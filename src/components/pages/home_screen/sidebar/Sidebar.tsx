import { useState } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  Button,
  Collapse,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Category, Task } from "../types";
import UpcomingIcon from "@mui/icons-material/Upcoming";
import TodayIcon from "@mui/icons-material/Today";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddIcon from "@mui/icons-material/Add";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";

import "./_sideBar.scss";

interface SidebarProps {
  categories: Category[];
  addCategory: (name: string, color: string) => void;
  deleteCategory: (categoryId: string) => void; // Add deleteCategory prop
  isOpen: boolean;
  toggleSidebar: () => void;
  onLogout: () => void;
  setSelectedCategory: (categoryId: string | null) => void;
  selectedCategory: string | null;
  tasks: Task[];
}

const Sidebar = ({
  categories,
  addCategory,
  deleteCategory,
  isOpen,
  toggleSidebar,
  onLogout,
  setSelectedCategory,
  selectedCategory,
  tasks,
}: SidebarProps) => {
  const [newListName, setNewListName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#1976d2");
  const [isAddingNewList, setIsAddingNewList] = useState(false);

  const handleAddCategory = () => {
    if (newListName) {
      addCategory(newListName, selectedColor);
      setNewListName("");
      setIsAddingNewList(false);
    }
  };

  const colors = [
    "#F48236",
    "#e91e63",
    "#AD10C9",
    "#3AB73E",
    "#AFB5D4",
    "#F321D0",
    "#ECF403",
    "#00bcd4",
  ];

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-info">
        <div className="menu-header-container">
          <div className="sidebar-info"></div>
          <Typography variant="h6" className="menu-header">
            Menu
          </Typography>
          <IconButton onClick={toggleSidebar} className="menu-toggle">
            <MenuIcon />
          </IconButton>
        </div>
        <TextField
          className="search-field"
          fullWidth
          size="small"
          placeholder="Search"
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Typography variant="subtitle1" className="list-header">
          TASKS
        </Typography>
        <List className="list-task">
          <ListItem button>
            <ListItemIcon>
              <UpcomingIcon />
            </ListItemIcon>
            <ListItemText
              className="list-item-text"
              primary="Upcoming"
              secondary="12"
            />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <TodayIcon />
            </ListItemIcon>
            <ListItemText
              className="list-item-text"
              primary="Today"
              secondary="5"
            />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <CalendarMonthIcon />
            </ListItemIcon>
            <ListItemText className="list-item-text" primary="Calendar" />
          </ListItem>
        </List>
        <Typography variant="subtitle1" className="list-header">
          LISTS
        </Typography>
        <List className="category-list">
          <ListItem
            button
            onClick={() => setSelectedCategory(null)}
            selected={selectedCategory === null}
          >
            <ListItemIcon>
              <FiberManualRecordIcon
                style={{
                  color: "gray",
                  width: "30px",
                  height: "30px",
                }}
              />
            </ListItemIcon>
            <ListItemText
              className="list-item-text"
              primary="All"
              secondary={tasks.length}
            />
          </ListItem>
          {categories.map((category) => (
            <ListItem
              button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              selected={selectedCategory === category.id}
            >
              <ListItemIcon>
                <FiberManualRecordIcon
                  style={{
                    color: category.color,
                    width: "30px",
                    height: "30px",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                className="list-item-text"
                primary={category.name}
                secondary={category.taskCount}
              />{" "}
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => deleteCategory(category.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <ListItem
          button
          className="add-category-item"
          onClick={() => setIsAddingNewList(!isAddingNewList)}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Add New List" />
        </ListItem>
        <Collapse in={isAddingNewList}>
          <TextField
            className="new-list-field"
            fullWidth
            placeholder="List Name"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            margin="normal"
          />
          <div className="color-picker">
            {colors.map((color) => (
              <Button
                key={color}
                style={{
                  backgroundColor: color,
                  minWidth: "24px",
                  width: "24px",
                  height: "24px",
                  margin: "0 4px",
                }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
          <Button
            className="add-category-btn"
            fullWidth
            variant="contained"
            onClick={handleAddCategory}
            style={{ backgroundColor: selectedColor }}
          >
            Add New List
          </Button>
        </Collapse>
      </div>

      <List className="bottom-list">
        <ListItem button>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button onClick={onLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Sign out" />
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
