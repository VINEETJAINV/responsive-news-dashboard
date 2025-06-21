import '../styles/globals.css'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '../store'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { SessionProvider } from 'next-auth/react'

function MyAppWrapper({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <ReduxProvider store={store}>
      <SessionProvider session={session}>
        <ThemeManager>
          <Component {...pageProps} />
        </ThemeManager>
      </SessionProvider>
    </ReduxProvider>
  )
}

function ThemeManager({ children }) {
  const mode = useSelector(state => state.theme.mode)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (mode === 'system') {
      const systemMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemMode)
    } else {
      root.classList.add(mode)
    }
  }, [mode])

  return children
}

export default MyAppWrapper
