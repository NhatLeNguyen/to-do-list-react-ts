import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { Category } from "./types";
import "../styles/_sidebar.scss";

interface SidebarProps {
  categories: Category[];
  addCategory: (name: string) => void;
}

const Sidebar = ({ categories, addCategory }: SidebarProps) => {
  const handleAddCategory = () => {
    const categoryName = prompt("Enter new category name:");
    if (categoryName) {
      addCategory(categoryName);
    }
  };

  return (
    <div className="sidebar">
      <div className="menu">Menu</div>
      <Typography variant="h6" className="list-header">
        Task
      </Typography>
      <TextField
        className="search-field"
        fullWidth
        placeholder="Search"
        margin="normal"
      />
      <List>
        <ListItem>
          <ListItemText primary="Today" secondary="5" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Upcoming" secondary="12" />
        </ListItem>
      </List>
      <Typography variant="h6" className="list-header">
        Lists
      </Typography>
      <List className="category-list">
        {categories.map((category) => (
          <ListItem key={category.id}>
            <ListItemText
              primary={category.name}
              secondary={category.taskCount}
            />
          </ListItem>
        ))}
      </List>
      <Button
        className="add-category-btn"
        fullWidth
        variant="outlined"
        onClick={handleAddCategory}
      >
        Add New Category
      </Button>
    </div>
  );
};

export default Sidebar;
