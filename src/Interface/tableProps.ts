export interface TableComponentProps {
  columns?: Column[];
  rows?: Row[];
  searchProp?: string;
  title: string;
  cardLabel?: string;
  cardTooltipTitle?: string;
  cardHandle?: () => void;
  pagination?: {
      page: number;
      totalPage: number;
  };
  page?: number;
  tableName?: string;
  totalPage?: number;
  getQuery?: () => void;
  onColumnClick?: (row: Row, column: Column) => string; // Fixed type
  initialOrder?: 'asc' | 'desc';
  initialOrderBy?: string;
  isLoading?: boolean;
  hideHeader?: boolean;
  onEdit?: (row: Row) => void;
  onView?: (row: Row) => void;
  onMove?: (row: Row) => void;
  onMore?: (row: Row) => void;
  link?: string;
  inLineEdit?: boolean;
  onClickEdit?: (id: string | number) => void;
  onClickDelete?: (id: string | number) => void;
  onClickMore?: (id: string | number) => void;
  onClickAddNavigate?: (row: Row, schemaTitle: string) => void;
  onClickAddGrpNavigate?: (row: Row) => void;
  onClickAddDocNavigate?: (row: Row) => void;
  onClickAddUserNavigate?: (row: Row) => void; // Fixed type
  onClickChatNavigate?: (row: Row) => void;
  onClickPreview?: (row: Row) => void;
  onClickTemplate?: (id: string | number) => void;
  actionEditTooltip?: string;
  actionDeleteTooltip?: string;
  actionTempTooltip?: string;
  actionTooltip?: string;
  actionGrpTooltip?: string;
  actionDocTooltip?: string;
  actionUserTooltip?: string;
  actionChatTooltip?: string;
  actionPreviewTooltip?: string;
}

export interface Column {
  id: string;
  displayName: string;
  isHidden?: boolean;
  hasColumnClick?: boolean;
  width?: string | number;
  padding?: "checkbox" | "none" | "normal"; 
  isAlignRight?: boolean;
  priceColumn?: boolean;
  isWooCommerceCurrency?: boolean;
  isCenterAlign?: boolean;
}

export interface Row {
  id: string | number;
  [key: string]: unknown; // Removed displayName for flexibility
}

export interface CustomTableCellProps {
  row: Row;
  column: Column;
  onColumnClick?: (row: Row, column: Column) => string; // Fixed type
}

export interface RenderIfProps {
  children: React.ReactNode;
  isTrue?: boolean;
}
