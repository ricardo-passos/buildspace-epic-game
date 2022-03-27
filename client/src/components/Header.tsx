import { Box } from '@mantine/core'

// components
import { Profile } from './Profile'

function Header() {
  return (
    <Box component='header' p={20}>
      <Profile />
    </Box>
  )
}

export { Header }
