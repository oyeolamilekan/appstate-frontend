import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../ui'

export function Navigation() {
  const router = useRouter()

  return (
    <nav className="sticky z-50 inset-x-0 top-0 py-3 border-b backdrop-blur-sm px-2 dark:border-gray-800">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-1">
        <a href="#" className="flex items-center space-x-1 rtl:space-x-reverse">
          <span className="self-center font-semibold whitespace-nowrap uppercase dark:text-gray-300">APPSTATE</span>
        </a>
        <div className='space-x-3'>
          <Button variant={'outline'} size={'small'} onClick={() => router.push("/auth/sign-in")}>Sign In</Button>
          <Button variant={'dark'} size={'small'} onClick={() => router.push("/auth/sign-up")}>Sign Up</Button>
        </div>
      </div>
    </nav>
  )
}
