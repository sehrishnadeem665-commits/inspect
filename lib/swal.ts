// Client-only helper for SweetAlert2 popups
export async function showSwal(options: {
  title?: string
  text?: string
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question'
  timer?: number
  showConfirmButton?: boolean
}) {
  // Dynamic import so server-side bundling isn't affected
  const Swal = (await import('sweetalert2')).default
  return Swal.fire(options as any)
}
