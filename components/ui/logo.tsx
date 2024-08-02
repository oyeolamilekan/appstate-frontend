import React from 'react'
import Image from 'next/image';
import { useTheme } from 'next-themes';

export function Logo() {
  const { theme } = useTheme();

  return (
    <div className="p-[0.1rem] rounded-full">
      <Image src={theme?.toLowerCase() === 'dark' ? `/logo/LogoWhite.png` : `/logo/LogoBlack.png`} alt='Logo' width={40} height={40} className='rounded-full'/>
    </div>
  )
}
