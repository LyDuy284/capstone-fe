import TableViewData from "../../common/TableViewData";
import "./StaffManager.css";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { PROCESS_STATUS_VN, STATUS } from "../../../constants/consts";
import React, { useState } from "react";
import { useLocation } from "react-router";
import { createCategory, getListCategories } from "../../../redux/apiRequest";
import { CategoryItem } from "../../../types/schema/category";
import { useSelector } from "react-redux";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const StaffManageCategories = () => {
  const user = useSelector((state: any) => state.auth.login.currentUser);

  const location = useLocation();
  const [data, setData] = React.useState<CategoryItem[]>([]);
  const searchParams = new URLSearchParams(location.search);
  const [loading, setLoading] = useState(false);

  const status = searchParams.get("status");
  const [open, setOpen] = React.useState(false);
  const [categoryName, setCategoryName] = useState("");

  const defaultColumns: GridColDef[] = [
    {
      field: "id",
      headerName: "Mã danh mục",
      flex: 1,
    },
    {
      field: "categoryName",
      headerName: "Tên danh mục",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      align: "center",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) =>
        params.value === STATUS.active ? (
          <Chip
            label={PROCESS_STATUS_VN.active}
            sx={{
              height: "24px",
              width: "80px",
              fontSize: 10,
              fontWeight: 600,
              color: "green",
              bgcolor: "#abffdc",
            }}
          />
        ) : (
          <Chip
            label={STATUS.disabled}
            sx={{
              height: "24px",
              width: "80px",
              fontSize: 10,
              fontWeight: 600,
              color: "red",
              bgcolor: "#ffcaca",
            }}
          />
        ),
    },
  ];

  React.useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const res = await getListCategories(0, 50);
      if (res)
        if (res.status === "SUCCESS") setData(res.data);
        else setData([]);
      setLoading(false);
    };
    getCategories();
  }, [status]);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await createCategory(categoryName, user?.token);
    console.log(res);
    if (res)
      if (res.status === "SUCCESS") {
        const response = await getListCategories(0, 10);
        if (response)
          if (response.status === "SUCCESS") setData(response.data);
          else setData([]);
        setLoading(false);
      }
    setCategoryName("");
    setOpen(false);
  };
  const handleCancel = () => {
    setCategoryName("");
    setOpen(false);
  };

  return (
    <>
      <Modal open={open} onClose={handleCancel}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Tạo danh mục
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <TextField
              label="Tên danh mục"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </FormControl>
          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "end", gap: "12px" }}
          >
            <Button variant="outlined" color="info" onClick={handleCancel}>
              Hủy
            </Button>
            <Button
              disabled={categoryName === "" || loading}
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              {loading ? (
                <CircularProgress style={{ height: "14px", width: "14px" }} />
              ) : (
                "Tạo"
              )}
            </Button>
          </Box>
        </Box>
      </Modal>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <Typography
            className="primary-color"
            textAlign={"start"}
            pb={1.2}
            fontSize={20}
            fontWeight={600}
          >
            Danh sách danh mục
          </Typography>
          <Button
            variant="contained"
            className="btn-create"
            onClick={() => setOpen(true)}
          >
            Tạo danh mục
          </Button>
        </div>
        <Box sx={{ width: "100%" }}></Box>
        <TableViewData
          data={data}
          isLoading={loading}
          defaultColumns={defaultColumns}
          height={541}
        />
      </div>
    </>
  );
};

export default StaffManageCategories;
