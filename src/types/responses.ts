export interface ErrorResponse {
  message: string
  errors?: Record<string, string[]>
  statusCode?: number
  detail?: string
}

export type PaginatedResponse<T = any> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
