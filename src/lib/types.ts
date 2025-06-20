export const FieldTypes = ["zip_code", "choice", "date", "number", "short_text", "email"] as const

export type FieldType = (typeof FieldTypes)[number]

export interface Choice {
  id: string
  label: string
}

export interface Field {
  id: string
  type: FieldType
  title: string
  default?: string
  value?: string
  description?: string
  required?: boolean
  choices?: Choice[]
}

export interface Form {
  title: string
  caption?: string
  description?: string
  fields: Field[]
}
