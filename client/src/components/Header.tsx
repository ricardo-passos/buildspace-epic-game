import { Box } from '@mantine/core'
import { useWeb3React } from '@web3-react/core'

// components
import { Profile } from './Profile'

function Header() {
  // hooks
  const { active, chainId } = useWeb3React()

  return (
    <Box component='header' p={20}>
      <Profile />
    </Box>
  )
}

export { Header }
