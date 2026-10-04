/** The project filters, kept in the URL query (`?q=&tag=`). */
export interface IWorkFilters {
  query: string;
  tags: ReadonlyArray<string>;
}
