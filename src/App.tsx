/** @jsx jsx */
import { jsx, Box } from 'theme-ui'
import React, { useEffect } from 'react'
import BarChart from './components/BarChart'
import { initGoogleAuth, fetchRealtimeData } from './utils/google'
import Header from './components/Header'

function App () {
  useEffect(() => {
    initGoogleAuth().then(isLoggedIn => {
      if (!isLoggedIn) {
        const auth2 = (window as any).gapi.auth2.getAuthInstance().signIn()
        return
      }
    })
  }, [])

  return (
    <div className='App'>
      <div
        sx={{
          maxWidth: 'container',
          mx: 'auto',
          px: 3
        }}
      >
        <Header />
        <div
          sx={{
            display: 'flex',
            flexWrap: 'wrap'
          }}
        >
          <aside
            sx={{
              flexGrow: 1,
              flexBasis: 'sidebar',
              bg: 'primary'
            }}
          >
            <Box p={3}>Sidebar</Box>
          </aside>
          <main
            sx={{
              flexGrow: 99999,
              flexBasis: 0,
              minWidth: 320
            }}
          >
            <Box p={4}>
              <h1>Main</h1>
              <BarChart />
            </Box>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
