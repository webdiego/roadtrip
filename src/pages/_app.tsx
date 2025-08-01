import "@/styles/globals.css";
import React, { useState } from "react";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
// Create a client
export const queryClient = new QueryClient();
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          <Layout>
            <NextTopLoader color="#2299DD" />
            <Component {...pageProps} />
            <Toaster />
          </Layout>
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
