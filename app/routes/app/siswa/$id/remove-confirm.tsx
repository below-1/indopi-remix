import { Form, useResolvedPath } from '@remix-run/react'
import { useContext } from "react";
import SiswaContext from "~/context/SiswaContext";

export default function RemoveConfirmPage() {
  const siswaGetter = useContext(SiswaContext)
  const siswa = siswaGetter()

  return (
    <div className="w-full bg-white p-12 border text-center">
      <h1 className="font-bold text-xl">Hapus data siswa {siswa.nama}?</h1>
      <h2 className="text-sm font-bold">Data Nilai juga akan ikut terhapus</h2>
      <Form
        method="post"
        action={useResolvedPath('remove').pathname}
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