export type SessionType =
  | 'portrait'
  | 'wedding'
  | 'event'
  | 'family'
  | 'landscape'
  | 'other'

export interface ContactFormData {
  name: string
  email: string
  sessionType: SessionType
  approximateDate?: string
  message: string
  turnstileToken: string
}
