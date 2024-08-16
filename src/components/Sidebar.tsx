import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { Category } from "./types";
import "../styles/_sidebar.scss";
import UpcomingIcon from "@mui/icons-material/Upcoming";
import TodayIcon from "@mui/icons-material/Today";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import AddIcon from "@mui/icons-material/Add";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

interface SidebarProps {
  categories: Category[];
  addCategory: (name: string, color: string) => void;
}

const Sidebar = ({ categories, addCategory }: SidebarProps) => {
  const [newListName, setNewListName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#1976d2");

  const handleAddCategory = () => {
    if (newListName) {
      addCategory(newListName, selectedColor);
      setNewListName("");
    }
  };

  const colors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
  ];

  return (
    <div className="sidebar">
      <Typography variant="h6" className="menu-header">
        Menu
      </Typography>
      <TextField
        className="search-field"
        fullWidth
        placeholder="Search"
        margin="normal"
      />
      <Typography variant="subtitle1" className="list-header">
        TASKS
      </Typography>
      <List>
        <ListItem button>
          <ListItemIcon>
            <UpcomingIcon />
          </ListItemIcon>
          <ListItemText primary="Upcoming" secondary="12" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <TodayIcon />
          </ListItemIcon>
          <ListItemText primary="Today" secondary="5" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <CalendarMonthIcon />
          </ListItemIcon>
          <ListItemText primary="Calendar" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <StickyNote2Icon />
          </ListItemIcon>
          <ListItemText primary="Sticky Wall" />
        </ListItem>
      </List>
      <Typography variant="subtitle1" className="list-header">
        LISTS
      </Typography>
      <List className="category-list">
        {categories.map((category) => (
          <ListItem button key={category.id}>
            <ListItemIcon>
              <FiberManualRecordIcon style={{ color: category.color }} />
            </ListItemIcon>
            <ListItemText
              primary={category.name}
              secondary={category.taskCount}
            />
          </ListItem>
        ))}
      </List>
      <ListItem>
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <ListItemText primary="Add New List" />
      </ListItem>
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
    </div>
  );
};

export default Sidebar;
