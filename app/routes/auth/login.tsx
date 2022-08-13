import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { match } from 'ts-pattern';

import { z } from 'zod'

import Field from '~/components/form/Field'
import Input from '~/components/form/Input'
import Submit from '~/components/form/Submit'
import { err, from_zod, type AppErr } from '~/core'
import { getSql } from '~/db.server'
import { findByUsername } from '~/serv/user.server';
import { createSession } from '~/session.server'

type ActionData = AppErr;

const login_schema = z.object({
  username: z.string().min(5, 'harus diisi'),
  password: z.string().min(5, 'harus diisi')
})

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const data: any = Object.fromEntries(formData.entries())
  const parseResult = await login_schema.safeParseAsync(data)
  if (!parseResult.success) {
    const error = from_zod(parseResult.error, data, 'periksa kembali form anda');
    return json(error, { status: 200 })
  }
  const payload = parseResult.data;
  const sql = getSql()
  const findResult = await findByUsername(sql, payload.username)
  if (!findResult.ok) {
    console.log(findResult.error)
    return match(findResult.error)
      .with({ code: 'not_found' }, (e) => {
        const msg = e.message
        const error = {
          ...e,
          fields: data,
          fieldErrors: {
            username: [ msg ]
          }
        }
        return json(error, { status: 404 })
      })
      .otherwise(e => json(e, { status: 500 }))
  }
  const user = findResult.data
  if (user.password != payload.password) {
    const msg = `password tidak cocok`
    const error = err({
      code: 'password_mismatch',
      message: msg,
      fields: data,
      fieldErrors: {
        password: [ msg ]
      }
    })
    return json(error, { status: 401 })
  }
  return createSession(user, '/app')
}

export default function LoginPage() {
  const actionData = useActionData<ActionData>()
  const fields = actionData?.fields
  const fieldErrors = actionData?.fieldErrors
  return (
    <div className="md:w-1/3 bg-gray-50 rounded overflow shadow p-4">
      <h1 className="text-center mb-6 text-gray-600 text-2xl font-bold">Login</h1>
      <Form method="post" encType='multipart/form-data'>
        <Field label="username">
          <Input
            name="username"
            errors={fieldErrors?.username}
            defaultValue={fields?.username}
          />
        </Field>
        <Field label="password">
          <Input
            name="password"
            type="password"
            errors={fieldErrors?.password}
            defaultValue={fields?.password}
          />
        </Field>
        <Submit label="login"></Submit>
      </Form>
    </div>
  )
}