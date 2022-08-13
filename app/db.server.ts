import postgres from 'postgres'

let sql: ReturnType<typeof postgres>;

export type Sql = postgres.Sql<{}>;

export function getSql() {
  if (!sql) {
    const DEFAULT_PG_URI = 'postgresql://root@old-junk:26257/ratna_kmeans_db?sslmode=disable'
    const PG_URI = process.env.PG_URI ? process.env.PG_URI : DEFAULT_PG_URI
    sql = postgres(PG_URI, {
      prepare: false,
      max: 1
    })
  }
  return sql
}