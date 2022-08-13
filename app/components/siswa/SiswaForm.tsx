import Field from '~/components/form/Field'
import Input from '~/components/form/Input'
import ListError from '~/components/form/ListError'
import Select from '~/components/form/Select'

export type SiswaFormProps = {
  message?: Array<string>;
  fields?: Record<string, any>;
  fieldErrors?: Record<string, string[] | undefined>;
}

const htmlDate = (s: string | Date) => {
  let date = typeof s === 'string' ? new Date(s) : s;  
  return date.toISOString().split('T')[0]
}

export default function SiswaForm({ message, fields, fieldErrors } : SiswaFormProps) {
  const tanggal_lahir = fields?.tanggal_lahir 
    ? htmlDate(fields.tanggal_lahir)
    : undefined;
  return (
    <>
      <ListError errors={message} />
      <Field label="NISN">
        <Input
          name="nisn"
          required
          type="text"
          defaultValue={fields?.nisn}
          errors={fieldErrors?.nisn}
        />
      </Field>
      <Field label="Nama">
        <Input
          name="nama"
          defaultValue={fields?.nama}
          required
          type="text"
          errors={fieldErrors?.nama}
        />
      </Field>
      <Field label="Jenis Kelamin">
        <Select
          name="jenis_kelamin"
          defaultValue={fields?.jenis_kelamin}
          required
          options={[
            { label: 'Laki - Laki', value: 'Laki - Laki' },
            { label: 'Perempuan', value: 'Perempuan' }
          ]}
          errors={fieldErrors?.jenis_kelamin}
        />
      </Field>
      <Field label="Tangal Lahir">
        <Input
          name="tanggal_lahir"
          required
          type="date"
          defaultValue={tanggal_lahir}
          errors={fieldErrors?.tanggal_lahir}
        />
      </Field>
      <Field label="Penghasilan Orang Tua">
        <Input
          name="penghasilan_ortu"
          required
          type="number"
          min={100_000}
          defaultValue={fields?.penghasilan_ortu}
          errors={fieldErrors?.penghasilan_ortu}
        />
      </Field>
      <Field label="Penghasilan Orang Tua">
        <Input
          name="tanggungan_ortu"
          required
          type="number"
          min={1}
          defaultValue={fields?.tanggungan_ortu}
          errors={fieldErrors?.tanggungan_ortu}
        />
      </Field>
      <Field label="Kelas">
        <Select
          name="kelas"
          required
          defaultValue={fields?.kelas}
          options={[
            { label: 'VII', value: 7 },
            { label: 'VIII', value:8 }
          ]}
          errors={fieldErrors?.kelas}
        />
      </Field>
      <Field label="Sub Kelas">
        <Input
          name="sub_kelas"
          required
          min={1}
          max={30}
          defaultValue={fields?.sub_kelas}
          errors={fieldErrors?.sub_kelas}
        />
      </Field>
      <Field label="Username">
        <Input
          name="username"
          defaultValue={fields?.username}
          errors={fieldErrors?.username}
        />
      </Field>
    </>
  )
}