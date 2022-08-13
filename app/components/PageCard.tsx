import { ReactNode } from "react"

export type PageCardProps = {
  children: ReactNode
}

export default function PageCard({ children } : PageCardProps) {
  return (
    <div className="py-6 px-12 flex flex-col gap-6">
      {children}
    </div>
  )
}