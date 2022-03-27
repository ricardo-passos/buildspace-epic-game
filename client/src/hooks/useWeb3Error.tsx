import { X } from 'tabler-icons-react'
import { Button, Text } from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { UnsupportedChainIdError } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError,
} from '@web3-react/injected-connector'

// utils
import { currentEnv } from '../utils/currentEnv'

// types
import { ReactNode } from 'react'

function useWeb3Error() {
  // hooks
  const notifications = useNotifications()

  const handleError = (
    error: Error & { data?: { code: number; message: string } }
  ) => {
    const NotificationFactory = ({
      title,
      message,
    }: {
      title: string
      message: ReactNode
    }) => {
      return notifications.showNotification({
        title,
        message,
        color: 'red',
        autoClose: false,
        icon: <X />,
      })
    }

    notifications.clean()

    if (currentEnv === 'development') console.log({ error })

    if (error instanceof UnsupportedChainIdError) {
      NotificationFactory({
        title: "you're trying to connect to an unsupported chain ID.",
        message: (
          <>
            <Text>
              make sure you're trying to connect to Rinkeby, chain ID 4.{' '}
              <Button compact>click here to change</Button>
            </Text>
          </>
        ),
      })
    } else if (error instanceof NoEthereumProviderError) {
      NotificationFactory({
        title: 'no ethereum provider detected.',
        message:
          'make sure you have an ethereum provider (e.g MetaMask) enabled for your browser session.',
      })
    } else if (error instanceof UserRejectedRequestError) {
      NotificationFactory({
        title: 'user aborted request',
        message: 'you need to confirm the request to continue.',
      })
    } else if (
      error.data?.message.includes(
        'Error: character must have HP to attack boss'
      )
    ) {
      NotificationFactory({
        title: 'your character is dead',
        message: 'good luck next time.',
      })
    } else if (
      error.message.includes(
        'Nonce too high.'
      )
    ) {
      NotificationFactory({
        title: 'nonce too high',
        message:
          "your MetaMask isn't in sync with the blockchain. try to reset your MetaMask: settings -> advanced -> reset account",
      })
    } else {
      NotificationFactory({
        title: 'there was an unexpected error',
        message: "we're working to fix it asap.",
      })
    }
  }

  return { handleError }
}

export { useWeb3Error }
