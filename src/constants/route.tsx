import {
  Apps,
  AppsOutlined,
  Category,
  Comment,
  Dashboard,
  Diversity3Outlined,
  DynamicFeed,
  SpaceDashboard,
} from "@mui/icons-material";
import { Route } from "../types/common";

export const listStaffRoute: Route[] = [
  {
    title: "Gói dịch vụ",
    icon: <Apps />,
    path: "/staff/combo-services",
  },
  {
    title: "Loại dịch vụ",
    icon: <DynamicFeed />,
    path: "/staff/categories",
  },
  {
    title: "Dịch vụ",
    icon: <Comment />,
    path: "/staff/services",
  },
  {
    title: "Cẩm nang",
    icon: <Category />,
    path: "/staff/blogs",
  },
  // {
  //   title: "",
  //   path: "/staff/blog-detail",
  // },
];

export const listSupplierRoute: Route[] = [
  {
    title: "Dashboard",
    icon: <SpaceDashboard />,
    path: "/service-suppliers-dashboard",
  },
];
