import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
      {...props}
    />
  );
}

// Shop Card Skeleton
export function ShopCardSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden h-full flex flex-col">
      <Skeleton className="w-full h-48" />
      <div className="p-6 flex-1 flex flex-col">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <div className="flex gap-2 mb-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-4">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-3" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}

// List Item Skeleton
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      <Skeleton className="w-16 h-16 rounded-md" />
      <div className="flex-1">
        <Skeleton className="h-5 w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-8 w-20 rounded-md" />
    </div>
  );
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

// Page Skeleton
export function PageSkeleton() {
  return (
    <div className="min-h-screen p-6">
      <Skeleton className="h-8 w-64 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ShopCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Form Skeleton
export function FormSkeleton({ fields = 5 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i}>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
      <Skeleton className="h-10 w-32 rounded-md mt-4" />
    </div>
  );
}

