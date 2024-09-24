import TableViewData from "../../common/TableViewData";
import "./StaffManager.css";
import {
  Autocomplete,
  Box,
  Button,
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
  createServices,
  getAllListServices,
  getListCategories,
  getServiceById,
  updateServices,
} from "../../../redux/apiRequest";
import { CategoryItem } from "../../../types/schema/category";
import { useDispatch, useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { ServicesCreate, ServicesUpdate } from "../../../types/entity/Entity";
import { ServiceDetail, ServiceItem } from "../../../types/schema/service";
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
const defaultValueCategory: CategoryItem = {
  id: "all",
  categoryName: "TẤT CẢ",
  status: "ACTIVATED",
};

const StaffManageServices: FC<Props> = (props) => {
  const user = useSelector((state: any) => state.auth.login.currentUser);
  const location = useLocation();
  const [data, setData] = React.useState<ServiceItem[]>([]);
  const searchParams = new URLSearchParams(location.search);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [title, tittleChange] = useState("Create Service");
  const [serviceDetail, setServiceDetail] = useState<ServiceDetail[]>([]);

  const status = searchParams.get("status");
  const [open, setOpen] = React.useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [serviceTitle, setServiceTitle] = useState<string>("");
  const [serviceID, setServiceID] = useState<string>("");
  const [selected, setSelected] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const handleClose = () => setOpen(false);
  const [images, setImages] = useState<string[]>([]);
  const storage = getStorage();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSelectCategory = (value: CategoryItem | null) => {
    if (value) {
        const selectedID = value.id; 
        setSelected(selectedID);
        console.log(selectedID);
        
    } else {
        console.error("No valid category item selected");
    }
};

  const defaultColumns: GridColDef[] = [
    {
      field: "id",
      headerName: "Mã dịch vụ",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Tiêu đề",
      flex: 1,
    },
    {
      field: "createAt",
      headerName: "Ngày tạo",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Hành động",
      align: "center",
      headerAlign: "center",
      flex: 1,
      renderCell: (params: any) => (
        <div className="flex justify-center">
          <IconButton aria-label="view" onClick={() => update(params.row.id)}>
            <Visibility sx={{ color: "blue", fontSize: 18 }} />
          </IconButton>
        </div>
      ),
    },
  ];
  useEffect(() => {
    fetchCategories();
    fetchData();
  }, [status]);

  const update = async (id: string) => {
    setIsEdit(true);
    tittleChange("Cập nhật dịch vụ");
    setOpen(true);
    const res = await getServiceById(id);
    setServiceID(id);
    setServiceDetail(res.data);
    setServiceTitle(res.name);
    setContent(res.description);
    
  };
  const create = () => {
    setIsEdit(false);
    tittleChange("Tạo mới dịch vụ");
    setOpen(true);
  };
  const fetchData = async () => {
    // setLoading(true);
    const response = await getAllListServices(0, 10);
    if (response) {
      if (response.status === "SUCCESS") setData(response.data);
    } else {
      setData([]);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const response = await getListCategories(0, 30);
    if (response)
      if (response.status === "SUCCESS") {
        setCategories([defaultValueCategory, ...response?.data]);
      } else setCategories([]);
  };
  /**
   * handleSubmit
   */

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
      images.map((image) => {
        getImagesPayload += image + "\n, ";
      });
      const newServices: ServicesCreate = {
        categoryId: selected,
        description: content,
        images: getImagesPayload,
        name: serviceTitle,
      };
      
      if (isEdit) {
        const updateService: ServicesUpdate= {
          description: content,
          id: serviceID,
          images: getImagesPayload,
          name: serviceTitle,
        };
        const status = await updateServices(
          updateService,
          user?.token,
          dispatch,
          navigate
        );
        fetchData();
        handleClose();
        if (status === "SUCCESS") {
          props.setMessageStatus("green");
          props.setMessage("Cập nhập thành công");
        } else {
          props.setMessageStatus("red");
          props.setMessage(status);
        }
      } else {
        const status = await createServices(
          newServices,
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
    setServiceTitle("");
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
              label="Tên dịch vụ"
              value={serviceTitle}
              onChange={(e) => setServiceTitle(e.target.value)}
              required
            />

            {
              !isEdit ? (
                <> 
              <Autocomplete
              disablePortal
              id="category"
              options= {categories}
              getOptionLabel={(option: CategoryItem): any => option.categoryName}
              sx={{ width: 300 }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField {...params} label="Lựa chọn category" />
              )}
              onChange={(event, value: any) => handleSelectCategory(value)}
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
              disabled={serviceTitle === "" || content === "" || loading}
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              {loading ? (
                <CircularProgress style={{ height: "14px", width: "14px" }} />
              ) : isEdit ? (
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
            Danh sách dịch vụ
          </Typography>
          <Button variant="contained" className="btn-create" onClick={create}>
            Tạo dịch vụ
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
export default StaffManageServices;
