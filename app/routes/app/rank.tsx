import { useState, useEffect, useCallback, useMemo } from 'react'
import { LoaderFunction, json } from '@remix-run/node'
import { Link, useFetcher, useLoaderData, useLocation } from '@remix-run/react'
import { Icon } from '@iconify/react'
import IC_viewGrid from '@iconify/icons-heroicons-outline/view-grid'

import Select from '~/components/form/Select'
import PageHeader from '~/components/PageHeader'
import { extract_str, extract_int } from '~/extract'
import { getSql } from '~/db.server'
import type { JenisKelamin } from '~/model/siswa'
import { debounce, LoadMode } from '~/core'

type Item = {
  id: string;
  nama: string;
  avatar: string;
  nisn: string;
  jenis_kelamin: JenisKelamin;
  tanggal_lahir: string;
}

type LoaderData = {
  items: Array<Item>;
  keyword?: string;
  kelas?: number;
}

type ListItemProps = Item;
function ListItem({ avatar, nama, nisn, jenis_kelamin, id }: ListItemProps) {
  const val = Math.random() * 5;
  return (
    <li className="flex items-center gap-6 py-3 px-3 border-b border-gray-100 text-gray-600">
      <img 
        src={avatar}
        className="w-16 h-16 border-4 border-purple-500 rounded-lg overflow-hidden"
      />
      <div className='flex-grow'>
        <p className="text-xl font-bold">{nama}</p>
        <p className="text-lg font-light lowercase">NISN: {nisn}, {jenis_kelamin}</p>
      </div>
      <Link
        to={`/app/siswa/${id}`}
        className="px-2 py-2 rounded transition-all hover:bg-green-600 focus:bg-green-600 hover:text-white focus:text-white text-lg font-bold"
      >
        {val.toFixed(2)}
      </Link>
    </li>
  )
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const _keyword = extract_str(url.searchParams, 'keyword', '')
  const keyword = '%' + _keyword + '%'
  const cursor = extract_str(url.searchParams, 'cursor')
  const limit = extract_int(url.searchParams, 'limit', 10)
  const kelas = extract_int(url.searchParams, 'kelas')
  const sql = getSql()
  const rows = await sql`
    select 
      id, nama, nisn, avatar, jenis_kelamin, tanggal_lahir
      from siswa
      where 
        (nama ilike ${keyword} or nisn ilike ${keyword})
        ${cursor ? sql`and nisn > ${cursor}` : sql``}
        ${kelas ? sql`and kelas = ${kelas}` : sql``}
      order by nisn
      limit ${limit}`
  const getAvatarUrl = (id: string) => `https://avatars.dicebear.com/api/human/${id}.svg`
  const items = rows.map(row => {
    const avatar = row.avatar ? row.avatar : getAvatarUrl(row.id)
    return {
      ...row,
      avatar
    }
  })
  return json({
    items,
    keyword: _keyword,
    kelas
  })
}

export default function RankPage() {
  const loaderData = useLoaderData<LoaderData>()
  const fetcher = useFetcher()

  const [ keyword, setKeyword ] = useState(loaderData.keyword)
  const [ kelas, setKelas ] = useState(loaderData.kelas)
  const [ loadMode, setLoadMode ] = useState<LoadMode>('reload')
  const [ items, setItems ]  = useState(loaderData.items)

  const temp = Array(10).fill(1).map((_, i) => ({
    label: `${i + 1}`,
    value: i + 1
  }))
  const kelasOptions = [
    ...temp,
    {
      value: -1,
      label: 'Tampilkan Semua Kelas'
    }
  ]
  const itemsContent = items.map(item => (
    <ListItem key={item.nisn} {...item} />
  ))
  return (
    <>
      <PageHeader
        title="Hasil Pengurutan"
        subtitle="Menampilkan hasil pengurutan sistem"
      >
        <button className="px-4 py-2 rounded bg-indigo-600 text-white font-bold mx-2">
          ulangi perhitungan
        </button>
      </PageHeader>

      <div className="px-12 py-6 flex flex-col gap-6">
        <div className='bg-white'>
          {itemsContent}
        </div>
      </div>
    </>
  )
}