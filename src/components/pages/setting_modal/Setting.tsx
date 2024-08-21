import { useState } from "react";
import {
  Typography,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import UserInfo from "./UserInfo";
import "./_setting.scss";
import ChangePassword from "./ChangePassword";
interface SettingsProps {
  closeSettings: () => void;
  userId: string;
}

const Settings = ({ closeSettings }: SettingsProps) => {
  const [selectedSetting, setSelectedSetting] = useState<string | null>(null);

  return (
    <Box className="settings-container">
      <Box className="settings-header">
        <Typography variant="h6" className="setting-title">
          Setting
        </Typography>
        <IconButton className="close-icon" onClick={closeSettings}>
          <CloseIcon />
        </IconButton>
      </Box>
      {!selectedSetting && (
        <List className="setting-list">
          <ListItem>
            <ListItemText
              primary="My Account"
              primaryTypographyProps={{ variant: "h6" }}
            />
          </ListItem>
          <ListItem button onClick={() => setSelectedSetting("accountInfo")}>
            <ListItemText primary="Account Information" />
            <ArrowForwardIosIcon fontSize="small" />
          </ListItem>
          <ListItem button onClick={() => setSelectedSetting("changePassword")}>
            <ListItemText primary="Change Password" />
            <ArrowForwardIosIcon fontSize="small" />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Settings"
              primaryTypographyProps={{ variant: "h6" }}
            />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Notifications Settings" />
            <ArrowForwardIosIcon fontSize="small" />
          </ListItem>

          <ListItem button>
            <ListItemText primary="Language" />
            <ArrowForwardIosIcon fontSize="small" />
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemText
              primary="Support"
              primaryTypographyProps={{ variant: "h6" }}
            />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Help Centre" />
            <ArrowForwardIosIcon fontSize="small" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Community Rules" />
            <ArrowForwardIosIcon fontSize="small" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="About" />
            <ArrowForwardIosIcon fontSize="small" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Delete Account" />
          </ListItem>
        </List>
      )}
      {selectedSetting === "accountInfo" && <UserInfo />}
      {selectedSetting === "changePassword" && <ChangePassword />}
    </Box>
  );
};

export default Settings;
