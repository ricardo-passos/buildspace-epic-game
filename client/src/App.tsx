import { useState, useEffect } from 'react'
import { Box, Group, Title } from '@mantine/core'
import { useWeb3React } from '@web3-react/core'
import { Routes, Route, Link } from 'react-router-dom'

// components
import { Header } from './components/Header'
import { Home } from './pages/Home'
import { SelectCharacter } from './pages/SelecteCharacter'
import { Arena } from './pages/Arena'

// hooks
import { useContract } from './hooks/useContract'

type CharacterAttributes = {
  name: string
  imageURI: string
  hp: number
  maxHp: number
  attackDamage: number
  timesMinted: number
} | null

function App() {
  // state
  const [character, setCharacter] = useState<CharacterAttributes>(null)

  // hooks
  const { active } = useWeb3React()
  const { contract } = useContract({ name: 'EpicGame' })

  // checks if user has an NFT
  useEffect(() => {
    if (active && contract) {
      contract.functions
        .checkIfUserHasNFT()
        .then(
          ([{ name, imageURI, hp, maxHp, attackDamage, timesMinted }]) =>
            // our smart contract returns an empty struct if the user doesn't have an NFT;
            // without the check below, the UI would "think" the user has a character and
            // thus would not show the SelectCharacter component
            name &&
            setCharacter({
              name,
              imageURI,
              hp: parseInt(hp._hex),
              maxHp: parseInt(maxHp._hex),
              attackDamage: parseInt(attackDamage._hex),
              timesMinted: parseInt(timesMinted._hex),
            })
        )
        .catch((err) => console.log({ err }))
    }
  }, [active, contract])

  return (
    <Box
      component='main'
      sx={(theme) => ({
        backgroundColor: theme.colors.dark[9],
        height: '100vh',
        width: '100%',
      })}
    >
      <Header />

      <Group position='center' direction='column'>
        <Title
          sx={(theme) => ({
            color: theme.colors.dark[0],
            marginBottom: '20px',
          })}
        >
          ⚔️ Innvo Slayer ⚔️
        </Title>

        <Routes>
          <Route path='/' element={<Home />} />
          <Route
            path='/mint'
            element={<SelectCharacter setCharacter={setCharacter} />}
          />
          <Route
            path='/fight'
            element={
              <Arena character={character} setCharacter={setCharacter} />
            }
          />
        </Routes>

        {/* {!active ? (
          <Home />
        ) : active && !character ? (
          <SelectCharacter setCharacter={setCharacter} />
        ) : (
          <Arena character={character} setCharacter={setCharacter} />
        )} */}
      </Group>
    </Box>
  )
}

export { App }
