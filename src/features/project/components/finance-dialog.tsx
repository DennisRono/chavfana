'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAppDispatch } from '@/store/hooks'
import { AppDispatch } from '@/store/store'
import {
  createFinance,
  getFinanceById,
  updateFinance,
} from '@/store/actions/finance'
import { toast } from 'sonner'
import { FinanceKind, TransactionType } from '@/types/finance'

// Nangoja hizi Enpoints from the backend to proceed
// Missing Inventory Endpoints
// Listing inventory items
// Creating inventory items
// Updating inventory items
// Managing inventory categories or types
// Inventory tracking or stock levels

const financeSchema = z.object({
  project: z.string().min(1, 'Project is required'),
  date: z.string().min(1, 'Date is required'),
  kind: z.enum(['Expense', 'Earning']),
  inventory_item: z.string().optional().nullable(),
  transactions: z
    .array(
      z.object({
        transaction_type: z.enum([
          'PURCHASE',
          'SALE',
          'EXPENSE',
          'INCOME',
          'TRANSFER_IN',
          'TRANSFER_OUT',
          'ADJUSTMENT_IN',
          'ADJUSTMENT_OUT',
          'DAMAGE',
          'RETURN',
          'WRITE_OFF',
        ]),
        inventory_item: z.string().optional().nullable(),
        quantity: z.number().min(0).optional().nullable(),
        amount: z.string().min(1, 'Amount is required'),
        date: z.string().min(1, 'Date is required'),
      })
    )
    .min(1, 'At least one transaction is required'),
})

export type FinanceForm = z.infer<typeof financeSchema>

interface FinanceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  financeId?: string
  onSuccess: () => void
}

export function FinanceDialog({
  open,
  onOpenChange,
  projectId,
  financeId,
  onSuccess,
}: FinanceDialogProps) {
  const dispatch = useAppDispatch<AppDispatch>()
  const isEdit = !!financeId

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FinanceForm>({
    resolver: zodResolver(financeSchema),
    defaultValues: {
      project: projectId,
      date: new Date().toISOString().split('T')[0],
      kind: 'Expense',
      inventory_item: null,
      transactions: [
        {
          transaction_type: 'EXPENSE',
          inventory_item: null,
          quantity: null,
          amount: '',
          date: new Date().toISOString().split('T')[0],
        },
      ],
    },
  })

  const currentKind = watch('kind')

  useEffect(() => {
    if (financeId && open) {
      dispatch(getFinanceById(financeId))
        .unwrap()
        .then((data) => {
          reset({
            project: data.project,
            date: data.date,
            kind: data.kind,
            inventory_item: data.inventory_item,
            transactions: data.transactions.map((transaction) => ({
              transaction_type: transaction.transaction_type,
              inventory_item: transaction.inventory_item,
              quantity: transaction.quantity,
              amount: transaction.amount,
              date: transaction.date,
            })),
          })
        })
        .catch((error: any) => {
          toast.error('Error', {
            description: error.message || 'Failed to load finance record',
          })
        })
    } else if (!financeId && open) {
      reset({
        project: projectId,
        date: new Date().toISOString().split('T')[0],
        kind: 'Expense',
        inventory_item: null,
        transactions: [
          {
            transaction_type: 'EXPENSE',
            inventory_item: null,
            quantity: null,
            amount: '',
            date: new Date().toISOString().split('T')[0],
          },
        ],
      })
    }
  }, [financeId, open, dispatch, reset, projectId])

  const onSubmit = async (data: FinanceForm) => {
    const formattedData = {
      ...data,
      expense_type: "",
      related_model: "",
      related_object_id: "",
      transactions: data.transactions.map((transaction) => ({
        ...transaction,
        amount: transaction.amount.toString(),
        quantity: transaction.quantity || null,
        inventory_item: transaction.inventory_item || null,
      })),
    }

    const action = isEdit
      ? updateFinance({ id: financeId!, data: formattedData })
      : createFinance(formattedData)

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success('Success', {
          description: `Finance ${isEdit ? 'updated' : 'created'} successfully`,
        })
        onSuccess()
        onOpenChange(false)
      })
      .catch((error: any) => {
        toast.error('Error', {
          description:
            error.message ||
            `Failed to ${isEdit ? 'update' : 'create'} finance`,
        })
      })
  }

  const getTransactionTypeOptions = (kind: FinanceKind) => {
    if (kind === 'Expense') {
      return [
        'PURCHASE',
        'EXPENSE',
        'TRANSFER_OUT',
        'ADJUSTMENT_OUT',
        'DAMAGE',
        'RETURN',
        'WRITE_OFF',
      ]
    } else {
      return ['SALE', 'INCOME', 'TRANSFER_IN', 'ADJUSTMENT_IN']
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit' : 'Add'} Finance Record</DialogTitle>
          <DialogDescription>
            Track income and expenses for your project
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="kind">Type</Label>
              <Controller
                name="kind"
                control={control}
                render={({ field }) => (
                  <>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Expense">Expense</SelectItem>
                        <SelectItem value="Earning">Income</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.kind && (
                      <p className="text-sm text-destructive">
                        {errors.kind.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      id="date"
                      type="date"
                      {...field}
                      disabled={isSubmitting}
                    />
                    {errors.date && (
                      <p className="text-sm text-destructive">
                        {errors.date.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium">Transaction Details</h4>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="transaction_type">Transaction Type</Label>
                <Controller
                  name="transactions.0.transaction_type"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getTransactionTypeOptions(currentKind).map(
                            (type) => (
                              <SelectItem key={type} value={type}>
                                {type
                                  .replace(/_/g, ' ')
                                  .toLowerCase()
                                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      {errors.transactions?.[0]?.transaction_type && (
                        <p className="text-sm text-destructive">
                          {errors.transactions[0].transaction_type.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Controller
                  name="transactions.0.amount"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        disabled={isSubmitting}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      {errors.transactions?.[0]?.amount && (
                        <p className="text-sm text-destructive">
                          {errors.transactions[0].amount.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inventory_item">
                  Inventory Item (Optional)
                </Label>
                <Controller
                  name="transactions.0.inventory_item"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="inventory_item"
                      placeholder="Inventory item ID"
                      {...field}
                      value={field.value || ''}
                      disabled={isSubmitting}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (Optional)</Label>
                <Controller
                  name="transactions.0.quantity"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="quantity"
                      type="number"
                      step="1"
                      placeholder="0"
                      {...field}
                      disabled={isSubmitting}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                      value={field.value || ''}
                    />
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Notes (Optional)</Label>
              <Controller
                name="inventory_item"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="description"
                    placeholder="Add notes about this transaction..."
                    rows={3}
                    {...field}
                    value={field.value || ''}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Add Record'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
