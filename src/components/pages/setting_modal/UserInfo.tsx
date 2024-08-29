import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Snackbar,
  Link,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { verifyBeforeUpdateEmail, onAuthStateChanged } from "firebase/auth";

const UserInfo = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [editMode, setEditMode] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { currentUser } = auth;
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
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await currentUser.reload();
        if (currentUser.emailVerified) {
          setEmailVerified(true);

          // Update email in Firestore after verification
          const userId = currentUser.uid;
          const userRef = doc(db, "users", userId);
          await updateDoc(userRef, { email: currentUser.email });
          console.log("Email updated successfully in Firestore.");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No user is currently logged in.");
      }

      const userId = currentUser.uid;
      const userRef = doc(db, "users", userId);
      // Update user info in Firestore
      await updateDoc(userRef, { name: user.name });
      console.log("User information updated successfully in Firestore.");

      // Update email in Firebase Authentication and send verification email
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
      setEditMode(false);
    } catch (error) {
      console.error("Error updating user data:", error);
      setSnackbarMessage("Error updating user data. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const handleResendVerification = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No user is currently logged in.");
      }

      await verifyBeforeUpdateEmail(currentUser, user.email);
      setSnackbarMessage(
        "Verification email resent. Please verify before updating."
      );
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error resending verification email:", error);
      setSnackbarMessage(
        "Error resending verification email. Please try again."
      );
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

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
          <Button variant="contained" color="primary" onClick={handleSaveClick}>
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

      {verificationSent && !emailVerified && (
        <Box>
          <Typography variant="body1" color="error">
            If you don't receive email. Click here!
          </Typography>
          <Link href="#" onClick={handleResendVerification}>
            Resend Verification Email
          </Link>
        </Box>
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
