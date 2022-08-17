import { z } from 'zod'
import { useState, ReactNode, InputHTMLAttributes, useEffect, useMemo } from 'react'
import { json, LoaderFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import PageHeader from "~/components/PageHeader";
import FilterField from '~/components/FilterField'
import PageCard from "~/components/PageCard";
import { getSql } from '~/db.server'
import { extract_str, extract_int } from '~/extract'
import { float_string } from '~/model/common';
import { getAvatar } from '~/utils';

const item_schema = z.object({
  nama: z.string(),
  nisn: z.string(),
  id: z.string(),
  avatar: z.string().nullish(),
  ipa: float_string,
  ips: float_string,
  matematika: float_string,
  bing: float_string,
  bindo: float_string,
  penjaskes: float_string,
  agama: float_string,
  prakarya: float_string,
  pancasila: float_string,
  rata: float_string
})
const items_schema = z.array(item_schema)
type Item = z.infer<typeof item_schema>
type Items = z.infer<typeof items_schema>

type LoaderData = {
  items: Items;
  tahun: number;
  semester: number;
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const q = url.searchParams
  const now = new Date()
  const default_year = 2021
  const default_semester = 1
  const tahun = extract_int(q, 'tahun', default_year)
  const semester = extract_int(q, 'semester', default_semester)
  const cursor = extract_str(q, 'cursor')

  const sql = getSql()

  try {
    const rows = await sql`
      select 
        s.id,
        s.nama,
        s.nisn,
        s.avatar,
        ((n.matematika + n.ipa + n.ips + n.bing + n.bindo + n.penjaskes + n.prakarya + n.agama + n.pancasila) / 9)  as rata,
        n.matematika,
        n.ipa,
        n.ips,
        n.bing,
        n.bindo,
        n.penjaskes,
        n.prakarya,
        n.agama,
        n.pancasila
      from
        nilai n
        left join siswa s 
          on n.id_siswa = s.id
          where 
            tahun_ajaran = ${tahun}
            and semester = ${semester}
            ${cursor ? sql`and s.id > ${cursor}` : sql``}
      order by s.id
      limit 10`;
    const items = await items_schema.parseAsync(rows)
    return json({
      items,
      tahun,
      semester
    })
  } catch (err) {
    console.log(err)
    console.log('got error')
    throw err;
  }
}

type ListItemProps = {
  item: Item;
}
function ListItem({ item } : ListItemProps) {
  const avatar = item.avatar ? item.avatar : getAvatar(item.nisn)
  return (
    <div className="grid grid-cols-12 px-2 bg-white border-b">
      <div className="col-start-1 col-span-4 flex items-center gap-3">
        <img
          src={avatar}
          alt={item.nama}
          className="h-12 w-12 border-2 border-pink-600"
        />
        <div className="flex items-start justify-center flex-col">
          <div className="text-lg font-bold">{item.nama}</div>
          <div className="text-sm">NISN: {item.nisn}</div>
        </div>
      </div>
      <div 
        className="col-span-8 grid grid-cols-10 col-start-5 text-sm"
      >
        <div className="hover:bg-green-200 flex items-center justify-center py-6">{item.matematika.toFixed(2)}</div>
        <div className="hover:bg-green-200 flex items-center justify-center py-6">{item.ipa.toFixed(2)}</div>
        <div className="hover:bg-green-200 flex items-center justify-center py-6">{item.ips.toFixed(2)}</div>
        <div className="hover:bg-green-200 flex items-center justify-center py-6">{item.bing.toFixed(2)}</div>
        <div className="hover:bg-green-200 flex items-center justify-center py-6">{item.bindo.toFixed(2)}</div>
        <div className="hover:bg-green-200 flex items-center justify-center py-6">{item.penjaskes.toFixed(2)}</div>
        <div className="hover:bg-green-200 flex items-center justify-center py-6">{item.agama.toFixed(2)}</div>
        <div className="hover:bg-green-200 flex items-center justify-center py-6">{item.prakarya.toFixed(2)}</div>
        <div className="hover:bg-green-200 flex items-center justify-center py-6">{item.pancasila.toFixed(2)}</div>
        <div className="hover:bg-green-200 flex items-center justify-center py-6">{item.rata.toFixed(2)}</div>
      </div>
    </div>
  )
}

function ListHeader() {
  return (
    <div className="bg-white py-4 grid grid-cols-12 border-b-2 border-indigo-400">
      <div className="col-start-5 col-span-8 grid grid-cols-10 items-center text-center text-sm font-black">
        <div>mat</div>
        <div>ipa</div>
        <div>ips</div>
        <div>bndo</div>
        <div>bing</div>
        <div>pjsk</div>
        <div>agam</div>
        <div>prk</div>
        <div>pcs</div>
        <div>avg</div>
      </div>
    </div>
  )
}

export default function NilaiPage() {
  const loaderData = useLoaderData<LoaderData>()
  const reloadFetcher = useFetcher<LoaderData>()
  const loadMoreFetcher = useFetcher<LoaderData>()
  const [ loadMode, setLoadMode ] = useState('replace')
  const [ items, setItems ] = useState(loaderData.items)
  const [ tahun, setTahun ]  = useState(loaderData.tahun)
  const [ semester, setSemester ] = useState(loaderData.semester)

  const fetcherParams = useMemo(() => ({
    tahun,
    semester,
    loadMode
  }), [ tahun, semester, loadMode ])

  useEffect(() => {
    if (reloadFetcher.data) {
      setItems(reloadFetcher.data.items)
    }
  }, [ reloadFetcher ])

  useEffect(() => {
    if (loadMoreFetcher.data) {
      const newItems = loadMoreFetcher.data.items
      setItems(items => ([
        ...items,
        ...newItems
      ]))
    }
  }, [ loadMoreFetcher ])
  
  useEffect(() => {
    const q = new URLSearchParams()
    q.set('tahun', tahun.toString())
    q.set('semester', semester.toString())
    const url = '/app/nilai?' + q.toString()
    reloadFetcher.load(url)
  }, [ tahun, semester ])

  function onLoadMore() {
    const q = new URLSearchParams()
    const cursor = items[items.length - 1].id
    q.set('tahun', tahun.toString())
    q.set('semester', semester.toString())
    q.set('cursor', cursor)
    const url = '/app/nilai?' + q.toString()
    loadMoreFetcher.load(url)
  }

  const itemsContent = items.map(item => (
    <ListItem
      key={item.id}
      item={item}
    />
  ))
  return (
    <>
      <PageHeader
        title="Daftar Nilai"
        subtitle="Menampilkan daftar nilai siswa"
      ></PageHeader>
      <PageCard>
        <div className="flex gap-6">
          <FilterField 
            label="Tahun"
            min={2020}
            max={2050}
            value={tahun}
            onSet={setTahun}
            name="tahun"
          />
          <FilterField 
            label="Semester"
            min={1}
            max={2}
            value={semester}
            onSet={setSemester}
          />
        </div>
        <div className="flex flex-col">
          <ListHeader />
          {itemsContent}
        </div>
        <button
          type="button"
          onClick={onLoadMore}
          className="bg-blue-200 border px-6 py-2 rounded overflow-hidden text-gray-600 text-lg font-bold shadow text-center self-start"
        >
          muat lebih banyak
        </button>
      </PageCard>
    </>
  )
}