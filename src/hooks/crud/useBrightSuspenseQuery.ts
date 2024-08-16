import { QueryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { BrightBaseCRUD, BrightBaseCRUDTableRecord } from "src"

export default function useBrightSuspenseQuery<
  T extends BrightBaseCRUDTableRecord
>(
  table: BrightBaseCRUD<T>,
  params: Parameters<typeof table.read>,
  queryOptions?: QueryOptions
) {
  return useSuspenseQuery({
    ...queryOptions,
    queryKey: [table.name, ...params],
    queryFn: () => table.read(...params),
  })
}
