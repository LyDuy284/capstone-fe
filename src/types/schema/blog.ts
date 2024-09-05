export interface BlogItem {
  id: string;
  title: string;
  content: string;
  dateCreated: string;
  serviceSupplierId: string;
  staffId?: string;
  status: string;
}

export interface BlogDetail {
  id: String,
  title: String,
  content: String,
  createAt: String,
  listImages: Array<String>,
  staffName: "Staff",
  status: String,
}