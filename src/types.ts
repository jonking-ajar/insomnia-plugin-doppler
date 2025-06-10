export interface DopplerMe {
  workplace: { name: string; slug: string }
  type: string
  token_preview: string
  slug: string
  created_at: string
  name: string
  last_seen_at: string
}

export interface DopplerSecret {
  computed: string
  computedValueType: { type: string }
  computedVisibility: string
  note: string
}
