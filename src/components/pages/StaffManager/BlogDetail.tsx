import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import { PROCESS_STATUS, PROCESS_STATUS_VN } from "../../../constants/consts";
import { DynamicFeed, KeyboardArrowRight } from "@mui/icons-material";
import { BlogItem } from "../../../types/schema/blog";

interface BlogDetailProps {
  blog: BlogItem;
  setBlog: React.Dispatch<React.SetStateAction<BlogItem | null>>;
}

const BlogDetail = ({ blog, setBlog }: BlogDetailProps) => {
  const [blogStatus, setBlogStatus] = useState(blog.status);

  const handleStatusChange = (newStatus: any) => {
    if (
      window.confirm(`Are you sure you want to change status to ${newStatus}?`)
    ) {
      setBlogStatus(newStatus);
    }
  };

  const handleReject = (blog: BlogItem) => {
    
  }
  return (
    <>
      <div className="flex gap-2 font-semibold text-2xl mb-10 items-center">
        <div
          onClick={() => setBlog(null)}
          className="text-gray-400 hover:underline cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <DynamicFeed className="text-3xl" />
            <p> Quản lý bài đăng</p>
          </div>
        </div>
        <span>
          <KeyboardArrowRight className="text-3xl" />
        </span>
        <p>{blog.id}</p>
      </div>
      <Card className="max-w-[900px] m-auto mt-4 p-3 border border-gray">
        <CardContent>
          <Typography variant="h3" gutterBottom mb={1} fontWeight={600}>
            {blog.title}
          </Typography>
          <Typography color="text.secondary" mb={4}>
            {blog.status === PROCESS_STATUS.pending ? (
              <Chip
                label={PROCESS_STATUS_VN.pending}
                sx={{
                  height: "30px",
                  width: "100px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#cece22",
                  bgcolor: "#ffffbb",
                }}
              />
            ) : blog.status === PROCESS_STATUS.active ? (
              <Chip
                label={PROCESS_STATUS_VN.active}
                sx={{
                  height: "30px",
                  width: "100px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "green",
                  bgcolor: "#abffdc",
                }}
              />
            ) : (
              <Chip
                label={PROCESS_STATUS_VN.inactive}
                sx={{
                  height: "30px",
                  width: "100px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "red",
                  bgcolor: "#ffcaca",
                }}
              />
            )}
          </Typography>
          <Grid container spacing={2} mb={3}>
            <Grid item xs={6}>
              <Typography variant="h5" color="text.secondary">
                <b>Ngày tạo yêu cầu:</b> {blog.dateCreated}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5" color="text.secondary">
                <b>Nhà cung cấp:</b> {blog.serviceSupplierId}
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="h5" mb={3} color="text.secondary">
            <b>Nội dung:</b> {blog.content}
          </Typography>

          {blog.status === PROCESS_STATUS.pending && (
            <div className={"pt-10"}>
              <Button
                variant="contained"
                color="error"
                className="text-xl w-40 font-semibold"
                onClick={() => handleStatusChange("REJECTED")}
              >
                Hủy bỏ
              </Button>
              <Button
                variant="contained"
                color="primary"
                className="text-xl w-40 font-semibold ml-3"
                onClick={() => handleStatusChange("ACTIVE")}
              >
                Duyệt
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default BlogDetail;
