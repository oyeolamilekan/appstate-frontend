import { BASE_URL } from "@/config/url";
import { getSubdomain } from "@/lib";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import Image from 'next/image'

async function fetchSeoData(subdomain: string) {
  const response = await fetch(`${BASE_URL}stores/fetch_store/${subdomain}`);
  const data = await response.json();
  return data.data;
}

export async function generateMetadata({ params }: { params: { domain: string } }): Promise<Metadata> {
  const pageData = await fetchSeoData(params.domain as string);
  const headersList = headers();
  const hostname = headersList.get('host') || '';

  return {
    title: pageData?.name,
    description: pageData?.description.substring(0, 160),
    icons: {
      icon: pageData?.logo_url,
    },
    openGraph: {
      title: pageData?.title,
      description: pageData?.description,
      url: `https://${hostname}`,
      siteName: pageData?.title,
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

export default async function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const headersList = headers();
  const hostname = headersList.get('host');
  const subdomain = getSubdomain(hostname);
  const pageData = await fetchSeoData(subdomain as string)

  return (
    <html lang="en">
      <body>
        <>
          <div className="p-4 border-b dark:border-gray-800">
            <div className="flex justify-between">
              <Link href="/">
                <div className="flex space-x-2 items-center">
                  {pageData && <Image
                    src={pageData.logo_url}
                    alt={'d'}
                    width={20}
                    height={20}
                    className="cursor-pointer rounded-full"
                  />}
                  <span className="font-semibold">{pageData?.name}</span>
                </div>
              </Link>
            </div>
          </div>
          {children}
        </>
      </body>
    </html>
  );
}