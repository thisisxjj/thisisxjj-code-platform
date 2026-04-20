import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_playground/courses/$courseTemplateId/lessons/$lessonTemplateId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      Hello "/_playground/courses/$courseTemplateId/lessons/$lessonTemplateId"!
    </div>
  )
}
