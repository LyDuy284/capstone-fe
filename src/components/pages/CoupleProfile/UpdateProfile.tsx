import React, { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useSelector } from 'react-redux';

const storage = getStorage();

const UpdateProfile: React.FC = () => {
  const user = useSelector((state: any) => state.auth.login.currentUser);

  const [profile, setProfile] = useState({
    name: user?.name,
    phoneNumber: user?.phoneNumber,
    email: user?.email,
    logo: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  async function uploadImage(files: FileList | null) {
    if (files) {
      const fileRef = files[0];
      const storageRef = ref(storage, `images/${fileRef?.name}`);

      try {
        // Upload the file to Firebase Storage
        const snapshot = await uploadBytes(storageRef, fileRef);

        // Get the download URL for the file
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Set the state to the download URL
        setProfile((prevProfile) => ({
          ...prevProfile,
          logo: downloadURL,
        }));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleUpdateInfo = () => {
    // Handle the logic for updating user information
    console.log(
      'Updating user info:',
      profile.name,
      profile.phoneNumber,
      profile.email
    );
  };

  const handleChangePassword = () => {
    if (profile.password === profile.confirmPassword) {
      // Handle the logic for changing the password
      console.log('Changing password to:', profile.password);
    } else {
      console.error('Passwords do not match!');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Update Logo
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar
              src={profile.logo}
              alt="Profile Logo"
              sx={{ width: 100, height: 100 }}
            />
            <input type="file" id="upload-logo" accept='.jpg, .png' style={{ display: "none" }} onChange={(e) => { uploadImage(e.target.files) }} />
            <label htmlFor="upload-logo">
              <Button
                variant="contained"
                color="primary"
                component="span"
                style={{ marginTop: '10px' }}
              >
                Upload Logo
              </Button>
            </label>
          </Box>
        </Paper>

        <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Update Information
          </Typography>
          <TextField
            label="Name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone"
            name="phone"
            value={profile.phoneNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateInfo}
            fullWidth
            style={{ marginTop: '20px' }}
          >
            Update Information
          </Button>
        </Paper>

        <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>
          <TextField
            label="New Password"
            name="password"
            type="password"
            value={profile.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={profile.confirmPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleChangePassword}
            fullWidth
            style={{ marginTop: '20px' }}
          >
            Change Password
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default UpdateProfile;
