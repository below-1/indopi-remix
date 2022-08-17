import { ActionFunction, json, redirect } from '@remix-run/node';
import { Form, useActionData, useResolvedPath } from '@remix-run/react'
import { useContext } from "react";
import SiswaContext from "~/context/SiswaContext";
import { getSql } from '~/db.server';

type ActionData = {
  message: string
}

export const action: ActionFunction = async ({ request, params }) => {
  const id = params.id as string
  const sql = getSql()
  try {
    await sql`
      delete from siswa where id = ${id}`
    return redirect('/app/siswa')
  } catch (err) {
    console.log(err);
    const error = err as any
    return json({
      message: error.message ? error.message : 'terjadi kesalahan'
    })
  }
}

export default function RemoveConfirmPage() {
  const actionData = useActionData<ActionData>()
  const siswaGetter = useContext(SiswaContext)
  const siswa = siswaGetter()

  if (actionData?.message) {
    return (
      <div className="w-full bg-white p-12 border text-center">
        <h1 className="text-red-500 text-xl font-bold">{actionData.message}</h1>
        <button 
          className="bg-indigo-600 text-white px-4 py-2 rounded font-bold"
          type="button"
          onClick={() => {
            history.back()
          }}
        >
          kembali
        </button>
      </div>
    )
  }

  return (
    <div className="w-full bg-white p-12 border text-center">
      <h1 className="font-bold text-xl">Hapus data siswa {siswa.nama}?</h1>
      <h2 className="text-sm font-bold">Data Nilai juga akan ikut terhapus</h2>
      <Form
        method="post"
        encType="multipart/form-data"
      >
        <input type="hidden" defaultValue={siswa.id} />
        <div className="flex items-center justify-center my-4 gap-4">
          <button 
            type="submit"
            className="bg-pink-600 text-white px-4 py-2 rounded font-bold"
          >
            lanjutkan
          </button>
          <button 
            type="button"
            className="bg-gray-50 px-4 py-2 rounded border font-bold"
            onClick={() => {
              history.back()
            }}
          >
            batalkan
          </button>
        </div>
      </Form>
    </div>
    
  )
}