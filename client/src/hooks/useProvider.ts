import { useState, useEffect } from 'react'
import { providers } from 'ethers'
import { useWeb3React } from '@web3-react/core'

// web3
import { config } from '../web3/config'

// types
import type { Signer } from 'ethers'

function useProvider() {
  // states
  const [provider, setProvider] = useState(
    new providers.JsonRpcProvider(config.url)
  )
  const [signer, setSigner] = useState<Signer>()

  // hooks
  const { active, account, library } = useWeb3React()

  useEffect(() => {
    if (library) {
      const provider = new providers.Web3Provider(library?.provider)

      setProvider(provider)
    }
  }, [account, library])

  useEffect(() => {
    if (active && account && library) {
      const provider = new providers.Web3Provider(library.provider)
      const signer = provider.getSigner()

      setSigner(signer)
    }
  }, [active, account, library])

  return { provider, signer }
}

export { useProvider }
