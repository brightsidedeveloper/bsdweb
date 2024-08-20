import debug from 'debug'

const log = debug('brightside:brightweb:theme')

export default class BrightWebTheme {
  /**
   * Initialize the theme from local storage (which falls back to system preference)
   */
  static initializeTheme() {
    const theme = BrightWebTheme.getLocalTheme()
    log('Initializing theme: %s', theme)
    BrightWebTheme.setTheme(theme)
  }

  /**
   * Get the user's system preference for dark mode
   * @returns true if the user prefers dark mode
   */
  static getSystemPrefersDark() {
    return matchMedia('(prefers-color-scheme: dark)').matches
  }

  /**
   * Get the user's preference for dark mode from local storage
   * @returns 'dark', 'light', or null
   */
  static getLocalTheme() {
    return localStorage.getItem('theme') as 'dark' | 'light' | null
  }

  /**
   * Set the theme to light, dark, or system in local storage and on the html element class list
   * @param choice light, dark, or null (which will use system)
   */
  static setTheme(choice: 'dark' | 'light' | null) {
    // Set Local Storage
    if (!choice) localStorage.removeItem('theme')
    else localStorage.setItem('theme', choice)
    // Check if the user has a preference for dark mode (if not set)
    if (!choice && BrightWebTheme.getSystemPrefersDark()) choice = 'dark'

    const htmlClassList = document.documentElement.classList

    htmlClassList.toggle('dark', choice === 'dark')
  }

  /**
   * Runs InitializeTheme with the local storage changes
   * @returns a cleanup function to remove the event listener
   */
  static storageThemeEventListener() {
    window.addEventListener('storage', BrightWebTheme.initializeTheme)
    return () => window.removeEventListener('storage', BrightWebTheme.initializeTheme)
  }

  /**
   * Runs InitializeTheme with the media query changes [ matching: (prefers-color-scheme: dark) ]
   * @returns a cleanup function to remove the event listener
   */
  static mediaThemeEventListener() {
    const media = matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', BrightWebTheme.initializeTheme)
    return () => media.removeEventListener('change', BrightWebTheme.initializeTheme)
  }
}
