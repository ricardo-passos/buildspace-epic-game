import { InjectedConnector } from '@web3-react/injected-connector'

// web3
import { config } from './config'

const injected = new InjectedConnector({
  supportedChainIds: config.supportedChains,
})

export { injected }
