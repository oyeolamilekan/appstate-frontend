import React from 'react'
import { useRouter } from 'next/navigation'
import { Button, Logo } from '../ui'
import { pushToNewTab } from '@/lib'

export function Navigation() {
  const router = useRouter()

  return (
    <nav className="sticky z-50 inset-x-0 top-0 py-3 border-b backdrop-blur-md px-2 dark:border-gray-800">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-1">
        <a href="#" className="flex items-center space-x-1 rtl:space-x-reverse">
          <span className="self-center font-semibold whitespace-nowrap uppercase dark:text-gray-300">
            <Logo />
          </span>
        </a>
        <div className='space-x-3'>
          <Button variant={'outline'} size={'small'} onClick={() => pushToNewTab("https://github.com/oyeolamilekan/appstate-frontend")}>View Frontend Code</Button>
          <Button variant={'dark'} size={'small'} onClick={() => pushToNewTab("https://github.com/oyeolamilekan/appstate-backend")}>View Backend Code</Button>
        </div>
      </div>
    </nav>
  )
}
