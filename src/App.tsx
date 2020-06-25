/** @jsx jsx */
import { jsx, Box } from 'theme-ui'
import React, { useEffect } from 'react'
import BarChart from './components/BarChart'
import Sunburst from './components/Sunburst'
import { initGoogleAuth, fetchUserBrowserData } from './utils/google'
import Header from './components/Header'
import Link from './components/Link'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

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
        <Router>
          <div
            sx={{
              display: 'flex',
              flexWrap: 'wrap'
            }}
          >
            <aside
              sx={{
                flexGrow: 1,
                flexBasis: 'sidebar'
              }}
            >
              <Box p={2}>
                <Link to='/'>Home</Link>
                <Link to='/active-users/country-browser'>
                  Active Users (Country/Browser)
                </Link>
                <Link to='/active-users/browser-device'>
                  Active Users (Browser/Device)
                </Link>
              </Box>
            </aside>
            <main
              sx={{
                flexGrow: 99999,
                flexBasis: 0,
                minWidth: 320
              }}
            >
              <Box p={2}>
                <Switch>
                  <Route exact path='/'>
                    <BarChart />
                  </Route>
                  <Route path='/active-users/country-browser'>
                    <BarChart />
                  </Route>
                  <Route path='/active-users/browser-device'>
                    <Sunburst />
                  </Route>
                </Switch>
              </Box>
            </main>
          </div>
        </Router>
      </div>
    </div>
  )
}

export default App
