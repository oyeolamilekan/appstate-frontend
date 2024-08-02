import { axiosInstance } from "@/config/api";

export const fetchStores = async () => {
  const { data } = await axiosInstance.get('/stores/fetch_stores');
  return data;
}

export const createStore = async ({ formData }: { formData: FormData }) => {
  const { data } = await axiosInstance.post('/stores/create_store', formData);
  return data;
}

export const fetchStore = async (storeSlug: string) => {
  const { data } = await axiosInstance.get(`/stores/fetch_store/${storeSlug}`);
  return data;
}

export const updateStore = async (body: any) => {
  const public_id = body.public_id
  delete body.public_id;
  const { data } = await axiosInstance.put(`stores/update_store/${public_id}`, body);
  return data
}
