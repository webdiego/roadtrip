import "@/styles/globals.css";
import React, { useState } from "react";
import type { AppProps } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import Layout from "@/components/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
// Create a client
export const queryClient = new QueryClient();
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ClerkProvider>
        <QueryClientProvider client={queryClient}>
          <Layout>
            <NextTopLoader color="#2299DD" />
            <Component {...pageProps} />
            <Toaster />
          </Layout>
        </QueryClientProvider>
      </ClerkProvider>
    </ThemeProvider>
  );
}
