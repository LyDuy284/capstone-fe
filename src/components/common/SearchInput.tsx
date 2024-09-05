import { Search } from "@mui/icons-material";
import { IconButton, InputBase, Paper } from "@mui/material";

const SearchInput = () => {
  return (
    <Paper
      component="form"
      className=" border-gray border"
      sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 300 }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Tìm kiếm"
        inputProps={{ "aria-label": "search" }}
      />
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <Search />
      </IconButton>
    </Paper>
  );
};

export default SearchInput;
