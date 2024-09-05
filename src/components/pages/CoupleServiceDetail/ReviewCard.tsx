import React from "react";
import {
  Box,
  Typography,
  Rating,
  Avatar,
} from "@mui/material";

export interface ReviewCardModel {
  avatar: string;
  username: string;
  rating: number;
  date: string;
  description?: string;
  content?: string;
}

export const ReviewCard: React.FC<{ review: ReviewCardModel }> = ({
  review,
}) => {
  return (
    <Box
      sx={{ borderBottom: "2px solid", borderColor: "grey.300", p: 1, mt: 2 }}
    >
      <Box display="flex" alignItems="top" marginBottom="10px">
        <Avatar alt={review.username} src={review.avatar} />
        <Box marginLeft="10px" sx={{ textAlign: "left" }}>
          <Typography variant="h5">{review.username}</Typography>
          <Box sx={{ display: "flex", alignItems: "normal" }}>
    <Rating value={review.rating} readOnly precision={0.1} />
    <Typography  sx={{ marginLeft: 1,fontSize: 12 }}>
      {review.rating.toFixed(1)}
    </Typography>
  </Box>
          <Typography variant="body1" color="textSecondary">
            {review.date}
          </Typography>
          <Typography sx={{ fontSize: 14 }} mt={2}>
            {review.content}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
