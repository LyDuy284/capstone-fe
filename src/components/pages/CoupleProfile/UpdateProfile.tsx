import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
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
import { getUserById, updateCoupleProfile } from '../../../redux/apiRequest';

const storage = getStorage();
interface Props {
  setMessageStatus: Dispatch<SetStateAction<string>>;
  setMessage: Dispatch<SetStateAction<string>>;
}

const UpdateProfile: FC<Props> = (props) => {
  const user = useSelector((state: any) => state.auth.login.currentUser);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    coupleId: '',
    name: '',
    phoneNumber: '',
    email: '',
    image: '',
    address: '',
    partnerName1: '',
    partnerName2: '',
  });
  console.log(profile);
  const getUserData = async () => {
    const res = await getUserById(user.userId, user.token);
    if (res) {
      console.log(res);
      setProfile((prev) => ({
        ...prev,
        name: res.account.name,
        phoneNumber: res.account.phoneNumber,
        email: res.account.email,
        image: res.account.image,
        address: res.account.address,
        partnerName1: res.partnerName1,
        partnerName2: res.partnerName2,
        coupleId: res.id,
      }));
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

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
          image: downloadURL,
        }));
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function handleUpdateInfo() {
    let checkPhone = true;
    if (!/^\d*$/.test(`${profile.phoneNumber}`)) {
      props.setMessageStatus('red');
      props.setMessage('Số điện thoại không thể chứa ký tự');
      checkPhone = false;
    }
    // Check if the input length is exactly 10 digits
    else if (profile.phoneNumber.length !== 10) {
      props.setMessageStatus('red');
      props.setMessage('Vui lòng nhập 10 số');
      checkPhone = false;
    }

    if (checkPhone) {
      try {
        setLoading(true);
        await updateCoupleProfile(profile, user?.token);
        props.setMessageStatus('green');
        props.setMessage('Cập nhật thành công');
        setLoading(false);
      } catch (error) {}
    }
  }
  // const handleChangePassword = () => {
  //   if (profile.password === profile.confirmPassword) {
  //     // Handle the logic for changing the password
  //     console.log('Changing password to:', profile.password);
  //   } else {
  //     console.error('Passwords do not match!');
  //   }
  // };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Cập nhật hình đại diện
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar
              src={profile.image}
              alt="Profile Logo"
              sx={{ width: 100, height: 100 }}
            />
            <input
              type="file"
              id="upload-logo"
              accept=".jpg, .png"
              style={{ display: 'none' }}
              onChange={(e) => {
                uploadImage(e.target.files);
              }}
            />
            <label htmlFor="upload-logo">
              <Button
                variant="contained"
                color="primary"
                component="span"
                style={{ marginTop: '10px' }}
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'var(--btn-hover-color)',
                  },
                }}
              >
                Tải ảnh
              </Button>
            </label>
          </Box>
        </Paper>

        <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Cập nhật thông tin
          </Typography>
          <TextField
            label="Tên chủ tài khoản"
            name="name"
            value={profile.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Số điện thoại"
            name="phoneNumber"
            value={profile.phoneNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            disabled
            value={profile.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Địa chỉ"
            name="address"
            value={profile.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Tên chú rể"
            name="partnerName1"
            value={profile.partnerName1}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Tên cô dâu"
            name="partnerName2"
            value={profile.partnerName2}
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
            sx={{
              px: 4,
              py: 1,
              fontSize: 14,
              fontWeight: 600,
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'var(--btn-hover-color)',
              },
            }}
          >
            Cập nhật
          </Button>
        </Paper>

        {/* <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
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
        </Paper> */}
      </Box>
    </Container>
  );
};

export default UpdateProfile;
