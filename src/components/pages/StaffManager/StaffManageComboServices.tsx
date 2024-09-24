import TableViewData from "../../common/TableViewData";
import "./StaffManager.css";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router";
import {
  activatedCombo,
  createCombo,
  disabledCombo,
  getAllComboById,
  getComboFilters,
  getListCombo,
  getServiceById,
  getServicesSupplierFilters,
  updateCombo,
} from "../../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { ComboCreate, ComboUpdate } from "../../../types/entity/Entity";
import { ServiceDetail } from "../../../types/schema/service";
import { COMBO_STATUS, PROCESS_STATUS_VN, STATUS } from "../../../constants/consts";

import { ServiceSupplierItem } from "../../../types/schema/serviceSupplier";
import { log } from "console";
import { ComboItem } from "../../../types/schema/combo";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface Props {
  setMessageStatus: Dispatch<SetStateAction<string>>;
  setMessage: Dispatch<SetStateAction<string>>;
}

const StaffManageComboServices: FC<Props> = (props) => {
  const user = useSelector((state: any) => state.auth.login.currentUser);
  const location = useLocation();
  const [data, setData] = React.useState<ComboItem[]>([]);
  const searchParams = new URLSearchParams(location.search);
  const [loading, setLoading] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [title, tittleChange] = useState("Create Combo");
  const [serviceDetail, setServiceDetail] = useState<ServiceDetail>();

  const status = searchParams.get("status");
  const [open, setOpen] = React.useState(false);
  const [serviceSupplier, setServiceSupplier] = useState<ServiceSupplierItem[]>([]);
  const [comboTitle, setComboTitle] = useState<string>("");
  const [selected, setSelected] = useState<String[]>([]);
  const [content, setContent] = useState<string>("");
  const handleClose = () => setOpen(false);
  const [images, setImages] = useState<string[]>([]);
  const storage = getStorage();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  
  const updateStatus = async (id: string, currentStatus: string, token: string): Promise<string> => {
    try {
      let newStatus;
      if (currentStatus === STATUS.active) {
        newStatus = await disabledCombo(id, token);
      } else {
        newStatus = await activatedCombo(id, token);
      }
  
      console.log("New Status:", newStatus);
      
      return newStatus;
    } catch (error: any) { 
      console.error("Error updating status:", error);
      return error.message || "Unknown error occurred";
    }
  };

  const defaultColumns: GridColDef[] = [
    {
      field: "id",
      headerName: "Mã combo",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Tiêu đề",
      flex: 1,
    },
    {
      field: "staffId",
      headerName: "Tạo bởi",
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
            onClick={() => {
              setIsEdit(true); 
              updateStatus(params.row.id, STATUS.active, user?.token)}}
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
          onClick={() => {
            setIsEdit(true);
            updateStatus(params.row.id, STATUS.disabled, user?.token)
            console.log("Token: ", user?.token);
            
          }}
            label={COMBO_STATUS.DISABLED}
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
    {
      field: "actions",
      headerName: "Hành động",
      align: "center",
      headerAlign: "center",
      flex: 1,
      renderCell: (params: any) => (
        <div className="flex justify-center">
          <IconButton aria-label="view" onClick={() => {
            setIsEdit(true);
            update(params.row.id)}}>
            <Visibility sx={{ color: "blue", fontSize: 18 }} />
          </IconButton>
        </div>
      ),
    },
  ];
  useEffect(() => {
    fetchServicesSupplierFilters();
    fetchData();
  }, [status]);

  const update = async (id: string) => {
    setIsLoading(true);
    tittleChange("Cập nhật Combo");
    setOpen(true);
    const res = await getAllComboById(id);
    setServiceDetail(res);
    setComboTitle(res?.name);
    setContent(res?.description)
    if(res?.image) {
      let arrayList = [...res.image.split("\n")];
      let arrays:any[] = [];
      arrayList?.map((item: any) => {
        if(item != "" && item) {
          arrays.push(item);
        }
      })
      
      setImages(arrays);
    }
    setIsLoading(false);
    
  };
  
  const handleSelectServiceSupplier = (value: ServiceSupplierItem[]) => {
    const selectedIDs = value.map(item => item.id);
    setSelected(selectedIDs);
  }
  
  const create = () => {
    tittleChange("Tạo mới Combo");
    setOpen(true);
  };
  const fetchData = async () => {
    // setLoading(true);
    const response = await getListCombo(0, 10, true);
    if (response) {
      if (response.status === "SUCCESS") setData(response.data);
    } else {
      setData([]);
      setLoading(false);
    }
  };

  const fetchServicesSupplierFilters = async () => {
    const response = await getServicesSupplierFilters(0, 0);
    if (response)
      if (response.status === "SUCCESS") {
        setServiceSupplier(response.data);
      } else setServiceSupplier([]);
  };

  const uploadImage = async (files: FileList | null) => {
    if (files) {
      const fileRef = files[0];
      const storageRef = ref(storage, `images/${fileRef?.name}`);

      try {
        // Upload the file to Firebase Storage
        const snapshot = await uploadBytes(storageRef, fileRef);

        // Get the download URL for the file
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Set the state to the download URL
        setImages([...images, downloadURL]);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      let getImagesPayload = "";
      images?.map((image) => {
        getImagesPayload += image + "\n, ";
      });
      
      if(isEdit) {
        const newCombo: ComboUpdate = {
          description: content,
          images: getImagesPayload,
          name: comboTitle,
          id: `${serviceDetail?.id}`,
        };
        const status = await updateCombo(
          newCombo,
          user?.token,
          dispatch,
          navigate
        );
        fetchData();
        handleClose();
        if (status === "SUCCESS") {
          props.setMessageStatus("green");
          props.setMessage("Tạo thành công");
        } else {
          props.setMessageStatus("red");
          props.setMessage(status);
        }
      } else {
        const newCombo: ComboCreate = {
          description: content,
          images: getImagesPayload,
          listServiceSupplierId: selected,
          name: comboTitle,
          staffId: user?.userId,
        };
        const status = await createCombo(
          newCombo,
          user?.token,
          dispatch,
          navigate
        );
        fetchData();
        handleClose();
        if (status === "SUCCESS") {
          props.setMessageStatus("green");
          props.setMessage("Tạo thành công");
        } else {
          props.setMessageStatus("red");
          props.setMessage(status);
        }
      }
    } catch (error) {}

  };

  const handleCancel = () => {
    setComboTitle("");
    setContent("");
    setImages([]);
    setOpen(false);
  };

  return (
    <>
      <Modal open={open} onClose={handleCancel}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
          <FormControl
            fullWidth
            sx={{
              mt: 2,
              display: "flex",
              position: "relative",
              gap: "20px",
            }}
          >
            <TextField
                  sx={{ width: 300 }}
                  label="Tên Combo"
                  value={comboTitle}
                  onChange={(e) => setComboTitle(e.target.value)}
                  required
                />
                
            {
              !isEdit ? (
                <>                
                <Autocomplete
                  disablePortal
                  id="serviceSupplier"
                  options={serviceSupplier}
                  getOptionLabel={(option: ServiceSupplierItem): any => option.name} // Display name in the dropdown
                  sx={{ width: 300 }}
                  isOptionEqualToValue={(option, value) => option.id === value.id} 
                  multiple
                  renderInput={(params) => (
                      <TextField {...params} label="Lựa chọn ServiceSupplies" />
                  )}
                  onChange={(event, value: any) => handleSelectServiceSupplier(value)} // Pass the full object
                />
                </>
              ) : null
            }

            <TextField
              label="Nội dung"
              value={content}
              multiline
              fullWidth
              rows={6}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <input
              type="file"
              name="image"
              accept="image/png, image/jpg"
              onChange={(e) => {
                uploadImage(e.target.files);
              }}
              // multiple
            ></input>
            <div className="images">
              {images && images?.map((item, index) => {
                return (
                  <div className="img-item" key={index}>
                    <img src={item} alt="" />
                  </div>
                );
              })}
            </div>
          </FormControl>
          {
            isloading && (
              <CircularProgress/>
            )
          }
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "Center",
              gap: "12px",
            }}
          >
              <Button variant="outlined" color="info" onClick={handleCancel}>
                Hủy
              </Button>
            <Button
              disabled={comboTitle === "" || content === "" || loading}
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              {loading ? (
                <CircularProgress style={{ height: "14px", width: "14px" }} />
              ) : (isEdit && !isloading) ? (
                "Cập nhập"
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
            Danh sách Combo
          </Typography>
          <Button variant="contained" className="btn-create" onClick={() => {setIsEdit(false); create()}}>
            Tạo combo
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

export default StaffManageComboServices;
