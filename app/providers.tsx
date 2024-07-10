"use client";

import { Dispatch, ReactNode, SetStateAction, createContext, useEffect } from "react";
import { useTheme } from "next-themes";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextRequest } from "next/server";
import { redirect, usePathname } from "next/navigation";
import { ThemeProvider } from "./next-provider";

const queryClient = new QueryClient();

export const AppContext = createContext<{
    font: string;
    setFont: Dispatch<SetStateAction<string>>;
}>({
    font: "Default",
    setFont: () => { },
});

const ToasterProvider = () => {
    const { theme } = useTheme() as {
        theme: "light" | "dark" | "system";
    };
    return <Toaster theme={theme} position="top-right" />;
};

export default function Providers({ children }: { children: ReactNode }) {

    return (
        <>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
                <ToasterProvider />
            </ThemeProvider>
        </>
    );
}
