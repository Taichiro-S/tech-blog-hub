'use client'
import { ColumnDef } from '@tanstack/react-table'
import { Publication } from '@/utils/types'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const columns: ColumnDef<Publication>[] = [
  {
    accessorKey: 'rank',
    header: '#',
    cell: ({ row }) => {
      const rank = row.index + 1
      return <div className="font-medium">{rank}</div>
    },
  },
  {
    accessorKey: 'display_name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          名前
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'total_liked_count',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className=" flex font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          いいね数
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const c = parseInt(row.getValue('total_liked_count'))
      const formatted = c.toLocaleString('ja-JP')

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: 'total_article_count',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-right font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          記事数
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const c = parseInt(row.getValue('total_article_count'))
      const formatted = c.toLocaleString('ja-JP')

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
]
