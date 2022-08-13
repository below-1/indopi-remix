import { z } from 'zod'
import { type ActionFunction, json, redirect } from '@remix-run/node'
import PageCard from "~/components/PageCard"
import SiswaForm from "~/components/siswa/SiswaForm"
import Submit from "~/components/form/Submit"
import { Form, useActionData } from "@remix-run/react"
import SiswaContext from "~/context/SiswaContext";
import { useContext } from "react";
import { jenis_kelamin_schema } from '~/model/siswa'
import { date_string, int_string, nisn_schema } from '~/model/common'
import { err, from_zod, wrap, type AppErr } from '~/core'
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

type ActionData = AppErr;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const raw = Object.fromEntries(formData.entries())
  const parseResult = await input_schema.safeParseAsync(raw)
  if (!parseResult.success) {
    console.log(parseResult.error)
    const error = from_zod(parseResult.error, raw, 'form tidak valid')
    return json(error, { status: 400 })
  }
  const payload: any = parseResult.data;
  const sql = getSql()
  try {
    await sql`update siswa set ${sql(payload)}`
    return redirect('/app')
  } catch (_e) {
    const e = _e as any
    const error = err({
      code: 'db_err',
      message: e.message ? e.message : 'terjadi kesalahan'
    })
    return json(error, {
      status: 500
    })
  }
  
}

export default function SiswaEditPage() {
  const siswaGetter = useContext(SiswaContext)
  const siswa = siswaGetter()
  console.log(siswa)
  const actionData = useActionData<ActionData>()
  const message = actionData?.message ? [ actionData.message ] : undefined;
  const fields = actionData?.fields ? actionData.fields : siswa

  return (
    <PageCard>
      <Form 
        method="post"
        encType="multipart/form-data"
        className="md:w-1/2 bg-white p-4 rounded border"
      >
        <SiswaForm 
          message={message}
          fieldErrors={actionData?.fieldErrors} 
          fields={fields}></SiswaForm>
        <Submit label="update siswa"></Submit>
      </Form>
    </PageCard>
  )
}