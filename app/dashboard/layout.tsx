"use client"

import { DeveloperSideBar } from "@/components/ui";

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <DeveloperSideBar>
          <>
            {children}
          </>
        </DeveloperSideBar>
      </body>
    </html>
  );
}
