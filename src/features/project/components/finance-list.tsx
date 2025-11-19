"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Plus, Pencil, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import { useAppDispatch } from "@/store/hooks"
import { AppDispatch } from "@/store/store"
import { getAllFinances, deleteFinance } from "@/store/actions/finance"
import { toast } from "sonner"
import { FinanceDialog } from "./finance-dialog"

interface FinanceListProps {
  projectId: string
}

export function FinanceList({ projectId }: FinanceListProps) {
  const dispatch = useAppDispatch<AppDispatch>()
  const [finances, setFinances] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [financeDialog, setFinanceDialog] = useState<{ open: boolean; financeId?: string }>({ open: false })

  const fetchFinances = async () => {
    setLoading(true)
    dispatch(getAllFinances({ page: 1 }))
      .unwrap()
      .then((data) => {
        const projectFinances = data.results?.filter((f: any) => f.project === projectId) || []
        setFinances(projectFinances)
      })
      .catch((error: any) => {
        toast.error("Error", { description: error.message || "Failed to load finances" })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchFinances()
  }, [projectId])

  const handleDelete = (id: string) => {
    dispatch(deleteFinance(id))
      .unwrap()
      .then(() => {
        toast.success("Success", { description: "Finance record deleted successfully" })
        fetchFinances()
      })
      .catch((error: any) => {
        toast.error("Error", { description: error.message || "Failed to delete finance record" })
      })
  }

  const totalIncome = finances.filter(f => f.transaction_type === "INCOME").reduce((sum, f) => sum + f.amount, 0)
  const totalExpense = finances.filter(f => f.transaction_type === "EXPENSE").reduce((sum, f) => sum + f.amount, 0)
  const netBalance = totalIncome - totalExpense

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Financial Records</CardTitle>
              <CardDescription>Track income and expenses for this project</CardDescription>
            </div>
            <Button onClick={() => setFinanceDialog({ open: true })} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Income</CardDescription>
                <CardTitle className="flex items-center text-2xl text-green-600">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  ${totalIncome.toFixed(2)}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Expenses</CardDescription>
                <CardTitle className="flex items-center text-2xl text-red-600">
                  <TrendingDown className="mr-2 h-5 w-5" />
                  ${totalExpense.toFixed(2)}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Net Balance</CardDescription>
                <CardTitle className={`flex items-center text-2xl ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <DollarSign className="mr-2 h-5 w-5" />
                  ${netBalance.toFixed(2)}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="space-y-2">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : finances.length === 0 ? (
              <p className="text-sm text-muted-foreground">No financial records yet</p>
            ) : (
              finances.map((finance) => (
                <div key={finance.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={finance.transaction_type === "INCOME" ? "default" : "secondary"}>
                        {finance.transaction_type}
                      </Badge>
                      <span className="font-medium">{finance.category}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{finance.description}</p>
                    <p className="text-xs text-muted-foreground">{new Date(finance.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-semibold ${finance.transaction_type === "INCOME" ? 'text-green-600' : 'text-red-600'}`}>
                      ${finance.amount.toFixed(2)}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => setFinanceDialog({ open: true, financeId: finance.id })}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(finance.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <FinanceDialog
        open={financeDialog.open}
        onOpenChange={(open) => setFinanceDialog({ open })}
        projectId={projectId}
        financeId={financeDialog.financeId}
        onSuccess={fetchFinances}
      />
    </>
  )
}
