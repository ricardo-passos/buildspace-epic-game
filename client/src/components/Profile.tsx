import { useState, useEffect, forwardRef } from 'react'
import { Menu, Group, Avatar, Text, UnstyledButton } from '@mantine/core'
import { useWeb3React } from '@web3-react/core'

// hooks
import { useWeb3Error } from '../hooks/useWeb3Error'

// connectors
import { injected } from '../web3/connectors'

type UserProfielProps = {
  wallet: string
}

const UserProfile = forwardRef<HTMLButtonElement, UserProfielProps>(
  ({ wallet, ...props }, ref) => {
    // hooks
    const { active } = useWeb3React()
    return (
      <UnstyledButton
        ref={ref}
        sx={{
          width: active ? '175px' : '215px',
          transition: 'width 100ms ease',
        }}
        {...props}
      >
        <Group
          sx={(theme) => ({
            backgroundColor: theme.colors.dark[5],
            borderRadius: '50px',
            padding: '4px',
            paddingRight: '20px',
            transition: 'background-color 200ms ease',
            '&:hover': {
              backgroundColor: `${theme.colors.dark[5]}80`,
            },
          })}
        >
          <Avatar
            src='https://lh3.googleusercontent.com/H9KtktLnSw6zgJDd8RPMKN85tWFshRWjcYUcQqEdUQK9Ip7_ctZE0L0pDSV1tbvvVq3LvXaqtweep_ew5G7JmxwrYnO-842DY4KSUDx_dj2dp_DX1Kay99T8s1zZZFDcMPAvzZQCwuksBDOmGEls3sbT2S0btZwEYHQLMocnooZKG02Wc4Vlga9AwS-AAeWCPxyXCCqf_kt3E0_jnRkA_k43vD9Z14HHCrkuB0OeYViP8uC-aGXtJQng14aL5t3He9pbYsKta7uWDja71WZlh1fsQuPpaXhuAnhifN7HuK8HzHg-H38W2tz2M9gNhy-Xj-B5ql5B5vsco2_5MTFntLnvqSv2wdnxrTISPQwpTPz1_csGChGitq_A7F5iYJtRffTDhDTqWZTBdzcM1aPyVBqzNA_XVWbl1A2Y4ZnnzB2fW0m8T_L04kdvT3tLn0yfJxcxF-JiThphulapjzCEGWJQ735Lp_cX135fwJm8cpjE9odyBdtKSOnfGmP897YYHE73WLbcWV23HFCnrCytvAIabj1laxSetcZj5WY9x5aV00TbBTeUUWQsr7BrP4rXLV3W_9j2-cT8xRs4ArMED1lYDlvMmBnr1y0rh7bO1At9RQ2_3obfkAKVjDRPiG0XBDsHG1hb9mAqL_Eg8ROJITrKX6T-0ytoQ9BDJb4COpywr03l5oqCqFyMz00RqQRSlI2CjS_0ndgOKOR_WMMLjjDnPaBFSKAbph_Vk7kON7-i57V_twx8P2wOieTj7A=s250-k-rw-no'
            alt='Ricardo Passos'
            radius='xl'
          />

          <Text size='sm' weight={500} color='white'>
            {active ? wallet : 'wallet not connected'}
          </Text>
        </Group>
      </UnstyledButton>
    )
  }
)

function Profile() {
  // states
  const [formattedWallet, setFormattedWallet] = useState('')

  // hooks
  const { handleError } = useWeb3Error()
  const { activate, deactivate, active, account } = useWeb3React()

  async function handleAccountConnection() {
    if (active) {
      setFormattedWallet('')
      deactivate()
      return
    }

    try {
      await activate(injected, undefined, true)
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
    <Menu control={<UserProfile wallet={formattedWallet} />}>
      <Menu.Label>profile</Menu.Label>
      <Menu.Item onClick={handleAccountConnection}>
        {active ? 'disconnect wallet' : 'connect wallet'}
      </Menu.Item>
      <Menu.Item>character</Menu.Item>
    </Menu>
  )
}

export { Profile }
