import type { PropsWithChildren } from 'react'
import { useAuth } from 'react-oidc-context'

export default function AuthLayout({ children }: PropsWithChildren) {
  const { isAuthenticated, isLoading, signinRedirect, user, error } = useAuth()
}
