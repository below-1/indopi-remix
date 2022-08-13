import { Outlet } from '@remix-run/react'

export default function AuthPage() {
  return (
    <div 
      id="LandingPage"
      className="h-screen w-screen text-gray-600 flex flex-col"
    >
      <nav
        className="w-full h-12 bg-black"
      >
      </nav>
      <div 
        className="w-full h-1 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
      >
      </div>
      <div className="flex-grow flex flex-col items-center justify-center">
        <Outlet></Outlet>
      </div>
      <div 
        className="w-full h-16 bg-gradient-to-r from-pink-100 via-red-200 to-yellow-100 flex items-center justify-center"
      >
        <h3 className="text-xl font-bold">Created By Ratna</h3>
      </div>
    </div>
  )
}
