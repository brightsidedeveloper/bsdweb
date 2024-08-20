import toast, { ToastOptions } from 'react-hot-toast'

export default function wetToast(message: Parameters<typeof toast>[0], opts?: ToastOptions) {
  return toast(message, {
    ...opts,
    style: {
      background: 'hsl(var(--card))',
      color: 'hsl(var(--foreground))',
      border: '1px solid hsl(var(--border))',
      ...opts?.style,
    },
  })
}
