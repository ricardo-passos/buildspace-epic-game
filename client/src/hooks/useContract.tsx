import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'

// hooks
import { useProvider } from './useProvider'

// web3
import { config } from '../web3/config'

// types
import { EpicGame } from '../web3/typechain'

type Props = {
  name: 'EpicGame'
  withSigner?: boolean
}

function useContract({ name, withSigner }: Props) {
  // states
  const [contract, setContract] = useState<EpicGame>()

  // hooks
  const { provider, signer } = useProvider()
  const { active, account } = useWeb3React()

  // read state only
  useEffect(() => {
    if (!withSigner) {
      const contract = config.contract[name](provider)

      setContract(contract)
    }
  }, [withSigner, account])

  // read and change state
  useEffect(() => {
    if (active && withSigner && signer) {
      const contract = config.contract[name](signer!)

      setContract(contract)

      return
    }
  }, [active, withSigner, signer, account])

  return { contract }
}

export { useContract }
