"use client"

import { SuccessAnimation } from '@/components/ui'

export default function Page() {
  return (
    <div className="flex justify-center items-center h-[60vh] px-4">
      <div className="flex flex-col items-center">
        <SuccessAnimation />
        <h1 className="md:text-3xl text-xl text-center">
          Transactions has been successful
        </h1>
      </div>
    </div>
  )
}
