import { z } from 'zod'
import { int_string } from './common'

export const nilai_semester_schema = z.object({
  tahun_ajaran: int_string,
  semester: int_string,
  id_siswa: z.string(),
  matematika: z.string(),
  ipa: z.string(),
  ips: z.string(),
  bing: z.string(),
  bindo: z.string(),
  penjaskes: z.string(),
  prakarya: z.string(),
  agama: z.string(),
  pancasilan: z.string()
})

export type NilaiSemester = z.infer<typeof nilai_semester_schema>;
