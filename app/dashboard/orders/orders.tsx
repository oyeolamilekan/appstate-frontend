"use client"

import { CURRENT_STORE } from "@/config/app";
import { fetchInvoices } from "@/endpoints/invoices";
import { useInfiniteScroll, useSessionStorage } from "@/hooks";
import { formatPrice } from "@/lib";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";

export default function Orders() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { value } = useSessionStorage<{ name: string, public_id: string, slug: string, id: string }>(CURRENT_STORE);

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    data
  } = useInfiniteQuery({
    queryKey: ["integrations", value?.id],
    queryFn: ({ pageParam = 1 }) => fetchInvoices(value?.id as string, pageParam as number),
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
    <>
      <h3 className="font-semibold text-2xl mb-4 dark:text-white">Orders</h3>
      <div className="container mx-auto py-6 bg-white dark:bg-black text-black dark:text-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-200 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3">Invoice Id</th>
                <th scope="col" className="px-6 py-3">Full Name</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Amount</th>
                <th scope="col" className="px-6 py-3">Github Username</th>
                <th scope="col" className="px-6 py-3">Item description</th>
              </tr>
            </thead>
            <tbody>
              {data?.pages.map((group: any, i: number) => group?.data?.map((invoice: any, key: number) => (
                <tr key={key} className="border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-900">
                  <td className="px-6 py-4 font-medium whitespace-nowrap">{invoice.public_id}</td>
                  <td className="px-6 py-4">{invoice.customer.name}</td>
                  <td className="px-6 py-4">{invoice.customer.email}</td>
                  <td className="px-6 py-4">{formatPrice((parseInt(invoice.unit_price) / 100).toString())}</td>
                  <td className="px-6 py-4">{invoice.customer.github_username}</td>
                  <td className="px-6 py-4">{invoice.description}</td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
        {isFetching && <span className='flex justify-center my-5'>Loading more</span>}
      </div>
    </>
  )
}