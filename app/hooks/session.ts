import { useMatches } from '@remix-run/react'
import { SessionData } from '~/session.server'

export default function useSession() {
  const matches = useMatches()
  const match = matches.find(m => m.id == 'routes/app')
  if (!match) {
    throw new Error('SESSION_EMPTY')
  }
  return match.data  as SessionData
}
