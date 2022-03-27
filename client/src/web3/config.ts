// web3
import EpicGameABI from './ABIs/EpicGame.json'
import { EpicGame__factory } from './typechain'

// utils
import { currentEnv } from '../utils/currentEnv'

// types
import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'

const commonConfig = {
  abi: {
    EpicGame: EpicGameABI,
  },
  contract: {
    EpicGame: (signerOrProvider: Signer | Provider) =>
      EpicGame__factory.connect(
        import.meta.env.VITE_SMART_CONTRACT_ADDRESS,
        signerOrProvider
      ),
  },
}

const devConfig = {
  supportedChains: [4, 31337],
  url: 'http://localhost:8545',
  ...commonConfig,
}
const prodConfig = {
  supportedChains: [4],
  url: '',
  ...commonConfig,
}

const config = currentEnv === 'development' ? devConfig : prodConfig

export { config }
