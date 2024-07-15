import { ReactElement, useEffect, useReducer, useState } from 'react'
import { useClickOutside, useSessionStorage, clearSessionStorage } from '@/hooks';
import { CURRENT_STORE } from '@/config/app';
import Link from 'next/link';
import { getSubdomainUrl, pushToNewTab, redirectUrl } from '@/lib';
import { HomeIcon, LayoutGrid, LogOut, Menu, MoonStar, ShoppingBag, SunDim } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Button } from './button';
import { deleteCookie } from 'cookies-next';
import { Modal } from './modal';

export function DeveloperSideBar({ children }: PropTypes) {

  const [mounted, setMounted] = useState(false)

  const { value } = useSessionStorage<{ name: string, public_id: string, slug: string }>(CURRENT_STORE);

  const initState = { logoutModal: false }

  const [modals, updateModals] = useReducer((prev: typeof initState, next: Partial<typeof initState>): typeof initState => {
    return { ...prev, ...next }
  }, initState)

  const [sideBarState, toggleSideBarState] = useState<boolean>(true);

  const sideBarNode = useClickOutside(() => {
    toggleSideBarState(true)
  }, 'sidebar-btn')

  const toggleSideBar = () => toggleSideBarState(!sideBarState);

  const toggleConfirmLogout = () => updateModals({ logoutModal: !modals.logoutModal })

  const logoutUser = () => {
    deleteCookie("token")
    clearSessionStorage()
    redirectUrl("/dashboard/sign-in")
  }

  const path = usePathname()

  const { setTheme, theme } = useTheme();

  const checkIfActive = (route: string): boolean => {

    return path.startsWith(route);
  };

  useEffect(() => setMounted(true), [])

  return (
    <div className='flex bg-slate-100 dark:bg-neutral-900 h-screen'>
      <div className={`flex flex-shrink-0 flex-col justify-between md:sticky fixed inset-y-0 left-0 transform bg-slate-100 dark:bg-neutral-900 ${sideBarState ? '-translate-x-full' : ''} md:translate-x-0 transition duration-200 ease-in-out top-0 h-screen z-10`} ref={sideBarNode}>
        <div className='flex flex-col w-56'>
          <div className='py-5 px-4'>
            {value && <div className='mt-1 px-4 py-2 mb-4 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-800 rounded cursor-pointer'>
              <h3 className='text-lg font-semibold'>{value?.name}</h3>
              <span className='text-xs'>Merchant ID: {value?.public_id}</span>
            </div>}
            <ul className='flex flex-col gap-3'>
              <li>
                <Link href={`/dashboard/home`} className={`${!value ? "cursor-not-allowed" : ""} flex flex-row gap-2 w-full dark:text-white items-center hover:bg-gray-200 dark:hover:bg-neutral-800 ${checkIfActive("/dashboard/home") ? "bg-gray-200 dark:bg-neutral-800 font-semibold" : ""} hover:font-semibold rounded px-3 py-2 transition-all duration-200`} onClick={(e) => { if (!value) e.preventDefault() }}>
                  <HomeIcon strokeWidth={checkIfActive("/dashboard/home") ? 2 : 1.5} />
                  <span className="text-[0.9rem]">Home</span>
                </Link>
              </li>
              <li>
                <Link href={`/dashboard/products`} className={`${!value ? "cursor-not-allowed" : ""} flex flex-row gap-2 w-full dark:text-white items-center hover:bg-gray-200 dark:hover:bg-neutral-800 ${checkIfActive("/dashboard/products") ? "bg-gray-200 dark:bg-neutral-800 font-semibold" : ""} hover:font-semibold rounded px-3 py-2 transition-all duration-200`} onClick={(e) => { if (!value) e.preventDefault() }}>
                  <ShoppingBag strokeWidth={checkIfActive("/dashboard/products") ? 2 : 1.5} />
                  <span className="text-[0.9rem]">Products</span>
                </Link>
              </li>
              <li>
                <Link href={`/dashboard/integrations`} className={`${!value ? "cursor-not-allowed" : ""} flex flex-row gap-2 w-full dark:text-white items-center hover:bg-gray-200 dark:hover:bg-neutral-800 ${checkIfActive("/dashboard/integrations") ? "bg-gray-200 dark:bg-neutral-800 font-semibold" : ""} hover:font-semibold rounded px-3 py-2 transition-all duration-200`} onClick={(e) => { if (!value) e.preventDefault() }}>
                  <LayoutGrid strokeWidth={checkIfActive("/dashboard/integrations") ? 2 : 1.5} />
                  <span className="text-[0.9rem]">Integrations</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className='mt-10 flex flex-col'>
          {value && <Button className="mx-5" onClick={() => pushToNewTab(getSubdomainUrl(`${value.slug}`))}>
            View Store
          </Button>}
          {mounted && <Button className="mx-5 my-5 space-y-8" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <SunDim /> : <MoonStar />} Switch Theme
          </Button>}
          <Button onClick={toggleConfirmLogout} className="mx-5 mb-5 space-x-2">
            <LogOut className="mr-1" /> Logout
          </Button>
        </div>
      </div>
      <div className='flex flex-col w-0 flex-1 bg-white dark:bg-black md:rounded-xl m-0 md:m-3 md:shadow'>
        <div onClick={toggleSideBar} id="sidebar-btn" className="md:hidden pl-5 pt-4"><Menu /></div>
        <div className="px-5 py-5 overflow-hidden">
          {children}
        </div>
      </div>
      <Modal isShown={modals.logoutModal} onClose={toggleConfirmLogout}>
        <>
          <p className='text-center'>Are you sure you want to logout?</p>
          <div className='flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-2 mt-10'>
            <Button onClick={logoutUser} loading={false} size={'full'}>Yes</Button>
            <Button variant='outline' onClick={toggleConfirmLogout} size={'full'}>No, take me back.</Button>
          </div>
        </>
      </Modal>
    </div>
  )
}

interface PropTypes {
  children?: ReactElement;
}