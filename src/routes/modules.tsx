import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/modules')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/modules"!</div>
}
