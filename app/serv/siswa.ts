import { z } from 'zod'
import type { Sql } from '~/db.server'
import { ok, err, from_zod, type NotFound, type Result, type AppErr } from '~/core'
import { type Siswa, siswa_schema } from '~/model/siswa'

const siswa_items_schema = z.array(siswa_schema)
type SiswaItems = z.infer<typeof siswa_items_schema>;

async function parse_one(data: unknown) {
  const ps = await siswa_schema.safeParseAsync(data)
  if (!ps.success) {
    const error = from_zod(ps.error, data as any, 'parsing_error');
    return err(error);
  }
  return ok(ps.data);
}

export async function getByID(sql: Sql, id: string): Promise<Siswa> {
  const rows = await sql`
    select * from siswa where id = ${id}`
  if (!rows.length) {
    throw new Error('not_found')
  }
  const [ row ] = rows
  const siswa = await siswa_schema.parseAsync(row)
  return siswa;
}

export async function getByNISN(sql: Sql, nisn: string): Promise<Result<Siswa, AppErr>> {
  const rows = await sql`
    select * from siswa where nisn = ${nisn}`
  if (!rows.length) {
    return err<NotFound>({
      code: 'not_found',
      message: `can't find siswa with nisn=${nisn}`
    })
  }
  console.log(rows[0])
  console.log('siswa')
  return parse_one(rows[0]);
}

export async function getByUsername(sql: Sql, username: string) : Promise<Result<Siswa, AppErr>> {
  const rows = await sql`
    select * from siswa where username = ${username}`
  if (!rows.length) {
    return err<NotFound>({
      code: 'not_found',
      message: `can't find siswa with username=${username}`
    })
  }
  return parse_one(rows[0]);
}

type SearchParams = {
  keyword: string;
  cursor?: string;
  kelas?: number;
  limit: number;
}
export async function searchSiswa(sql: Sql, params: SearchParams) {
  const keyword = `%${params.keyword}%`
  const { limit, cursor, kelas } = params
  const rows = await sql`
    select * from siswa
      where 
        (nama ilike ${keyword} or nisn ilike ${keyword})
        ${cursor ? sql`and nama > ${cursor}` : sql``}
        ${kelas ? sql`and kelas = ${kelas}` : sql``}
      order by nama
      limit ${limit}`
  const parsed = await siswa_items_schema.parseAsync(rows)
  const getAvatarUrl = (id: string) => `https://avatars.dicebear.com/api/human/${id}.svg`
  const items: Array<Siswa> = parsed.map(item => {
    const avatar = item.avatar ? item.avatar : getAvatarUrl(item.id)
    return {
      ...item,
      avatar
    } as Siswa;
  })
  return items
}