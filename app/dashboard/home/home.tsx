"use client"

import { DeveloperSideBar } from '@/components/ui'
import React from 'react'
import { useQueries } from "@tanstack/react-query";
import { useSessionStorage } from '@/hooks';
import { CURRENT_STORE } from '@/config/app';
import { fetchProductCount } from '@/endpoints/products';
import { toast } from 'sonner';
import { fetchIntegrationCount } from '@/endpoints/integrations';

export default function Home() {
  const { value } = useSessionStorage<{ name: string, public_id: string, slug: string }>(CURRENT_STORE);

  const [product_count, integration_count] = useQueries({
    queries: [
      {
        queryKey: ['product_count', value?.slug],
        retry: false,
        queryFn: () => fetchProductCount(value?.slug as string),
        enabled: value?.slug !== null,
      },
      {
        queryKey: ['subscription_count', value?.slug],
        retry: false,
        queryFn: () => fetchIntegrationCount(value?.slug as string),
        enabled: value?.slug !== null,
      },
    ]
  })

  return (
    <>
      <h3 className="font-semibold text-2xl dark:text-white">Home</h3>
      <div className="flex space-x-10 my-8">
        <div className="space-y-1 text-center lg:text-left">
          <p className="text-2xl font-semibold text-black-80 mb-2 dark:text-white">{product_count.data?.data.count}</p>
          <p className="text-xs uppercase grotesk tracking-[0.04em] dark:text-white">Products</p>
        </div>
        <div className="space-y-1 text-center lg:text-left">
          <p className="text-2xl font-semibold text-black-80 mb-2 dark:text-white">{integration_count.data?.data.count}</p>
          <p className="text-xs uppercase grotesk tracking-[0.04em] dark:text-white">Integrations</p>
        </div>
      </div>
    </>
  )
}
