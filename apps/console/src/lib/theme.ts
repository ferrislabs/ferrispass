import { useEffect, useState } from 'react'

export type AppTheme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'ferrispass-theme'

function applyTheme(theme: AppTheme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.style.colorScheme = theme
}

function getStoredTheme(): AppTheme {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  return storedTheme === 'light' ? 'light' : 'dark'
}

export function initTheme() {
  if (typeof window === 'undefined') {
    return
  }

  applyTheme(getStoredTheme())
}

export function useAppTheme() {
  const [theme, setTheme] = useState<AppTheme>(() => getStoredTheme())

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  return {
    theme,
    toggleTheme: () => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark')),
  }
}
