"use client"

import { Button, CustomSupense } from "@/components/ui";
import { Gallery } from "@/components/ui/gallery";
import { createPaymentLink, fetchProduct } from "@/endpoints/products";
import { formatPrice, redirectUrl } from "@/lib";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ShoppingBag } from "lucide-react";
import Image from 'next/image';
import { toast } from "sonner";

interface ProductProps {
  slug: string
}

export default function Product({ slug }: ProductProps) {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct(slug as string),
    enabled: slug != null,
    retry: false,
  });

  const { isPending, mutate } = useMutation({
    mutationFn: createPaymentLink,
    async onSuccess({ data }) {
      const { link } = data
      redirectUrl(link)
    },
    onError(err: any) {
      const { message } = err.response?.data;
      toast.error(message);
    },
  })

  const onClick = async (slug: string) => {
    mutate(slug);
  };

  return (
    <div className="max-w-6xl m-auto md:py-9 p-4">
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
          <Button className="h-9" variant={"dark"} onClick={() => onClick(data?.data?.slug)} loading={isPending}><ShoppingBag height={17} className="mr-1" /> Buy ${formatPrice(data?.data?.price ?? "")}</Button>
        </div>
        <p>{data?.data?.description}</p>
        <h5 className="font-semibold text-xl my-5">Screenshots {data?.data?.gallery_imaages.length}</h5>
        <Gallery images={data?.data?.gallery_imaages ?? []} />
      </CustomSupense>
    </div>
  )
}
