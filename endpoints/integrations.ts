import { axiosInstance } from "@/config/api";

export const createIntegration = async (body: any) => {
  const slug = body.slug
  delete body.slug;
  const { data } = await axiosInstance.post(`/integrations/create_integration/${slug}`, body);
  return data;
}

export const fetchIntegrations = async (storeSlug: string) => {
  const { data } = await axiosInstance.get(`/integrations/fetch_integrations/${storeSlug}`);
  return data;
}

export const fetchIntegrationCount = async (storeSlug: string) => {
  const { data } = await axiosInstance.get(`/integrations/fetch_integration_count/${storeSlug}`);
  return data;
}

export const deleteIntegration = async (storeSlug: string, integrationPublicId: string) => {
  const { data } = await axiosInstance.delete(`/integrations/delete_integration/${storeSlug}/${integrationPublicId}`);
  return data;
}
