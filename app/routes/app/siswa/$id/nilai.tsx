import { useEffect, useState } from 'react'
import { z } from 'zod'
import {  int_string, float_string } from '~/model/common'
import { json, LoaderFunction } from '@remix-run/node'
import { Link, useLoaderData, useLocation, useNavigate } from '@remix-run/react'
import Select from '~/components/form/Select'
import { useCurrentSiswa } from '~/context/SiswaContext'
import { getSql } from '~/db.server'
import { extract_int, extract_str } from '~/extract'

const nilai_schema = z.object({
  tahun_ajaran: int_string,
  semester: int_string,
  id_siswa: z.string(),
  matematika: float_string,
  ipa: float_string,
  ips: float_string,
  bing: float_string,
  bindo: float_string,
  penjaskes: float_string,
  prakarya: float_string,
  agama: float_string,
  pancasila: float_string
})

type Nilai = z.infer<typeof nilai_schema>

type LoaderData = {
  found: boolean;
  tahun: number;
  semester: number;
  nilai?: Nilai;
}

function NilaiPane({ nilai }: { nilai: Nilai }) {
  return (
    <div className="flex flex-col md:w-1/2 p-4 rounded bg-white">
      <div className="flex items-center justify-between text-lg lowercase font-bold py-3 border-b">
        <div>matematika</div>
        <div>{nilai.matematika.toFixed(2)}</div>
      </div>
      <div className="flex items-center justify-between text-lg lowercase font-bold py-3 border-b">
        <div>ipa</div>
        <div>{nilai.ipa.toFixed(2)}</div>
      </div>
      <div className="flex items-center justify-between text-lg lowercase font-bold py-3 border-b">
        <div>ips</div>
        <div>{nilai.ips.toFixed(2)}</div>
      </div>
      <div className="flex items-center justify-between text-lg lowercase font-bold py-3 border-b">
        <div>bahasa inggris</div>
        <div>{nilai.bing.toFixed(2)}</div>
      </div>
      <div className="flex items-center justify-between text-lg lowercase font-bold py-3 border-b">
        <div>bahasa indonesia</div>
        <div>{nilai.bindo.toFixed(2)}</div>
      </div>
      <div className="flex items-center justify-between text-lg lowercase font-bold py-3 border-b">
        <div>penjaskes</div>
        <div>{nilai.penjaskes.toFixed(2)}</div>
      </div>
      <div className="flex items-center justify-between text-lg lowercase font-bold py-3 border-b">
        <div>prakarya</div>
        <div>{nilai.prakarya.toFixed(2)}</div>
      </div>
      <div className="flex items-center justify-between text-lg lowercase font-bold py-3 border-b">
        <div>agama</div>
        <div>{nilai.agama.toFixed(2)}</div>
      </div>
      <div className="flex items-center justify-between text-lg lowercase font-bold py-3 border-b">
        <div>pancasila</div>
        <div>{nilai.pancasila.toFixed(2)}</div>
      </div>
    </div>
  )
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const id = params.id
  if (!id) {
    throw new Error('id_undefined')
  }
  const url = new URL(request.url)
  const q = url.searchParams
  const defaultYear = (new Date()).getFullYear()
  const tahun = extract_int(q, 'tahun', defaultYear)
  const semester = extract_int(q, 'semester', 1)
  const sql = getSql()
  const rows = await sql`
    select * from nilai where 
      id_siswa = ${id}
      and tahun_ajaran = ${tahun}
      and semester = ${semester}
      limit 1`
  if (!rows.length) {
    return json({
      found: false,
      tahun,
      semester
    })
  }
  const [ row ] = rows;
  const nilaiSemester = await nilai_schema.parseAsync(row)
  return json({
    found: true,
    semester,
    tahun,
    nilai: nilaiSemester
  })
}

export default function SiswaNilaiPage() {
  const loaderData = useLoaderData<LoaderData>()
  const {
    nilai
  } = loaderData

  const [ tahun, setTahun ] = useState(loaderData.tahun)
  const [ semester, setSemester ] = useState(loaderData.semester)
  
  const siswa = useCurrentSiswa()
  const tahunOptions = [
    {label: 'Tahun 2020', value: '2020'},
    {label: 'Tahun 2021', value: '2021'},
    {label: 'Tahun 2022', value: '2022'}
  ]
  const semesterOptions = [
    {label: 'Semester I', value: '1'},
    {label: 'Semester II', value: '2'},
  ]
  const location = useLocation()
  const navigate = useNavigate()

  function reload() {
    const path = location.pathname
    const q = new URLSearchParams({
      tahun,
      semester,
    } as any)
    navigate(path + '?' + q.toString())
  }

  useEffect(reload, [tahun, semester])

  return (
    <>
      <div className="p-4 bg-white flex items-center gap-4">
        <Select
          options={tahunOptions}
          defaultValue={tahun}
          placeholder="Tahun Ajaran"
          name="tahun_ajaran"
          onChange={event => {
            const v = parseInt(event.target.value)
            setTahun(v)
          }}
        />
        <Select
          options={semesterOptions}
          defaultValue={semester}
          placeholder="Semester"
          name="semester"
          onChange={event => {
            const v = parseInt(event.target.value)
            setSemester(v)
          }}
        />
        <div className="flex-grow"></div>
        <Link 
          to={`/app/siswa/${siswa.id}/add-nilai`}
          className="px-4 py-2 rounded bg-indigo-600 text-white"
        >
          tambah nilai
        </Link>
      </div>

      {
        nilai
        ? (
          <NilaiPane
            nilai={nilai}
          />
        ) : (
          <div>
            Belum ada nilai
          </div>
        )
      }
    </>
  )
}