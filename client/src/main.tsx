import React from 'react'
import ReactDOM from 'react-dom'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { BrowserRouter } from 'react-router-dom'

// components
import { App } from './App'

// contexts
import { MantineProvider } from './contexts/Mantine'
import { UserProfileContextProvider } from './contexts/UserProfile'

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <UserProfileContextProvider>
            <App />
          </UserProfileContextProvider>
        </Web3ReactProvider>
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
