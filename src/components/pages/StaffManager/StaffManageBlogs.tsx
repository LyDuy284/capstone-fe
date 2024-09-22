import TableViewData from "../../common/TableViewData";
import "./StaffManager.css";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Delete, Visibility } from "@mui/icons-material";
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
  createPost,
  deleteBlog,
  getAllBlogPosts,
  getBlogById,
  updatePost,
} from "../../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { BlogsItem } from "../../../types/schema/blog/dto/blog.dto";
import { PostCreate, PostUpdate } from "../../../types/entity/Entity";
import { BlogDetail } from "../../../types/schema/blog";
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

const StaffManageBlogs: FC<Props> = (props) => {
  const user = useSelector((state: any) => state.auth.login.currentUser);
  const location = useLocation();
  const [data, setData] = React.useState<BlogsItem[]>([]);
  const searchParams = new URLSearchParams(location.search);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const status = searchParams.get("status");
  const [open, setOpen] = React.useState(false);
  const [blogID, setBlogID] = useState<string>("");
  const [blogTitle, setBlogTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const handleClose = () => setOpen(false);
  const [title, tittleChange] = useState("Create Blog");
  const [blogDetail, setblogDetail] = useState<BlogDetail[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const storage = getStorage();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = async (id: number, token: string) => {
    try {
      const status = await deleteBlog(id, token);
      if (status === 'success') {
        console.log(`Successfully deleted blog with ID: ${id}`);
      } else {
        console.log(`Failed to delete blog with ID: ${id}. Status: ${status}`);
      }
    } catch (error) {
      console.error(`Error deleting blog with ID: ${id}`, error);
    }
  };

  const defaultColumns: GridColDef[] = [
    {
      field: "id",
      headerName: "Mã blog",
      flex: 1,
    },
    {
      field: "title",
      headerName: "Tiêu đề",
      flex: 1,
    },
    {
      field: "createAt",
      headerName: "Ngày tạo",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Trạng thái",
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
          <IconButton
            aria-label="view"
            onClick={() => handleDelete(params.row.id, user?.token)}
          >
            <Delete sx={{ color: "red", fontSize: 18 }} />
          </IconButton>
        </div>
      ),
    },
  ];
  useEffect(() => {
    fetchData();
  }, [status]);

  const fetchData = async () => {
    // setLoading(true);
    const response = await getAllBlogPosts(0, 30);
    if (response) {
      if (response.status === "SUCCESS") setData(response.data);
    } else {
      setData([]);
      setLoading(false);
    }
  };
  /**
   * handleSubmit
   */

  const update = async (id: string) => {
    setIsEdit(true);
    tittleChange("Cập nhật blog");
    setOpen(true);
    const res = await getBlogById(id);
    setBlogID(id);
    setblogDetail(res.data);
    setBlogTitle(res.title);
    setContent(res.content);
    setImages(res?.listImages);
    
  };

  const create = () => {
    setIsEdit(false);
    tittleChange("Tạo mới blog");
    setOpen(true);
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
      images.map((image) => {
        getImagesPayload += image + "\n, ";
      });
      const newPost: PostCreate = {
        content: content,
        images: getImagesPayload,
        staff: user?.userId,
        title: blogTitle,
      };
      

      if (isEdit) {
        const editPost: PostUpdate = {
          content: content,
          id: blogID,
          images: getImagesPayload,
          title: blogTitle,
        };
  
        const status = await updatePost(
          editPost,
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
        const status = await createPost(
          newPost,
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
    setBlogTitle("");
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
              label="Tên blog"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
              required
            />
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
              {images.map((item, index) => {
                return (
                  <div className="img-item" key={index}>
                    <img src={item} alt="" />
                  </div>
                );
              })}
            </div>
          </FormControl>
          {isEdit && (
            <>
              {blogDetail?.map((detail, id) => {
                return (
                  <div className="detail" key={id}>
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
                        label="Tên blog"
                        value={detail.title}
                        onChange={(e) => setBlogTitle(e.target.value)}
                        required
                      />
                      <TextField
                        label="Nội dung"
                        value={detail.content}
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
                        {images.map((item, index) => {
                          return (
                            <div className="img-item" key={index}>
                              <img src={item} alt="" />
                            </div>
                          );
                        })}
                      </div>
                    </FormControl>
                  </div>
                );
              })}
            </>
          )}
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
              disabled={blogTitle === "" || content === "" || loading}
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
            Danh sách blog
          </Typography>
          <Button variant="contained" className="btn-create" onClick={create}>
            Tạo blog
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

export default StaffManageBlogs;
