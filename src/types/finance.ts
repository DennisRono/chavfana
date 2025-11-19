export type FinanceKind = 'Expense' | 'Earning'

export type TransactionType =
  | 'PURCHASE'
  | 'SALE'
  | 'EXPENSE'
  | 'INCOME'
  | 'TRANSFER_IN'
  | 'TRANSFER_OUT'
  | 'ADJUSTMENT_IN'
  | 'ADJUSTMENT_OUT'
  | 'DAMAGE'
  | 'RETURN'
  | 'WRITE_OFF'

export interface TransactionData {
  transaction_type: TransactionType
  inventory_item?: string | null
  quantity?: number | null
  amount: string
  date: string
}

export interface FinanceData {
  project: string
  date: string
  kind: FinanceKind
  inventory_item?: string | null
  transactions: TransactionData[]
  expense_type: string
  related_model: any
  related_object_id: string
}

export interface FinanceResponse {
  id: string
  project: string
  date: string
  kind: FinanceKind
  inventory_item: string | null
  transactions: TransactionResponse[]
  total_amount: string
  created_at: string
  updated_at: string
}

export interface TransactionResponse {
  id: string
  transaction_type: TransactionType
  inventory_item: string | null
  quantity: number | null
  amount: string
  date: string
}