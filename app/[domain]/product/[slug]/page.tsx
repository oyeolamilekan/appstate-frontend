import { Metadata } from "next";
import Product from "./product";
import { headers } from "next/headers";
import { BASE_URL } from "@/config/url";

async function fetchSeoData(subdomain: string) {
  const response = await fetch(`${BASE_URL}products/fetch_product/${subdomain}`);
  const data = await response.json();
  return data.data;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {}
  const pageData = await fetchSeoData(params.slug as string);
  const headersList = headers();
  const hostname = headersList.get('host') || '';

  return {
    title: `${pageData?.name}`,
    description: pageData?.description.substring(0, 160),
    icons: {
      icon: pageData?.image_url,
    },
    openGraph: {
      title: pageData?.title,
      description: pageData?.description,
      url: `https://${hostname}`,
      siteName: 'Soft App',
      images: [
        {
          url: pageData?.image_url,
          width: 1200,
          height: 630,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageData?.title,
      description: pageData?.description,
      images: [pageData?.image_url],
    }
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div>
      <Product slug={params.slug} />
    </div>
  )
}