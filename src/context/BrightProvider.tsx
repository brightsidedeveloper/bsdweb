import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

// Create a new QueryClient instance
const queryClient = new QueryClient()

interface BrightProviderProps {
  children: React.ReactNode
}

// Custom provider that wraps QueryClientProvider
export default function BrightProvider({ children }: BrightProviderProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      <Toaster />
    </>
  )
}
