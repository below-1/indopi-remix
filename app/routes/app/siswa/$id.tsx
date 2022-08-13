import { json, LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import PageHeader from '~/components/PageHeader'
import { getSql } from "~/db.server";
import { SerializedSiswa } from "~/model/siswa";
import { getByID } from "~/serv/siswa";
import { Icon } from '@iconify/react';
import trashIcon from '@iconify/icons-heroicons-outline/trash';
import SiswaContext from "~/context/SiswaContext";

type LoaderData = {
  siswa: SerializedSiswa
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const id = params.id
  if (!id) {
    throw new Error('id_not_provided')
  }
  const sql = getSql()
  const siswa = await getByID(sql, id)
  return json({
    siswa
  })
}

export default function SiswaDetailPage() {
  const loaderData = useLoaderData<LoaderData>()
  const siswa = loaderData.siswa
  const { id } = siswa
  const menus = [
    {
      label: 'edit data',
      path: `/app/siswa/${id}/edit`
    },
    {
      label: 'daftar nilai',
      path: `/app/siswa/${id}/nilai`
    }
  ]
  const siswaGetter = () => siswa;
  return (
    <>
      <PageHeader
        title={`Detail Siswa ${siswa.nama}`}
        subtitle={`Menampilkan data siswa ${siswa.nisn}`}
      ></PageHeader>
      <div className="px-12 py-6 flex flex-col gap-6 text-gray-700">
        <div className="bg-white">
          <div className="flex items-center p-4 gap-4 border-b">
            
            <img 
              src={siswa.avatar}
              className="w-32 h-32 rounded border-4 border-indigo-600"
            />
            <div className="flex flex-col justify-center flex-grow">
              <h1 className="text-4xl font-bold">{siswa.nama}</h1>
              <h1 className="text-xl font-bold">{siswa.nisn}, {siswa.id}</h1>
            </div>
            <Link 
              to={`/app/siswa/${siswa.id}/remove-confirm`}
              className="p-2 rounded transition-all hover:bg-pink-500 focus:bg-pink-500 focus:text-white hover:text-white"
            >
              <Icon icon={trashIcon} className="h-12 w-12" />
            </Link>
          </div>
          <div className="flex gap-4 px-4 pb-2">
            {menus.map(menu => {
              return (
                <Link 
                  key={menu.path}
                  to={menu.path}
                  className="px-6 py-3 border-b-2 border-gray-200 transition-all hover:border-indigo-600 focus:border-indigo-600"
                >
                  {menu.label}
                </Link>
              )
            })}
          </div>
        </div>
        <SiswaContext.Provider value={siswaGetter}>
          <Outlet></Outlet>
        </SiswaContext.Provider>
      </div>
    </>
  )
}