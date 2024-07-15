"use client"

import { deleteProduct, fetchProduct } from '@/endpoints/products'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Pencil, Trash2 } from 'lucide-react'
import React, { useReducer } from 'react'
import Image from 'next/image';
import { Button, CustomSupense, Modal } from '@/components/ui'
import { Gallery } from '@/components/ui/gallery'
import { toast } from 'sonner'


type Props = {
  params: {
    slug: string
  }
}

const Page = ({ params: { slug } }: Props) => {

  const initState = { deleteProductModal: false }

  const [modals, updateModals] = useReducer((prev: typeof initState, next: Partial<typeof initState>): typeof initState => {
    return { ...prev, ...next }
  }, initState)

  const toggleDeleteProductModal = () => updateModals({ deleteProductModal: !modals.deleteProductModal })

  const router = useRouter()

  const { isLoading, isError, data } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct(slug as string),
    enabled: slug != null,
    retry: false,
  });

  const { isPending, mutate } = useMutation({
    mutationFn: () => deleteProduct(slug),
    async onSuccess() {
      toast.success("Successfully deleted product.")
      router.push('/dashboard/products')
    },
    onError(err: any) {
      const { message } = err.response?.data;
      toast.error(message);
    },
  })

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
          <Button className="h-9" variant={"danger"} onClick={toggleDeleteProductModal} loading={isPending}><Trash2 height={17} /> Delete</Button>
          <Button className="h-9"><Pencil height={17} /> Edit</Button>
        </div>
        <p>{data?.data?.description}</p>
        <h5 className="font-semibold text-xl my-5">Screenshots {data?.data?.gallery_imaages.length}</h5>
        <Gallery images={data?.data?.gallery_imaages ?? []} />
      </CustomSupense>
      <Modal isShown={modals.deleteProductModal} onClose={toggleDeleteProductModal}>
        <>
          <p className='text-center'>Are you sure you want to delete this product?</p>
          <div className='flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-2 mt-10'>
            <Button onClick={() => mutate()} loading={isPending} size={'full'}>Yes</Button>
            <Button variant='outline' onClick={toggleDeleteProductModal} size={'full'}>No, take me back.</Button>
          </div>
        </>
      </Modal>
    </div>
  )
}

export default Page; 
