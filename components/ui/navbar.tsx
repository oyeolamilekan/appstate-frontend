import Link from 'next/link';
import React from 'react'
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '@/config/url';


interface StoreFrontNavbarProps {
  subdomain: string | null;
}

interface StoreData {
  name: string;
  description: string;
  logo_url: string;
  image_url: string;
}

async function fetchSeoData(subdomain: string): Promise<StoreData> {
  try {
    const response = await fetch(`${BASE_URL}stores/fetch_store/${subdomain}`, { next: { revalidate: 3600 } });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch SEO data:", error);
    return {} as StoreData;
  }
}

export const StoreFrontNavbar: React.FC<StoreFrontNavbarProps> = ({ subdomain }) => {
  const { data: storeData, isLoading, isError } = useQuery({
    queryKey: ["product", subdomain],
    queryFn: () => fetchSeoData(subdomain as string),
    enabled: subdomain != null,
    retry: false,
  });;

  if (isLoading) {
    return (
      <header className="p-4 border-b dark:border-gray-800">
        <div className="flex justify-between">
          <span>Loading...</span>
        </div>
      </header>
    );
  }

  if (isError) {
    return (
      <header className="p-4 border-b dark:border-gray-800">
        <div className="flex justify-between">
          <span>Error loading store data</span>
        </div>
      </header>
    );
  }

  return (
    <header className="p-4 border-b dark:border-gray-800">
      <div className="flex justify-between">
        <Link href="/" className="flex space-x-2 items-center">
          {storeData?.logo_url && (
            <Image
              src={storeData.logo_url}
              alt={`${storeData.name} logo`}
              width={20}
              height={20}
              className="cursor-pointer rounded-full"
            />
          )}
          <span className="font-semibold">{storeData?.name}</span>
        </Link>
      </div>
    </header>
  );
};