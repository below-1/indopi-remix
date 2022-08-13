import { z } from 'zod'
import type { ActionFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import SiswaForm from '~/components/siswa/SiswaForm'
import Submit from '~/components/form/Submit'
import PageHeader from '~/components/PageHeader'
import { jenis_kelamin_schema } from '~/model/siswa'
import { date_string, int_string, nisn_schema } from '~/model/common'
import { err, from_zod, type AppErr } from '~/core'
import { getSql } from '~/db.server'

const input_schema = z.object({
  nama: z.string(),
  nisn: nisn_schema,
  jenis_kelamin: jenis_kelamin_schema,
  penghasilan_ortu: int_string,
  tanggungan_ortu: int_string,
  kelas: int_string.refine(x => z.number().min(1, "tidak boleh kurang dari 1")),
  sub_kelas: int_string.refine(x => z.number().min(1, "tidak boleh kurang dari 1")),
  avatar: z.string().optional(),
  tanggal_lahir: date_string,
  username: z.string()
})

type Input = z.infer<typeof input_schema>;

type ActionData = AppErr;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const raw = Object.fromEntries(formData.entries())
  if (!raw.username) {
    raw.username = raw.nisn
  }
  const parseResult = await input_schema.safeParseAsync(raw)
  if (!parseResult.success) {
    console.log(parseResult.error)
    const error = from_zod(parseResult.error, raw, 'form tidak valid')
    return json(error, { status: 400 });
  }
  const user_payload: any = {
    username: raw.username,
    password: raw.username,
    role: 'siswa'
  }
  let siswa_payload: any = parseResult.data
  const getAvatarUrl = (id: string) => `https://avatars.dicebear.com/api/human/${id}.svg`
  siswa_payload.avatar = getAvatarUrl(siswa_payload.username)
  const sql = getSql()
  try {
    const id = await sql.begin(async (sql) => {
      await sql`
        insert into "user" ${sql(user_payload)}`
      const rows = await sql`
        insert into "siswa" ${sql(siswa_payload)}
          returning id`
      const [ { id } ] = rows;
      return id;
    });
    console.log(`got id = `, id)
    return redirect(`/app/siswa/${id}`)
  } catch (e) {
    console.log(e)
    const error = err({
      code: 'db_err',
      message: (e as any).message
    })
    return json(error, {
      status: 500
    })
  }
}


export default function NewSiswaPage() {
  const actionData = useActionData<ActionData>()
  const fields = actionData?.fields
  const fieldErrors = actionData?.fieldErrors
  const message = actionData?.message ? [actionData.message] : undefined;
  return (
    <>
      <PageHeader
        title="Siswa Baru"
        subtitle="Input Data Siswa"
      />
      <div className="px-12 py-6 flex flex-col gap-6">
        <Form 
          method="post"
          encType="multipart/form-data"
          className='md:w-1/2 bg-white p-4 rounded border'
        >
          <SiswaForm
            fields={fields}
            fieldErrors={fieldErrors}
            message={message}
          />
          <Submit label='tambah siswa'></Submit>
        </Form>
      </div>
    </>
  )
}