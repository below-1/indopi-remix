import { type LoaderFunction, json } from '@remix-run/node'
import { Link, Outlet, useLoaderData, useMatches } from '@remix-run/react'

import { Icon, addIcon } from '@iconify/react/dist/offline';
import Icon_chartBar from '@iconify/icons-heroicons-outline/chart-bar'
import Icon_userGroup from '@iconify/icons-heroicons-outline/user-group'
import Icon_calculator from '@iconify/icons-heroicons-outline/calculator'
import Icon_adjustments from '@iconify/icons-heroicons-outline/adjustments'
import Icon_lockClosed from '@iconify/icons-heroicons-outline/lock-closed'
import Icon_logout from '@iconify/icons-heroicons-outline/logout'

addIcon('dashboard', Icon_chartBar)
addIcon('siswa', Icon_userGroup)
addIcon('nilai', Icon_calculator)
addIcon('k-means', Icon_adjustments)
addIcon('akun', Icon_lockClosed)
addIcon('logout', Icon_logout)

import { requireAuthToken, getSessionData, SessionData } from '~/session.server'

type LoaderData = SessionData;

export type SidebarProps = {
  session: SessionData;
}

export const loader: LoaderFunction = async ({ request }) => {
  const token = await requireAuthToken(request)
  const sess_data = await getSessionData(token)
  console.log(sess_data)
  console.log('sess_data')
  return json(sess_data)
}

function useMenus(session: SessionData) {
  return session.user.role == 'superuser'
    ? [
      { label: 'dashboard', path: '/app/dashboard', icon: 'dashboard' },
      { label: 'siswa', path: '/app/siswa', icon: 'siswa' },
      { label: 'nilai', path: '/app/nilai', icon: 'nilai' },
      { label: 'k-means', path: '/app/rank', icon: 'k-means' },
      { label: 'akun', path: '/app/akun', icon: 'akun' }
    ] : [
      { label: 'me', path: '/app/me', icon: 'nilai' },
      { label: 'k-means', path: '/app/rank', icon: 'k-means' },
      { label: 'akun', path: '/app/akun', icon: 'akun' }
    ]
}

function Sidebar({ session }: SidebarProps) {
  const { user } = session
  const menus = useMenus(session)
  return (
    <nav 
      id="Sidebar"
      className="fixed w-64 top-0 bottom-0 left-0 bg-purple-800 flex flex-col text-white"
    >
      <div className="h-16 px-4 bg-purple-900 flex items-center justify-start">
        <h1 className="text-lg font-black tracking-wide">pip / indonesia pintar</h1>
      </div>
      <div className="flex flex-col gap-6 mt-6 flex-grow">
        {menus.map(menu => (
          <Link 
            to={menu.path}
            key={menu.path}
            className="flex items-center gap-6 px-4"
          >
            <Icon icon={menu.icon} className="text-white h-6 w-6" />
            <span className="tracking-wider font-bold text-white flex-groww">{menu.label}</span>
          </Link>
        ))}
      </div>
      <div className="text-sm py-3 text-center bg-purple-900 text-gray-300">
        <div>Copyright By Ratna</div>
      </div>
    </nav>
  )
}

export default function App() {
  const loaderData = useLoaderData<LoaderData>()
  return (
    <div 
      id="App"
      className="pl-64"
    >
      <Sidebar 
        session={loaderData} 
      />
      <div className="bg-gray-100 min-h-screen">
        <Outlet></Outlet>
      </div>
    </div>
  )
}