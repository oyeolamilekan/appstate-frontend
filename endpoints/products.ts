import { axiosInstance } from "@/config/api";

export const createProduct = async ({ slug, formData }: { slug: string, formData: FormData }) => {
  const { data } = await axiosInstance.post(`products/create_product/${slug}`, formData);
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

export const fetchProductCount = async (productSlug: string) => {
  const { data } = await axiosInstance.get(`products/fetch_product_count/${productSlug}`);
  return data;
}

export const updateProduct = async (body: any) => {
  const storeSlug = body.storeSlug
  const productSlug = body.productSlug
  delete body.storeSlug;
  delete body.productSlug;
  const { data } = await axiosInstance.post(`products/update_product/${storeSlug}/${productSlug}`, body);
  return data;
}
