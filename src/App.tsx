import React, { useEffect } from 'react'
import logo from './logo.svg'
import { Counter } from './features/counter/Counter'
import BarChart from './components/BarChart'
import './App.css'
import { initGoogleAuth, fetchRealtimeData } from './utils/google'

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
      <header className='App-header'>
        <div style={{ width: '100%', height: 400 }}>
          <BarChart />
        </div>
      </header>
    </div>
  )
}

export default App
