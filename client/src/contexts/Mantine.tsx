import {
  MantineProvider as Provider,
  MantineThemeOverride,
} from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'

// types
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const theme: MantineThemeOverride = {
  colorScheme: 'dark',
}

function MantineProvider({ children }: Props) {
  return (
    <Provider theme={theme}>
      <NotificationsProvider>{children}</NotificationsProvider>
    </Provider>
  )
}

export { MantineProvider }
