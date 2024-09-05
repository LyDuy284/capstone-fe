import React from 'react';
import { Modal, Box, Typography, TextField, Rating, Button, Grid } from '@mui/material';

interface RatingPopupProps {
    open: boolean;
    onClose: () => void;
    serviceName: string;
    onSubmit: (ratingData: { quantity: number; quality: number; timeliness: number; description: string }) => void;
}

const RatingPopup: React.FC<RatingPopupProps> = ({ open, onClose, serviceName, onSubmit }) => {
    const [quantity, setQuantity] = React.useState<number | null>(5);
    const [quality, setQuality] = React.useState<number | null>(5);
    const [timeliness, setTimeliness] = React.useState<number | null>(5);
    const [description, setDescription] = React.useState<string>('');

    const handleSubmit = () => {
        onSubmit({
            quantity: quantity || 0,
            quality: quality || 0,
            timeliness: timeliness || 0,
            description
        });
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 700,
                    bgcolor: 'background.paper',
                    border: '2px solid grey',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: "10px"
                }}
            >
                <Typography id="modal-title" variant="h4" fontWeight={600} mb={4}>
                    Viết đánh giá cho {serviceName}
                </Typography>
                <Grid container spacing={2} mb={2}>
                    <Grid item xs={12}>
                        <Grid container alignItems="bottom" spacing={2}>
                            <Grid item xs={2}>
                                <Typography  fontSize={14}>Số lượng</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Rating
                                    name="quantity-rating"
                                    value={quantity}
                                    size='large'
                                    onChange={(event, newValue) => setQuantity(newValue)}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container alignItems="bottom" spacing={2}>
                            <Grid item xs={2}>
                                <Typography  fontSize={14}>Chất lượng</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Rating
                                    name="quality-rating"
                                    value={quality}
                                    size='large'
                                    onChange={(event, newValue) => setQuality(newValue)}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container alignItems="bottom" spacing={2}>
                            <Grid item xs={2}>
                                <Typography fontSize={14}>Đúng giờ</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Rating
                                    name="timeliness-rating"
                                    value={timeliness}
                                    size='large'
                                    onChange={(event, newValue) => setTimeliness(newValue)}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <TextField
                    label="Nội dung đánh giá"
                    fullWidth
                    
                    multiline
                    rows={4}
                    value={description}
                    InputProps={{
                        style: { fontSize: 16 },
                      }}
                      InputLabelProps={{
                        style: { fontSize: 14 },
                      }}
                    onChange={(e) => setDescription(e.target.value)}

                />
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button onClick={onClose} variant="outlined" color='error'
                    sx={{ mr: 2,
                        fontSize: 14,
                        fontWeight: 600,
                        py: 1,
                        px: 4,
                     }}>
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} variant="contained"
                    sx={{
                        fontSize: 14,
                        fontWeight: 600,
                        py: 1,
                        px: 4,
                        backgroundColor: "var(--primary-color)",
                        "&:hover": {
                        backgroundColor: "var(--btn-hover-color)",
                        }
                      }}
                    >
                        Gửi
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default RatingPopup;
