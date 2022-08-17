import { z } from 'zod'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { LoaderFunction, json } from '@remix-run/node'
import { Link, useFetcher, useLoaderData, useLocation } from '@remix-run/react'
import kmeans from '~/kmeans'

import Select from '~/components/form/Select'
import PageHeader from '~/components/PageHeader'
import FilterField from '~/components/FilterField'
import { extract_str, extract_int } from '~/extract'
import { getSql } from '~/db.server'
import type { JenisKelamin } from '~/model/siswa'
import { debounce, LoadMode } from '~/core'
import { float_string, int_string } from '~/model/common'
import PageCard from '~/components/PageCard'

const item_schema = z.object({
  nama: z.string(),
  nisn: z.string(),
  id: z.string(),
  avatar: z.string().optional(),
  penghasilan_ortu: int_string,
  rata: float_string
})
const items_schema = z.array(item_schema)

type Item = z.infer<typeof item_schema>
type Items = z.infer<typeof items_schema>
type Clusters = Array<Set<number>>

type LoaderData = {
  items: Array<Item>;
  tahun: number;
  semester: number;
}

type ListItemProps = Item;
function ListItem({ avatar, nama, nisn, id, rata }: ListItemProps) {
  return (
    <li className="flex items-center gap-6 py-3 px-3 border-b border-gray-100 text-gray-600">
      <img 
        src={avatar}
        className="w-16 h-16 border-4 border-purple-500 rounded-lg overflow-hidden"
      />
      <div className='flex-grow'>
        <p className="text-xl font-bold">{nama}</p>
        <p className="text-lg font-light lowercase">NISN: {nisn}</p>
      </div>
      <Link
        to={`/app/siswa/${id}`}
        className="px-2 py-2 rounded transition-all hover:bg-green-600 focus:bg-green-600 hover:text-white focus:text-white text-lg font-bold"
      >
        {rata.toFixed(2)}
      </Link>
    </li>
  )
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const tahun = extract_int(url.searchParams, 'tahun', 2020)
  const semester = extract_int(url.searchParams, 'tahun', 1)
  const sql = getSql()
  const rows = await sql`
      select 
        s.id,
        s.nama,
        s.nisn,
        s.avatar,
        s.penghasilan_ortu,
        ((n.matematika + n.ipa + n.ips + n.bing + n.bindo + n.penjaskes + n.prakarya + n.agama + n.pancasila) / 9)  as rata
      from
        nilai n
      left join siswa s 
        on n.id_siswa = s.id
      where 
        n.tahun_ajaran = ${tahun}
        and n.semester = ${semester}
      order by s.id`;
  let items = await items_schema.parseAsync(rows)
  const getAvatarUrl = (id: string) => `https://avatars.dicebear.com/api/human/${id}.svg`
  items = items.map(row => {
    const avatar = row.avatar ? row.avatar : getAvatarUrl(row.id)
    return {
      ...row,
      avatar
    }
  })
  return json({
    items,
    tahun,
    semester
  })
}

export default function RankPage() {
  const loaderData = useLoaderData<LoaderData>()
  const [ items, setItems ]  = useState(loaderData.items)
  const [ tahun, setTahun ] = useState(loaderData.tahun)
  const [ semester, setSemester ] = useState(loaderData.semester)
  const [ clusters, setClusters ] = useState<Clusters>([])
  const [ activeIndex, setActiveIndex ] = useState(0)
  const activeCluster = clusters.length ? clusters[activeIndex] : undefined;

  const itemsContent = activeCluster 
    ?  (
      Array.from(activeCluster).map(index => {
        const item = items[index];
        return (
          <ListItem key={item.nisn} {...item} />
        )
      })
    ) : null;

  useEffect(() => {
    if (typeof window === undefined) {
      return;
    }
    const result = kmeans(loaderData.items)
    setClusters(result.clusters)
  }, [])

  return (
    <>
      <PageHeader
        title="Hasil Pengurutan"
        subtitle="Menampilkan hasil pengurutan sistem"
      >
      </PageHeader>

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
          <button className="px-4 py-2 rounded bg-indigo-600 text-white font-bold mx-2">
            ulangi perhitungan
          </button>
        </div>

        <div className='bg-white'>

          <div className="flex gap-3 p-2">
            {clusters.map((c, index) => (
              <button 
                key={index}
                className={`
                  px-3 py-2 rounded border font-bold
                  ${activeIndex == index ? 'bg-blue-500 text-white' : ''}
                `}
                onClick={() => {
                  setActiveIndex(index)
                }}
              >
                kluster {index + 1}
              </button>
            ))}
          </div>

          {itemsContent}
        </div>
      </PageCard>

    </>
  )
}