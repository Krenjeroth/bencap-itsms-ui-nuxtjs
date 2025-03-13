declare global {
  interface ITableRow {
    id: number | string;
    [key: string]: any; // for other dynamic properties
  }

  interface ITableColumns {
    key: string;
    label?: string;
    sortable?: boolean;
    direction?: "desc" | "asc" | undefined;
    class?: string;
    rowClass?: string;
  }

  interface ITableActions {
    (row: ITableRow, editUserModal: (target: any) => void): Array;
  }

  interface ITableStatusOptions {
    key: string;
    label: string;
    value: any;
  }
}

export { ITableRow, ITableColumns, TTableActions };
