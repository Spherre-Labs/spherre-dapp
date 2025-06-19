// import React, { createContext, useContext, useEffect, useState } from 'react'

// const ThemeContext = createContext({
//   theme: 'dark',
//   setTheme: (theme: 'dark' | 'light') => {},
// })

// export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
//   const [theme, setTheme] = useState<'dark' | 'light'>(
//     typeof window !== 'undefined' && localStorage.getItem('spherre-theme')
//       ? (localStorage.getItem('spherre-theme') as 'dark' | 'light')
//       : 'dark',
//   )

//   useEffect(() => {
//     localStorage.setItem('spherre-theme', theme)
//     const root = document.documentElement
//     if (theme === 'dark') {
//       root.style.setProperty('--bg-primary', '#030712')
//       root.style.setProperty('--bg-secondary', '#111827')
//       root.style.setProperty('--text-primary', '#ffffff')
//       root.style.setProperty('--text-secondary', '#9ca3af')
//       document.body.style.backgroundColor = '#030712'
//       document.body.style.color = '#ffffff'
//     } else {
//       root.style.setProperty('--bg-primary', '#ffffff')
//       root.style.setProperty('--bg-secondary', '#f9fafb')
//       root.style.setProperty('--text-primary', '#111827')
//       root.style.setProperty('--text-secondary', '#6b7280')
//       document.body.style.backgroundColor = '#ffffff'
//       document.body.style.color = '#111827'
//     }
//   }, [theme])

//   return (
//     <ThemeContext.Provider value={{ theme, setTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   )
// }

// export const useTheme = () => useContext(ThemeContext)
