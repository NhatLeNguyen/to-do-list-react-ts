import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { verifyBeforeUpdateEmail } from "firebase/auth";

const UserInfo = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userId = currentUser.uid;
          const userDoc = await getDoc(doc(db, "users", userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData) {
              setUser(userData as { name: string; email: string });
              setEmailVerified(currentUser.emailVerified);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleEditClick = async () => {
    if (editMode) {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error("No user is currently logged in.");
        }

        const userId = currentUser.uid;
        const userRef = doc(db, "users", userId);

        // Update in Firestore
        await updateDoc(userRef, { name: user.name });
        console.log("User name updated successfully in Firestore.");
        // Send verification to new email
        if (user.email !== currentUser.email) {
          await verifyBeforeUpdateEmail(currentUser, user.email);
          setSnackbarMessage(
            "Verification email sent to the new address. Please verify before updating."
          );
          setVerificationSent(true);
        } else {
          setSnackbarMessage("User information updated successfully.");
        }

        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error updating user data:", error);
        setSnackbarMessage("Error updating user data. Please try again.");
        setSnackbarOpen(true);
      }
    }
    setEditMode(!editMode);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6">User Info</Typography>
      {editMode ? (
        <>
          <TextField
            label="Name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleEditClick}>
            <SaveIcon /> Save
          </Button>
        </>
      ) : (
        <>
          <Typography>Name: {user.name}</Typography>
          <Typography>Email: {user.email}</Typography>
          <IconButton onClick={handleEditClick}>
            <EditIcon />
          </IconButton>
        </>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default UserInfo;
