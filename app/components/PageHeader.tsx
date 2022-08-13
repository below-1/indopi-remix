import { memo, ReactNode } from 'react'
import useSession from "~/hooks/session"

type PageHeaderProps = {
  title: string;
  subtitle: string;
  children?: ReactNode
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, children }) => {
  const session = useSession()
  console.log('PageHeader')
  return (
    <nav className="h-16 w-full flex items-center text-gray-600 md:px-12 bg-white">

      <div className="flex flex-col items-start">
        <h1 className="text-lg font-bold leading-none">{title}</h1>
        <h2 className="text-sm font-light leading-none">{subtitle}</h2>
      </div>

      <div className="flex-grow"></div>
      
      {children}

      <div className="flex flex-col justify-center items-start">
        <div className="leading-none font-bold">{session.user.username}</div>
        <div className="leading-none text-sm font-light">{session.user.role === 'superuser' ? 'admin sistem' : 'siswa'}</div>
      </div>

    </nav>
  )
}

export default memo(PageHeader);