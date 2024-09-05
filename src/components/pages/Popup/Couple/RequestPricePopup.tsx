import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Modal,
  Grid,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { truncatedText } from "../../../../utils/Utils";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import EmailIcon from '@mui/icons-material/Email';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import Person2RoundedIcon from '@mui/icons-material/Person2Rounded';
import 'dayjs/locale/vi';
import { createQuotation } from "../../../../api/CoupleAPI";
import { useSelector } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "1px solid grey",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

interface RequestPricePopupProps {
  open: boolean;
  handleClose: () => void;
  serviceName: string;
  serviceId: string;
  suplierID: string;
}

const RequestPricePopup: React.FC<RequestPricePopupProps> = ({
  open,
  handleClose,
  serviceName,
  serviceId,
  suplierID
}) => {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2024-12-12'));
  const [note, setNote] = useState("Chúng tôi hiện đang lên kế hoạch cho đám cưới của mình vào ngày 12/12/2024 và muốn tìm hiểu thêm về doanh nghiệp của bạn. Bạn có thể gửi cho chúng tôi một số thông tin bổ sung không? Cảm ơn bạn!");
  // const user = useSelector((state: any) => state.auth.login.currentUser);

  const handleChangeNote = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNote(event.target.value);
  };

  const handleSubmit = async() => {
    console.log(serviceId)
    console.log(suplierID)
    await createQuotation(
      "COUPLE-1",
      value?.toJSON() ?? "",
       note,
       suplierID,
       serviceId,
  )
    handleClose()
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography
              variant="h6"
              style={{
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {truncatedText(
                serviceName
              )}
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h3">
              Trao đổi với bên cung cấp dịch vụ
            </Typography>
          </Box>

          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography id="modal-modal-description" sx={{ mt: 1, fontSize: 12 }}>
          Hãy điền mẫu dưới đây để được giải đáp về các thắc mắc liên quan đến dịch vụ … 
        </Typography>
        {/* <TextField
          fullWidth
          label="First and last name"
          margin="normal"
          variant="outlined"
          defaultValue="Lý Duy"
          InputProps={{
            style: { fontSize: 16 },
            endAdornment: (
              <InputAdornment position="end">
                  <Person2RoundedIcon sx={{fontSize: 24}}/>
              </InputAdornment>
          ),
          }}
          InputLabelProps={{
            style: { fontSize: 14 },
            
          }}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
          <TextField
          fullWidth
          label="Email"
          margin="normal"
          variant="outlined"
          defaultValue="lyhieuduy9190@gmail.com"
          InputProps={{
            style: { fontSize: 16 },
            endAdornment: (
              <InputAdornment position="end">
                  <EmailIcon sx={{fontSize: 24}}/>
              </InputAdornment>
          ),
          }}
          InputLabelProps={{
            style: { fontSize: 14 },
          }}
        />
          </Grid>
          <Grid item xs={12} sm={6}>
          <TextField
          fullWidth
          label="Phone number (Optional)"
          margin="normal"
          variant="outlined"
          InputProps={{
            style: { fontSize: 16 },
            endAdornment: (
              <InputAdornment position="end">
                  <PhoneRoundedIcon sx={{fontSize: 24}}/>
              </InputAdornment>
          ),
          }}
          InputLabelProps={{
            style: { fontSize: 14 },
          }}
        />
          </Grid>
        </Grid> */}
        <Box mt={2}> 

      
      <LocalizationProvider  dateAdapter={AdapterDayjs} adapterLocale="vi">
      <DemoContainer components={['DatePicker']} >
        <DatePicker
          label="Ngày sự kiện"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          format="DD-MM-YYYY"
          slotProps={{
            openPickerIcon: {
                sx: { fontSize: 24 },
            },
        }}
          slots={{
            textField: (params) => (
                <TextField 
                    {...params} 
                    sx={{ 
                        '& .MuiInputBase-root': { fontSize: 16 },
                        '& .MuiFormLabel-root': { fontSize: 16 }
                    }} 
                />
            )
        }}
        />
      </DemoContainer>
    </LocalizationProvider>
    </Box>
        <TextField
          fullWidth
          label="Ghi chú"
          margin="normal"
          variant="outlined"
          multiline
          onChange={handleChangeNote}
          rows={4}
          value={note}   
          InputProps={{
            style: { fontSize: 16 },
          }}
          InputLabelProps={{
            style: { fontSize: 14 },
          }}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{
            mt: 3,
            fontSize: 16,
            fontWeight: 600,
            py: 1.2,
            backgroundColor: "var(--primary-color)",
            "&:hover": {
            backgroundColor: "var(--btn-hover-color)",
            }
          }}
        >
          Gửi
        </Button>
      </Box>
    </Modal>
  );
};

export default RequestPricePopup;
