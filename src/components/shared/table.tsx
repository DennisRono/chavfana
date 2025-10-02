'use client'

import * as React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ArrowUpDown, MoreHorizontal, Search, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type SortDirection = 'asc' | 'desc' | null

interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
  className?: string
}

interface Action<T> {
  label: string
  onClick: (row: T) => void
  variant?: 'default' | 'destructive'
  icon?: React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  actions?: Action<T>[]
  searchable?: boolean
  searchPlaceholder?: string
  searchKeys?: (keyof T)[]
  pagination?: {
    currentPage: number
    pageSize: number
    totalItems: number
    onPageChange: (page: number) => void
  }
  loading?: boolean
  emptyMessage?: string
  className?: string
  onRowClick?: (row: T) => void
  rowClassName?: (row: T) => string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions,
  searchable = false,
  searchPlaceholder = 'Search...',
  searchKeys,
  pagination,
  loading = false,
  emptyMessage = 'No data available',
  className,
  onRowClick,
  rowClassName,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [sortKey, setSortKey] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null)

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(
        sortDirection === 'asc'
          ? 'desc'
          : sortDirection === 'desc'
          ? null
          : 'asc'
      )
      if (sortDirection === 'desc') setSortKey(null)
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const filteredData = React.useMemo(() => {
    if (!searchable || !searchQuery) return data
    return data.filter((row) => {
      const keys = searchKeys || Object.keys(row)
      return keys.some((key) => {
        const value = row[key as keyof T]
        return String(value).toLowerCase().includes(searchQuery.toLowerCase())
      })
    })
  }, [data, searchQuery, searchable, searchKeys])

  const sortedData = React.useMemo(() => {
    if (!sortKey || !sortDirection) return filteredData
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (aVal === bVal) return 0
      const comparison = aVal > bVal ? 1 : -1
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredData, sortKey, sortDirection])

  const startIndex = pagination
    ? (pagination.currentPage - 1) * pagination.pageSize
    : 0
  const endIndex = pagination
    ? startIndex + pagination.pageSize
    : sortedData.length
  const paginatedData = pagination
    ? sortedData.slice(startIndex, endIndex)
    : sortedData
  const totalPages = pagination
    ? Math.ceil(pagination.totalItems / pagination.pageSize)
    : 1

  return (
    <div className={cn('w-full space-y-4', className)}>
      {searchable && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn('font-semibold', col.className)}
                >
                  {col.sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort(col.key)}
                      className="-ml-3 h-8 data-[state=open]:bg-accent"
                    >
                      {col.header}
                      <ArrowUpDown
                        className={cn(
                          'ml-2 size-4',
                          sortKey === col.key && 'text-primary'
                        )}
                      />
                    </Button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              ))}
              {actions && actions.length > 0 && (
                <TableHead className="w-[70px]">
                  <span className="sr-only">Actions</span>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="h-32 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="size-5 animate-spin" />
                    <span>Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <TableRow
                  key={row.id ?? idx}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'transition-colors',
                    onRowClick && 'cursor-pointer',
                    rowClassName?.(row)
                  )}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render ? col.render(row) : row[col.key]}
                    </TableCell>
                  ))}
                  {actions && actions.length > 0 && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {actions.map((action, actionIdx) => (
                            <DropdownMenuItem
                              key={actionIdx}
                              onClick={() => action.onClick(row)}
                              variant={action.variant}
                            >
                              {action.icon}
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="h-32 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)}{' '}
            of {sortedData.length} results
          </p>
          <div className="flex items-center gap-2">
            <PaginationPrevious
              isActive={pagination.currentPage !== 1}
              onClick={() =>
                pagination.currentPage > 1 &&
                pagination.onPageChange(pagination.currentPage - 1)
              }
            />
            <span className="text-sm font-medium">
              Page {pagination.currentPage} of {totalPages}
            </span>
            <PaginationNext
              isActive={pagination.currentPage !== totalPages}
              onClick={() =>
                pagination.currentPage < totalPages &&
                pagination.onPageChange(pagination.currentPage + 1)
              }
            />
          </div>
        </div>
      )}
    </div>
  )
}

export { Badge }
