
import {
    Container,
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Avatar,
    IconButton,
    CircularProgress,
} from '@mui/material';
import { SetStateAction, Dispatch, FC, useEffect, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { SupplierEntity, SupplierUpdate } from '../../../types/entity/Entity';
import { getSupplierProfile, updateSupplierProfile } from '../../../redux/apiRequest';
import "./Profile.css";

const storage = getStorage();

interface Props {
    setMessageStatus: Dispatch<SetStateAction<string>>;
    setMessage: Dispatch<SetStateAction<string>>;
}

const Profile: FC<Props> = (props) => {
    const user = useSelector((state: any) => state.auth.login.currentUser);

    const [profile, setProfile] = useState<SupplierEntity>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [supplierName, setSupplierName] = useState<String>('');
    const [image, setImage] = useState<String>('');
    const [contactPersonName, setContactPersonName] = useState<String>('');
    const [contactPhone, setContactPhone] = useState<String>('');
    const [contactEmail, setContactEmail] = useState<String>('');
    useEffect(() => {
        fetchData();
    }, [])

    async function fetchData() {
        setIsLoading(true);
        const response = await getSupplierProfile(user?.userId, user?.token);
        setProfile(response);
        setImage(response.image);
        setSupplierName(response.supplierName);
        setContactPersonName(response.contactPersonName);
        setContactPhone(response.contactPhone);
        setContactEmail(response.contactEmail);
        setIsLoading(false);
    }

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
                setImage(downloadURL);
            } catch (error) {
                console.error(error);
            }
        }
    };

    async function handleUpdateInfo() {
        let checkPhone = true;
        if (!/^\d*$/.test(`${contactPhone}`)) {
            props.setMessageStatus("red");
            props.setMessage(
                "Số điện thoại không thể chứa ký tự"
            );
            checkPhone = false;
        }
        // Check if the input length is exactly 10 digits
        else if (contactPhone.length !== 10) {
            props.setMessageStatus("red");
            props.setMessage(
                "Vui lòng nhập 10 số"
            );
            checkPhone = false;
        }

        if (checkPhone) {
            const newSupplier: SupplierUpdate = {
                apartmentNumber: profile?.area.apartmentNumber ? profile?.area.apartmentNumber : '',
                contactEmail: contactEmail,
                contactNumber: contactPhone,
                district: profile?.area.district ? profile?.area.district : '',
                image: image,
                name: supplierName,
                province: profile?.area.province ? profile?.area.province : '',
                supplierId: user?.userId,
                ward: profile?.area.ward ? profile?.area.ward : '',
            }
            try {
                await updateSupplierProfile(newSupplier, user?.token);
                props.setMessageStatus("green");
                props.setMessage(
                    "Cập nhật thành công"
                );
            } catch (error) {

            }
        }
    };

    const handleChangePassword = () => {
        // if (profile.password === profile.confirmPassword) {
        //   // Handle the logic for changing the password
        //   console.log('Changing password to:', profile.password);
        // } else {
        //   console.error('Passwords do not match!');
        // }
    };

    return (
        <Container maxWidth="sm" id="Profile">
            {
                isLoading && (
                    <div className="w-full flex items-center justify-center h-[70vh]">
                        <CircularProgress />
                    </div>
                )
            }
            {
                !isLoading && (
                    <Box mt={4}>
                        <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
                            <Typography variant="h6" gutterBottom className='fs-3'>
                                Update Logo
                            </Typography>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Avatar
                                    src={image ? `${image}` : "https://static.vecteezy.com/system/resources/previ…modern-design-on-blank-background-free-vector.jpg"}
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
                            <Typography variant="h6" gutterBottom className='fs-3'>
                                Update Information
                            </Typography>
                            <input type="text" className="input fs-2" value={`${supplierName}`} required onChange={(e) => { setSupplierName(e.target.value) }} />
                            <input type="text" className="input fs-2" value={`${contactPersonName}`} required onChange={(e) => { setContactPersonName(e.target.value) }} />
                            <input type="text" className="input fs-2" value={`${contactEmail}`} required onChange={(e) => { setContactEmail(e.target.value) }} />
                            <input type="text" className="input fs-2" value={`${contactPhone}`} required onChange={(e) => { setContactPhone(e.target.value) }} />
                            <Button
                                className='fs-2'
                                variant="contained"
                                color="primary"
                                onClick={handleUpdateInfo}
                                fullWidth
                                style={{ marginTop: '20px' }}
                            >
                                Update Information
                            </Button>
                        </Paper>
{/* 
                        <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
                            <Typography variant="h6" gutterBottom>
                                Change Password
                            </Typography>

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
                )
            }
        </Container>
    );
};

export default Profile;
