import { createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router'
import VaultLayout from './layouts/vault-layout/vault-layout'
import PageVaultFeature from './pages/vault/feature/page-vault-feature'

const rootRoute = createRootRoute({
  component: Outlet,
})

const vaultLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'vault-layout',
  component: VaultLayout,
})

const vaultRoute = createRoute({
  getParentRoute: () => vaultLayoutRoute,
  path: '/',
  component: PageVaultFeature,
})

const routeTree = rootRoute.addChildren([
  vaultLayoutRoute.addChildren([vaultRoute]),
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
