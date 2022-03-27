import { useContext } from 'react'

// contexts
import { UserProfileContext } from '../contexts/UserProfile'

function useUserProfileContext() {
  return useContext(UserProfileContext)
}

export { useUserProfileContext }
