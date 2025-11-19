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

const financeSchema = z.object({
  project: z.string().min(1, 'Project is required'),
  transaction_type: z
    .enum(['INCOME', 'EXPENSE'])
    .refine((val) => !!val, { message: 'Transaction type is required' }),
  category: z.string().min(1, 'Category is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
  payment_method: z.string().optional(),
  reference_number: z.string().optional(),
})

type FinanceForm = z.infer<typeof financeSchema>

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
    formState: { errors, isSubmitting },
  } = useForm<FinanceForm>({
    resolver: zodResolver(financeSchema),
    defaultValues: {
      project: projectId,
      transaction_type: 'EXPENSE',
      category: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      description: '',
      payment_method: '',
      reference_number: '',
    },
  })

  useEffect(() => {
    if (financeId && open) {
      dispatch(getFinanceById(financeId))
        .unwrap()
        .then((data) => {
          reset({
            project: data.project,
            transaction_type: data.transaction_type,
            category: data.category,
            amount: data.amount,
            date: data.date,
            description: data.description || '',
            payment_method: data.payment_method || '',
            reference_number: data.reference_number || '',
          })
        })
        .catch((error: any) => {
          toast.error('Error', {
            description: error.message || 'Failed to load finance record',
          })
        })
    }
  }, [financeId, open, dispatch, reset])

  const onSubmit = async (data: FinanceForm) => {
    const action = isEdit
      ? updateFinance({ id: financeId!, data })
      : createFinance(data)

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success('Success', {
          description: `Finance ${isEdit ? 'updated' : 'created'} successfully`,
        })
        reset()
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
              <Label htmlFor="transaction_type">Transaction Type</Label>
              <Controller
                name="transaction_type"
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
                        <SelectItem value="INCOME">Income</SelectItem>
                        <SelectItem value="EXPENSE">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.transaction_type && (
                      <p className="text-sm text-destructive">
                        {errors.transaction_type.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      id="category"
                      placeholder="e.g., Feed, Labor, Sales"
                      {...field}
                      disabled={isSubmitting}
                    />
                    {errors.category && (
                      <p className="text-sm text-destructive">
                        {errors.category.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Controller
                name="amount"
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
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                    {errors.amount && (
                      <p className="text-sm text-destructive">
                        {errors.amount.message}
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

            <div className="space-y-2">
              <Label htmlFor="payment_method">Payment Method</Label>
              <Controller
                name="payment_method"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      id="payment_method"
                      placeholder="e.g., Cash, Bank Transfer"
                      {...field}
                      disabled={isSubmitting}
                    />
                    {errors.payment_method && (
                      <p className="text-sm text-destructive">
                        {errors.payment_method.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference_number">Reference Number</Label>
              <Controller
                name="reference_number"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      id="reference_number"
                      placeholder="Optional reference"
                      {...field}
                      disabled={isSubmitting}
                    />
                    {errors.reference_number && (
                      <p className="text-sm text-destructive">
                        {errors.reference_number.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <>
                  <Textarea
                    id="description"
                    placeholder="Add notes about this transaction..."
                    rows={3}
                    {...field}
                    disabled={isSubmitting}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">
                      {errors.description.message}
                    </p>
                  )}
                </>
              )}
            />
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
