import { useState } from "react";
import { Box, TextField, Button, Typography, Snackbar } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setSnackbarMessage("New passwords do not match.");
      setSnackbarOpen(true);
      return;
    }

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No user is currently logged in.");
      }

      // authenticate user
      const credential = EmailAuthProvider.credential(
        currentUser.email!,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);

      // Update password in Firebase Authentication
      await updatePassword(currentUser, newPassword);
      console.log("Password updated successfully in Firebase Authentication.");

      // Update password in Firestore
      const userId = currentUser.uid;
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { password: newPassword });
      console.log("Password updated successfully in Firestore.");

      setSnackbarMessage("Password updated successfully.");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating password:", error);
      setSnackbarMessage("Error updating password. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <Typography variant="h6">Change Password</Typography>
      <TextField
        label="Current Password"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Confirm New Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleChangePassword}
      >
        Change Password
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default ChangePassword;
