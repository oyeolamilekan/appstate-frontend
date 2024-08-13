import { axiosInstance } from "@/config/api";

export const fetchInvoices = async (storeId: string, page = 1) => {
  const { data } = await axiosInstance.get(`/orders/invoices?store_id=${storeId}&page=${page}`);
  return data;
}