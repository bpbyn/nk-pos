import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export function SkeletonTable({ rows = 3, columns = 3 }: SkeletonTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            style={{
              width: ((columns - 1) / columns) * 100,
            }}
          >
            <Skeleton className="h-7 w-full" />
          </TableHead>
          {Array.from({ length: columns - 1 }).map((_, index) => (
            <TableHead
              key={index}
              style={{
                width: (1 / ((columns - 1) * columns)) * 100,
              }}
            >
              <Skeleton className="h-7 w-full" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            <TableCell
              style={{
                width: ((columns - 1) / columns) * 100,
              }}
            >
              <Skeleton className="h-7 w-full" />
            </TableCell>
            {Array.from({ length: columns - 1 }).map((_, colIndex) => (
              <TableCell
                key={colIndex}
                style={{
                  width: (1 / ((columns - 1) * columns)) * 100,
                }}
              >
                <Skeleton className="h-7 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
