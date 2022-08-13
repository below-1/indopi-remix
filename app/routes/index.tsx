import { Outlet, Link } from '@remix-run/react'

export default function LandingPage() {
  return (
    <div 
      id="LandingPage"
      className="h-screen w-screen bg-yellow-50 text-gray-600 flex flex-col"
    >
      <div 
        className="w-full h-6 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
      >
      </div>
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold">Applikasi PIP</h1>
        <h2 className="text-2xl font-mono">Menggunakan Metode K-Means</h2>
        <Link to="/auth/login" className="px-4 py-2 rounded bg-blue-600 text-white font-bold my-2 shadow-lg">
          get started
        </Link>
      </div>
      <div 
        className="w-full h-16 bg-gradient-to-r from-pink-100 via-red-200 to-yellow-100 flex items-center justify-center"
      >
        <h3 className="text-xl font-bold text-gray-500">Created By Ratna</h3>
      </div>
    </div>
  )
}
