"use client"

import { Button } from '@/components/ui'
import CustomSupense from '@/components/ui/custom-suspense';
import { CURRENT_STORE } from '@/config/app';
import { fetchProducts } from '@/endpoints/products'
import { useInfiniteScroll, useSessionStorage } from '@/hooks';
import { formatPrice } from '@/lib';
import { useInfiniteQuery } from '@tanstack/react-query';
import { BoxIcon, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation'
import React, { useRef } from 'react'

export default function Products() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const router = useRouter()

  const { value } = useSessionStorage<{ name: string, public_id: string, slug: string }>(CURRENT_STORE);

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    data
  } = useInfiniteQuery({
    queryKey: ["products"],
    queryFn: ({ pageParam = 1 }) => fetchProducts(value?.slug as string, pageParam as number),
    getNextPageParam: prevData => prevData.meta.next_page,
    initialPageParam: 1,
    enabled: value?.slug != null,
  })

  const nextPageAction = async () => {
    if (hasNextPage && !isFetchingNextPage) {
      setIsFetching(true)
      await fetchNextPage()
      setIsFetching(false)
    }
    setIsFetching(false)
  }

  const { isFetching, setIsFetching } = useInfiniteScroll(nextPageAction, scrollRef)

  return (
    <div ref={scrollRef} style={{ height: '100vh', overflowY: 'auto' }}>
      <div className="flex justify-between">
        <h3 className="font-semibold text-2xl dark:text-white">Products</h3>
        <Button size={'small'} onClick={() => router.push("/dashboard/products/create")}><Plus /> Add Product</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-5">
        <CustomSupense
          isLoading={isLoading}
          isError={isError}
          isEmpty={data?.pages[0].data.length <= 0}
          fallBackEmpty={
            <div className="flex flex-col items-center justify-center mx-4 h-screen">
              <div className="p-5 rounded-full dark:bg-neutral-600 bg-secondary">
                <BoxIcon />
              </div>
              <p className="m-3 font-medium dark:text-white">You have no products.</p>
            </div>
          }
        >
          {data?.pages.map((group: any, i: number) => group?.data?.map((product: any, key: number) => (
            <div className="cursor-pointer" key={key - i} onClick={() => router.push(`products/${product.slug}`)}>
              <div
                className="bg-sky-100 w-100 h-48 rounded"
                style={{
                  backgroundImage: `url(${product.image_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
              </div>
              <div className="flex justify-between my-5">
                <h3 className='font-bold text-2xl dark:text-white'>{product.name}</h3>
                <span className='bg-slate-200 dark:bg-neutral-600 px-4 py-1 rounded-full text-sm dark:text-white'>{formatPrice(product.price)}</span>
              </div>
              <p className='dark:text-white'>{product.description}</p>
            </div>
          )))}
        </CustomSupense>
      </div>
      {isFetching && <span className='flex justify-center my-5'>Loading more</span>}
    </div>
  )
}
