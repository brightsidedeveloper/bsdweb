import toast, { ToastOptions } from 'react-hot-toast'

export default function wetToast(message: Parameters<typeof toast>[0], opts?: ToastOptions) {
  return toast(message, {
    ...opts,
    style: {
      background: 'var(--background)',
      color: 'var(--text)',
      border: '1px solid var(--border)',
      ...opts?.style,
    },
  })
}
