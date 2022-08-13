import type { Sql } from '~/db.server'
import { ok, wrap, err, from_zod, type NotFound, type Result, type AppErr } from '~/core'
import { type User, user_schema } from '~/model/user'

export async function findByUsername(sql: Sql, username: string): Promise<Result<User, AppErr>> {
  const queryResult = await wrap(sql<Array<User>>`
    select * from "user"
      where username = ${username}`)
  if (!queryResult.ok) {
    console.log(queryResult.error)
    return err({
      code: 'db_err',
      message: 'terjadi kesalahan saat mengakses database'
    })
  }
  if (!queryResult.data.length) {
    return err({
      code: 'not_found',
      message: `can't find user with username=${username}`
    })
  }
  const ps = await user_schema.safeParseAsync(queryResult.data[0])
  if (!ps.success) {
    const error = from_zod(ps.error, queryResult.data[0], `can't find user with username=${username}`)
    return err(error)
  }
  return ok(ps.data)
}
