import { createContext, useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useNavigate } from 'react-router-dom'

// hooks
import { useWeb3Error } from '../hooks/useWeb3Error'

// web3
import { injected } from '../web3/connectors'

// types
import type { ReactNode } from 'react'

type UserProfileContextProps = {
  handleAccountConnection: () => void
  formattedWallet: string
}

const UserProfileContext = createContext<UserProfileContextProps>(
  {} as UserProfileContextProps
)

type Props = {
  children: ReactNode
}

function UserProfileContextProvider({ children }: Props) {
  // states
  const [formattedWallet, setFormattedWallet] = useState('')

  // hooks
  const { handleError } = useWeb3Error()
  const navigate = useNavigate()
  const { activate, deactivate, active, account } = useWeb3React()

  async function handleAccountConnection() {
    if (active) {
      setFormattedWallet('')
      deactivate()
      navigate('/')
      return
    }

    try {
      await activate(injected, undefined, true)

      navigate('/mint')
    } catch (err) {
      const error = err as Error

      handleError(error)
    }
  }

  // formats user wallet
  useEffect(() => {
    if (active) {
      const firstPart = account?.substring(0, 6)
      const lastPart = account?.substring(38)

      setFormattedWallet(`${firstPart} ... ${lastPart}`)
    }
  }, [active, account])

  return (
    <UserProfileContext.Provider
      value={{ handleAccountConnection, formattedWallet }}
    >
      {children}
    </UserProfileContext.Provider>
  )
}

export { UserProfileContext }
export { UserProfileContextProvider }
