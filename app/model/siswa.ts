import { z } from 'zod'
import { date_string, int_string } from './common'

export const jenis_kelamin_schema = z.enum(['Laki - Laki', 'Perempuan'])
export type JenisKelamin = z.infer<typeof jenis_kelamin_schema>
export const siswa_schema = z.object({
  id: z.string(),
  nisn: z.string(),
  nama: z.string(),
  jenis_kelamin: jenis_kelamin_schema,
  penghasilan_ortu: int_string,
  tanggungan_ortu: int_string,
  kelas: int_string.refine(x => z.number().min(1, "tidak boleh kurang dari 1")),
  sub_kelas: int_string.refine(x => z.number().min(1, "tidak boleh kurang dari 1")),
  avatar: z.string().optional(),
  tanggal_lahir: z.date().nullish(),
  username: z.string()
})

export type Siswa = z.infer<typeof siswa_schema>

export const serialized_siswa_schema = siswa_schema.extend({
  tanggal_lahir: z.string()
})
export type SerializedSiswa = z.infer<typeof serialized_siswa_schema>
