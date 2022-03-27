import { Group, Image, Button } from '@mantine/core'

// hooks
import { useUserProfileContext } from '../hooks/useUserProfileContext'

function Home() {
  // hooks
  const { handleAccountConnection } = useUserProfileContext()
  
  return (
    <Group direction='column' position='center'>
      <Image
        src='https://c.tenor.com/IBsJjTBYphEAAAAM/russian-vodka.gif'
        alt='Russing guy finds out'
        withPlaceholder
      />

      <Button onClick={handleAccountConnection} variant='gradient'>
        connect your wallet
      </Button>
    </Group>
  )
}

export { Home }
