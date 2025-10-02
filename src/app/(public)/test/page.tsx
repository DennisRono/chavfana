'use client'

import { useState } from 'react'
import { DataTable, Badge } from '@/components/shared/table'
import { Edit, Trash2, Eye, Mail } from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  joinedAt: string
}

const sampleUsers: User[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Admin',
    status: 'active',
    joinedAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'User',
    status: 'active',
    joinedAt: '2024-02-20',
  },
  {
    id: 3,
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    role: 'User',
    status: 'inactive',
    joinedAt: '2024-03-10',
  },
  {
    id: 4,
    name: 'Diana Ross',
    email: 'diana@example.com',
    role: 'Moderator',
    status: 'active',
    joinedAt: '2024-01-05',
  },
  {
    id: 5,
    name: 'Ethan Hunt',
    email: 'ethan@example.com',
    role: 'User',
    status: 'pending',
    joinedAt: '2024-04-12',
  },
  {
    id: 6,
    name: 'Fiona Glenanne',
    email: 'fiona@example.com',
    role: 'Admin',
    status: 'active',
    joinedAt: '2024-02-28',
  },
  {
    id: 7,
    name: 'George Martin',
    email: 'george@example.com',
    role: 'User',
    status: 'active',
    joinedAt: '2024-03-15',
  },
  {
    id: 8,
    name: 'Hannah Baker',
    email: 'hannah@example.com',
    role: 'Moderator',
    status: 'inactive',
    joinedAt: '2024-01-22',
  },
]

export default function TableDemo() {
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const pageSize = 5

  const columns = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (row: User) => (
        <Badge variant={row.role === 'Admin' ? 'default' : 'outline'}>
          {row.role}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row: User) => (
        <Badge
          variant={
            row.status === 'active'
              ? 'default'
              : row.status === 'inactive'
              ? 'destructive'
              : 'secondary'
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'joinedAt',
      header: 'Joined',
      sortable: true,
      className: 'text-muted-foreground',
    },
  ]

  const actions = [
    {
      label: 'View',
      icon: <Eye className="mr-2 size-4" />,
      onClick: (row: User) => alert(`Viewing ${row.name}`),
    },
    {
      label: 'Edit',
      icon: <Edit className="mr-2 size-4" />,
      onClick: (row: User) => alert(`Editing ${row.name}`),
    },
    {
      label: 'Email',
      icon: <Mail className="mr-2 size-4" />,
      onClick: (row: User) => window.open(`mailto:${row.email}`),
    },
    {
      label: 'Delete',
      icon: <Trash2 className="mr-2 size-4" />,
      onClick: (row: User) => alert(`Deleting ${row.name}`),
      variant: 'destructive' as const,
    },
  ]

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your team members and their roles
          </p>
        </div>

        <DataTable
          data={sampleUsers}
          columns={columns}
          actions={actions}
          searchable
          searchPlaceholder="Search users..."
          searchKeys={['name', 'email', 'role']}
          pagination={{
            currentPage: page,
            pageSize,
            totalItems: sampleUsers.length,
            onPageChange: setPage,
          }}
          loading={loading}
          emptyMessage="No users found"
          onRowClick={(row) => console.log('Row clicked:', row)}
          rowClassName={(row) =>
            row.status === 'inactive' ? 'opacity-60' : ''
          }
        />
      </div>
    </div>
  )
}
