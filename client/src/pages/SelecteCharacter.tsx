import { useState, useEffect } from 'react'
import { useNotifications } from '@mantine/notifications'
import { Group, Button, Title, Text, Image, Card, Badge } from '@mantine/core'
import { Check } from 'tabler-icons-react'

// hooks
import { useContract } from '../hooks/useContract'
import { useWeb3Error } from '../hooks/useWeb3Error'

// utils
import { formatCharacterAttributes } from '../utils/formatCharacterAttributes'

// types
import type { Dispatch, SetStateAction } from 'react'
import type { Listener } from '@ethersproject/providers'

type CharacterAttributes = {
  name: string
  imageURI: string
  hp: number
  maxHp: number
  attackDamage: number
  timesMinted: number
}

type Props = {
  setCharacter: Dispatch<SetStateAction<CharacterAttributes | null>>
}

function SelectCharacter({ setCharacter }: Props) {
  // states
  const [characters, setCharacters] = useState<CharacterAttributes[]>([])

  // hooks
  const { handleError } = useWeb3Error()
  const notifications = useNotifications()
  const { contract } = useContract({ name: 'EpicGame', withSigner: true })

  async function mintCharacterNFT(characterId: number) {
    try {
      const id = notifications.showNotification({
        title: 'minting NFT',
        message: 'please wait for the confirmation',
        loading: true,
        autoClose: false,
      })

      await (
        await contract?.functions.mintCharacterNFT(characterId)
      )?.wait()

      notifications.hideNotification(id)
      notifications.showNotification({
        title: 'NFT minted successfuly',
        message: '',
        icon: <Check />,
        color: 'green',
      })
    } catch (err) {
      const error = err as Error

      handleError(error)
    }
  }

  // listens for character mint
  useEffect(() => {
    if (contract) {
      const listener: Listener = async (
        sender: string,
        tokenId: number,
        characterIndex: number
      ) => {
        console.log(
          `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId} characterIndex: ${characterIndex}`
        )

        contract.functions
          .checkIfUserHasNFT()
          .then(([{ name, imageURI, hp, maxHp, attackDamage, timesMinted }]) =>
            setCharacter({
              name,
              imageURI,
              hp: parseInt(hp._hex),
              maxHp: parseInt(maxHp._hex),
              attackDamage: parseInt(attackDamage._hex),
              timesMinted: parseInt(timesMinted._hex),
            })
          )
          .catch()
      }

      contract.on('CharacterNFTMinted', listener)

      return () => {
        contract.off('CharacterNFTMinted', listener)
      }
    }
  }, [contract])

  // fetch all characters
  useEffect(() => {
    if (contract) {
      contract.functions
        .getAllDefaultCharacters()
        .then(([characters]) =>
          setCharacters(formatCharacterAttributes(characters))
        )
        .catch((err) => console.log({ err }))
    }
  }, [contract])

  return (
    <Group position='center' direction='column'>
      <Title order={3} sx={(theme) => ({ color: theme.colors.dark[0] })}>
        Mint your Hero. Choose wisely.
      </Title>

      <Group>
        {characters.map(({ name, imageURI, timesMinted }, index) => (
          <Card key={name} shadow='sm'>
            <Card.Section>
              <Image src={imageURI} alt={name} />
            </Card.Section>

            <Group>
              <Text>{name}</Text>

              <Badge>{timesMinted}</Badge>
            </Group>

            <Button variant='gradient' onClick={() => mintCharacterNFT(index)}>
              Mint {name}
            </Button>
          </Card>
        ))}
      </Group>
    </Group>
  )
}

export { SelectCharacter }
