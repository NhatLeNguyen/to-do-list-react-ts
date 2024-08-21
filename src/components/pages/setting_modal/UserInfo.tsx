// import { useState, useEffect } from "react";
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   IconButton,
//   Snackbar,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import SaveIcon from "@mui/icons-material/Save";

// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { db, auth } from "../../firebase";
// import {
//   verifyBeforeUpdateEmail,
//   updateEmail,
//   EmailAuthProvider,
//   reauthenticateWithCredential,
// } from "firebase/auth";

// const UserInfo = () => {
//   const [user, setUser] = useState({ name: "", email: "" });
//   const [editMode, setEditMode] = useState(false);
//   const [, setEmailVerified] = useState(false);
//   const [, setVerificationSent] = useState(false);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const currentUser = auth.currentUser;
//         if (currentUser) {
//           const userId = currentUser.uid;
//           const userDoc = await getDoc(doc(db, "users", userId));
//           if (userDoc.exists()) {
//             const userData = userDoc.data();
//             if (userData) {
//               setUser(userData as { name: string; email: string });
//               setEmailVerified(currentUser.emailVerified);
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     fetchUser();
//   }, []);

//   const handleEditClick = async () => {
//     if (editMode) {
//       try {
//         const currentUser = auth.currentUser;
//         if (!currentUser) {
//           throw new Error("No user is currently logged in.");
//         }

//         const userId = currentUser.uid;
//         const userRef = doc(db, "users", userId);
//         // Update user info in Firestore
//         await updateDoc(userRef, { name: user.name, email: user.email });
//         console.log("User information updated successfully in Firestore.");
//         // Reauthenticate user before updating email

//         // Update email in Firebase Authentication and Firestore
//         if (user.email !== currentUser.email) {
//           await verifyBeforeUpdateEmail(currentUser, user.email);
//           setSnackbarMessage(
//             "Verification email sent to the new address. Please verify before updating."
//           );
//           setVerificationSent(true);
//         } else {
//           // Update email in Firebase Authentication
//           await updateEmail(currentUser, user.email);
//           console.log("Email updated successfully in Firebase Authentication.");

//           setSnackbarMessage("User information updated successfully.");
//         }

//         setSnackbarOpen(true);
//       } catch (error) {
//         console.error("Error updating user data:", error);
//         setSnackbarMessage("Error updating user data. Please try again.");
//         setSnackbarOpen(true);
//       }
//     }
//     setEditMode(!editMode);
//   };

//   const handleSnackbarClose = () => {
//     setSnackbarOpen(false);
//   };

//   return (
//     <Box>
//       <Typography variant="h6">User Info</Typography>
//       {editMode ? (
//         <>
//           <TextField
//             label="Name"
//             value={user.name}
//             onChange={(e) => setUser({ ...user, name: e.target.value })}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Email"
//             value={user.email}
//             onChange={(e) => setUser({ ...user, email: e.target.value })}
//             fullWidth
//             margin="normal"
//           />
//           <Button variant="contained" color="primary" onClick={handleEditClick}>
//             <SaveIcon /> Save
//           </Button>
//         </>
//       ) : (
//         <>
//           <Typography>Name: {user.name}</Typography>
//           <Typography>Email: {user.email}</Typography>
//           <IconButton onClick={handleEditClick}>
//             <EditIcon />
//           </IconButton>
//         </>
//       )}

//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={6000}
//         onClose={handleSnackbarClose}
//         message={snackbarMessage}
//       />
//     </Box>
//   );
// };

// export default UserInfo;

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import {
  verifyBeforeUpdateEmail,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

const UserInfo = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [editMode, setEditMode] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [, setEmailVerified] = useState(false);
  const [, setVerificationSent] = useState(false);
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
      }
    };

    fetchUser();
  }, []);

  const handleEditClick = () => {
    if (editMode) {
      setPasswordDialogOpen(true);
    } else {
      setEditMode(true);
    }
  };

  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false);
  };

  const handlePasswordSubmit = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No user is currently logged in.");
      }

      // Reauthenticate user before updating email
      const credential = EmailAuthProvider.credential(
        currentUser.email!,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);

      const userId = currentUser.uid;
      const userRef = doc(db, "users", userId);
      // Update user info in Firestore
      await updateDoc(userRef, { name: user.name, email: user.email });
      console.log("User information updated successfully in Firestore.");

      // Update email in Firebase Authentication and Firestore
      if (user.email !== currentUser.email) {
        await verifyBeforeUpdateEmail(currentUser, user.email);
        setSnackbarMessage(
          "Verification email sent to the new address. Please verify before updating."
        );
        setVerificationSent(true);
      } else {
        // Update email in Firebase Authentication
        await updateEmail(currentUser, user.email);
        console.log("Email updated successfully in Firebase Authentication.");

        setSnackbarMessage("User information updated successfully.");
      }

      setSnackbarOpen(true);
      setPasswordDialogOpen(false);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating user data:", error);
      setSnackbarMessage("Error updating user data. Please try again.");
      setSnackbarOpen(true);
      setPasswordDialogOpen(false);
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

      <Dialog open={passwordDialogOpen} onClose={handlePasswordDialogClose}>
        <DialogTitle>Enter Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your current password to update your email.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePasswordSubmit} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

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
