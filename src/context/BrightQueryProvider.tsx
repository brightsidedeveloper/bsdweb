import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a new QueryClient instance
const queryClient = new QueryClient()

interface BrightQueryProviderProps {
  children: React.ReactNode
}

// Custom provider that wraps QueryClientProvider
export default function BrightQueryProvider({ children }: BrightQueryProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
