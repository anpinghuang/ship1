"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 2 * 60 * 1000,        // 2 minutes before considered stale
            gcTime: 10 * 60 * 1000,           // 10 minutes in garbage collection
            refetchOnWindowFocus: false,       // Don't refetch on tab focus
            retry: 1,
        },
    },
});

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
