import { BASE_URL } from "@/config/url";
import { getSubdomain } from "@/lib";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import Image from 'next/image';

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

export async function generateMetadata({ params }: { params: { domain: string } }): Promise<Metadata> {
  const pageData = await fetchSeoData(params.domain);
  const headersList = headers();
  const hostname = headersList.get('host') || '';

  const title = pageData?.name || 'Default Title';
  const description = pageData?.description?.substring(0, 160) || 'Default Description';

  return {
    title,
    description,
    icons: {
      icon: pageData?.logo_url || '/default-icon.png',
    },
    openGraph: {
      title,
      description,
      url: `https://${hostname}`,
      siteName: title,
      images: [
        {
          url: pageData?.image_url || '/default-og-image.png',
          width: 1200,
          height: 630,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [pageData?.image_url || '/default-twitter-image.png'],
    }
  };
}

export default async function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const hostname = headersList.get('host') || '';
  const subdomain = getSubdomain(hostname);
  const pageData = await fetchSeoData(subdomain as string);

  return (
    <html lang="en">
      <body>
        <header className="p-4 border-b dark:border-gray-800">
          <div className="flex justify-between">
            <Link href="/" className="flex space-x-2 items-center">
              {pageData?.logo_url && (
                <Image
                  src={pageData.logo_url}
                  alt={`${pageData.name} logo`}
                  width={20}
                  height={20}
                  className="cursor-pointer rounded-full"
                />
              )}
              <span className="font-semibold">{pageData?.name || 'Default Name'}</span>
            </Link>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}