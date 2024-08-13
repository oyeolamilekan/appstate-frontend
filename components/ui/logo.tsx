import React from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export function Logo() {
  const { resolvedTheme } = useTheme();

  const logoSrc = resolvedTheme === 'dark' ? '/logo/LogoBlack.png' : '/logo/LogoWhite.png';

  return (
    <div className="p-[0.1rem] rounded-full">
      <Image 
        src={logoSrc} 
        alt='Appstate Logo' 
        width={40} 
        height={40} 
        className='rounded-full'
        priority
        onError={() => console.error('Failed to load image:', logoSrc)}
      />
    </div>
  );
}