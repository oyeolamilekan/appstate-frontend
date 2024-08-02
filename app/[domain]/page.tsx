"use client"

import { fetchProducts } from '@/endpoints'
import { useInfiniteScroll } from '@/hooks';
import { useInfiniteQuery } from '@tanstack/react-query'
import { BoxIcon } from 'lucide-react';
import React, { useRef } from 'react'
import { formatPrice } from '@/lib';
import Link from 'next/link';
import { CustomSupense } from '@/components/ui';

export default function TenantPage({ params }: { params: { domain: string } }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    data
  } = useInfiniteQuery({
    queryKey: ["products", params.domain],
    queryFn: ({ pageParam = 1 }) => fetchProducts(params.domain as string, pageParam as number),
    getNextPageParam: prevData => prevData.meta.next_page,
    initialPageParam: 1,
    enabled: params.domain != null,
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
    <div ref={scrollRef} style={{ height: '100vh', overflowY: 'auto', padding: "9px 20px" }}>
      <CustomSupense
        isLoading={isLoading}
        isError={isError}
        isEmpty={data?.pages[0].data.length <= 0}
        fallBackEmpty={
          <div className="flex items-center justify-center md:h-4/6 h-3/6 w-full">
            <div className="flex flex-col items-center justify-center">
              <div className="p-5 rounded-full dark:bg-neutral-600 bg-secondary">
                <BoxIcon />
              </div>
              <p className="my-4 font-medium dark:text-white text-xl">No products available.</p>
            </div>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 my-5">
          {data?.pages.map((group: any, i: number) => group?.data?.map((product: any, key: number) => (
            <Link key={key - i} href={`/product/${product.slug}`}>
              <div
                className="bg-sky-100 w-100 h-48 rounded"
                style={{
                  backgroundImage: `url(${product.image_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
              </div>
              <div className='space-y-3 mt-4'>
                <h3 className='font-bold md:text-2xl text-xl dark:text-white'>{product.name}</h3>
                <p>
                  <span className='bg-slate-200 dark:bg-neutral-600 px-4 py-1 rounded-full text-sm dark:text-white'>${formatPrice(product.price)}</span>
                </p>
                <p className='dark:text-white'>{product.description}</p>
              </div>
            </Link>
          )))}
        </div>
      </CustomSupense>
      {isFetching && <span className='flex justify-center my-5'>Loading more</span>}
    </div>
  )
}
