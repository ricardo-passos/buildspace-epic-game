import { useState, useEffect } from 'react'
import {
  Card,
  Title,
  Image,
  Progress,
  Button,
  Group,
  Text,
} from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { Check } from 'tabler-icons-react'

// hooks
import { useContract } from '../hooks/useContract'

// types
import type { Dispatch, SetStateAction } from 'react'
import type { Listener } from '@ethersproject/providers'

type BigBoss = {
  name: string
  imageURI: string
  hp: number
  maxHp: number
  attackDamage: number
}

type Props = {
  character: {
    name: string
    imageURI: string
    hp: number
    maxHp: number
    attackDamage: number
  } | null
  setCharacter: Dispatch<
    SetStateAction<{
      name: string
      imageURI: string
      hp: number
      maxHp: number
      attackDamage: number
      timesMinted: number
    } | null>
  >
}

function Arena({ character, setCharacter }: Props) {
  // states
  const [bigBoss, setBigBoss] = useState<BigBoss | null>(null)
  const [attackState, setAttackState] = useState<'attacking' | 'hit' | ''>('')

  // hooks
  const notifications = useNotifications()
  const { contract } = useContract({ name: 'EpicGame', withSigner: true })

  async function handleAttack() {
    try {
      const id = notifications.showNotification({
        title: 'attacking',
        message: 'wait for the attack to finish',
        autoClose: false,
        loading: true,
      })

      setAttackState('attacking')
      await (await contract?.attackBoss())?.wait()

      setAttackState('hit')
      notifications.hideNotification(id)
      notifications.showNotification({
        title: 'attack was successful',
        message: `${bigBoss?.name} was hit for ${character?.attackDamage}`,
        icon: <Check />,
        color: 'green',
        autoClose: 5000,
      })
    } catch (err) {
      console.error('Error attacking boss:', err)
      setAttackState('')
    }
  }

  // listens for completed attacks
  useEffect(() => {
    if (contract) {
      const listener: Listener = async (
        newBossHp: string,
        newPlayerHp: string
      ) => {
        setBigBoss((prevState) => ({ ...prevState!, hp: Number(newBossHp) }))

        setCharacter((prevState) => ({
          ...prevState!,
          hp: Number(newPlayerHp),
        }))
      }

      contract.on('AttackComplete', listener)

      return () => {
        contract.off('AttackComplete', listener)
      }
    }
  }, [contract])

  // fetches bigBoss metadata
  useEffect(() => {
    if (contract) {
      contract.functions
        .bigBoss()
        .then(({ name, imageURI, hp, maxHp, attackDamage }) =>
          setBigBoss({
            name,
            imageURI,
            hp: parseInt(hp._hex),
            maxHp: parseInt(maxHp._hex),
            attackDamage: parseInt(attackDamage._hex),
          })
        )
        .catch(console.log)
    }
  }, [contract])

  return (
    <Group position='center'>
      {bigBoss && (
        <Group direction='column' position='center'>
          <Card
            sx={(theme) => ({
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '300px',
            })}
          >
            <Title
              align='center'
              sx={(theme) => ({ color: theme.colors.dark[0] })}
            >
              {bigBoss.name || ''}
            </Title>

            <Image
              src={bigBoss.imageURI || ''}
              alt={bigBoss.name || ''}
              width={150}
              height={150}
            />
            <Progress
              mt={10}
              size={30}
              color='red'
              value={100}
              label={`${bigBoss.hp} / ${bigBoss.maxHp} hp`}
              sx={{ width: '100%' }}
            />
          </Card>

          <Button variant='gradient' onClick={handleAttack}>
            💥 Attack {bigBoss?.name}
          </Button>
        </Group>
      )}

      {character && (
        <Group direction='column' position='center'>
          <Card
            sx={(theme) => ({
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '300px',
            })}
          >
            <Title
              align='center'
              sx={(theme) => ({ color: theme.colors.dark[0] })}
            >
              {character.name || ''}
            </Title>

            <Image
              src={character.imageURI || ''}
              alt={character.name || ''}
              width={150}
              height={150}
            />
            <Progress
              mt={10}
              size={30}
              color='red'
              value={100}
              label={`${character.hp} / ${character.maxHp} hp`}
              sx={{ width: '100%' }}
            />
          </Card>

          <Text sx={(theme) => ({ color: theme.colors.dark[0] })}>
            {attackState === 'attacking'
              ? 'attacking ⚔️'
              : `⚔️ attack damage ${character.attackDamage}`}
          </Text>
        </Group>
      )}
    </Group>
  )
}

export { Arena }
