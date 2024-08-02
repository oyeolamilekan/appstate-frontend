import { axiosInstance } from "@/config/api";

export const createProduct = async ({ slug, formData }: { slug: string, formData: FormData }) => {
  const { data } = await axiosInstance.post(`products/create_product/${slug}`, formData);
  return data;
}

export const deleteProduct = async (storeSlug: string) => {
  const { data } = await axiosInstance.delete(`products/delete_product/${storeSlug}`);
  return data;
}

export const removeImage = async (body: any) => {
  const { image_url, product_slug } = body
  const { data } = await axiosInstance.delete(`products/delete_image/${product_slug}?image_url=${image_url}`);
  return data;
}

export const addImage = async ({ slug, formData }: { slug: string, formData: FormData }) => {
  const { data } = await axiosInstance.put(`products/add_image/${slug}`, formData);
  return data;
}

export const changeProductLogo = async ({ public_id, formData }: { public_id: string, formData: FormData }) => {
  const { data } = await axiosInstance.put(`products/change_product_logo/${public_id}`, formData);
  return data;
}

export const changeStoreLogo = async ({ public_id, formData }: { public_id: string, formData: FormData }) => {
  const { data } = await axiosInstance.put(`products/change_store_logo/${public_id}`, formData);
  return data;
}

export const createPaymentLink = async (productSlug: string) => {
  const { data } = await axiosInstance.post(`products/create_payment_link/${productSlug}`);
  return data;
}

export const fetchProducts = async (storeSlug: string, page = 1) => {
  const { data } = await axiosInstance.get(`products/fetch_products/${storeSlug}?page=${page}`);
  return data;
}

export const fetchProduct = async (productSlug: string) => {
  const { data } = await axiosInstance.get(`products/fetch_product/${productSlug}`);
  return data;
}

export const fetchProductByPublicId = async (productPublicId: string) => {
  const { data } = await axiosInstance.get(`products/fetch_product_by_public_id/${productPublicId}`);
  return data;
}

export const fetchProductCount = async (productSlug: string) => {
  const { data } = await axiosInstance.get(`products/fetch_product_count/${productSlug}`);
  return data;
}

export const updateProduct = async (body: any) => {
  const storeSlug = body.storeSlug
  const productSlug = body.productSlug
  delete body.storeSlug;
  delete body.productSlug;
  const { data } = await axiosInstance.put(`products/update_product/${storeSlug}/${productSlug}`, body);
  return data;
}
