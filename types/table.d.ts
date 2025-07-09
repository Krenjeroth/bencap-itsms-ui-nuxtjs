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
    responsiveClass?: string;
  }

  interface IHandlers {
    create?: (row: any) => void;
    edit?: (row: any) => void;
    delete?: (row: any) => void;
    accept?: (row: any) => void;
    checkStock?: (row: any) => void;
    awaitPart?: (row: any) => void;
    resolve?: (row: any) => void;
    cancel?: (row: any) => void;
    reopen?: (row: any) => void;
    setServiceMethod?: (row: any) => void;
    setReleaseDate?: (row: any) => void;
    // Add other handler functions here if needed in the future
  }

  interface ITableActions {
    (row: ITableRow, handlers: Handlers): Array<
      Array<{ label: string; icon: string; click: () => any }>
    >;
  }

  interface ITableStatusOptions {
    key: string;
    label: string;
    value: any;
  }

  interface ITableExpandableDetails {
    (row: ITableRow): Array<{ key: string; label: string; value: any }>;
  }

  interface ITableTabItem {
    label: string;
    value: string;
    icon?: string;
  }
}

export {
  ITableRow,
  ITableColumns,
  ITableActions,
  IHandlers,
  ITableStatusOptions,
  ITableExpandableDetails,
  ITableTabItem,
};
