"use client"

import CustomSupense from '@/components/ui/custom-suspense'
import { CURRENT_STORE } from '@/config/app'
import { fetchProduct } from '@/endpoints/products'
import { useSessionStorage } from '@/hooks'
import { useQuery } from '@tanstack/react-query'
import { BoxIcon } from 'lucide-react'
import React from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui'


type Props = {
  params: {
    slug: string
  }
}

const Page = ({ params: { slug } }: Props) => {

  const { value } = useSessionStorage<{ name: string, public_id: string, slug: string }>(CURRENT_STORE);

  const { isLoading, isError, data } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct(slug as string),
    enabled: slug != null,
    retry: false,
  });

  return (
    <div>
      <CustomSupense
        isLoading={isLoading}
        isError={isError}
      >
        <div className="relative w-20 h-20 mb-7">
          <Image
            src={data?.data?.image_url}
            layout="fill"
            objectFit="cover"
            alt="Description of the image"
            className="object-cover rounded-lg"
          />
        </div>
        <h1 className="text-3xl font-semibold mb-5">{data?.data?.name}</h1>
        <div className="flex space-x-2 mb-4">
          <Button className="h-9" variant={"danger"}>Delete</Button>
          <Button className="h-9">Edit</Button>
        </div>
        <p>{data?.data?.description}</p>
      </CustomSupense>
    </div>
  )
}

export default Page; 
