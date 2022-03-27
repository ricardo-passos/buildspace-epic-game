import { Group, Image } from '@mantine/core'

function Home() {
  return (
    <Group direction='column' position='center'>
      <Image
        src='https://c.tenor.com/IBsJjTBYphEAAAAM/russian-vodka.gif'
        alt='Russing guy finds out'
        withPlaceholder
      />
    </Group>
  )
}

export { Home }
