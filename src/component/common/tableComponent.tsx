import React, { FC, useEffect } from 'react'
import { Box, Card, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { Link } from 'react-router-dom';
import { TableComponentProps, Column, Row, CustomTableCellProps, RenderIfProps } from '../../Interface/tableProps';

const returnLink = (row: Row, column: Column, onColumnClick: (row: Row, column: Column) => string) => (
  <Link
    role="button"
    className='linkTableCell'
    data-testid="table-column-click"
    to={onColumnClick(row, column)} >
    {row[column.id] as React.ReactNode}
  </Link>
);

const CustomTableCell:React.FC<CustomTableCellProps> = ({
  row,
  column,
  onColumnClick,
}) => {
  if (column.hasColumnClick && typeof onColumnClick === 'function') {
    return returnLink(row, column, onColumnClick);
  }   return <>{row[column.id] as React.ReactNode}</>;
};


const RenderIf: FC<RenderIfProps> = ({ children, isTrue }) => (isTrue ? <>{children}</> : null);


const TableComponent: FC<TableComponentProps> = ({ columns, rows, title, cardHandle, onColumnClick, initialOrder = 'asc', isLoading, initialOrderBy = '', hideHeader, link }) => {

  const [localRows, setLocalRows] = React.useState(Array.isArray(rows) ? [...rows] : []);

  useEffect(() => {
    if (Array.isArray(rows)) {
      setLocalRows(rows.map((row) => ({ ...row, isEditMode: false })));
    }
  }, [rows]);

  return (
    <Box>
      <Card className="table-card" sx={{ p: 0 }}>
        <Box>
          <Box className="table-header">
            <Typography className="table-heading">
              {title}
            </Typography>
          </Box>
          <Box>
            <TableContainer className="table">
              <Table>
                <RenderIf isTrue={!hideHeader}>
                  <TableHead className="tableHeader">
                    <TableRow>
                      {columns?.map((column) => {
                        if (column.isHidden) return null;
                        const columnProps: Partial<{ width: string | number }> = {};
                        if (column.width) columnProps.width = column.width;
                        return (
                          <TableCell
                            key={column.id}
                            className="table-header"
                          >
                            <Box>{column.displayName}</Box>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                </RenderIf>

                <RenderIf isTrue={!isLoading}>
                  <TableBody>
                    {localRows.map((row, index: number) => (
                      <TableRow key={row.id}>
                        {columns?.map((column, i: number) => {
                          if (column.isHidden) return null;
                          const columnProps:Partial<{ width: string | number }> = {};
                          if (column.width) columnProps.width = column.width;
                          const isClickable = index === 0;
                          return (
                            <TableCell
                              key={`${row.id}${i}`}
                              align={
                                column.isAlignRight || column.priceColumn || column.isWooCommerceCurrency
                                  ? 'right'
                                  : column.isCenterAlign
                                    ? 'center'
                                    : 'left'
                              }
                              {...columnProps}
                            >
                              {isClickable ? (
                                <Link to={link || '#'} style={{ textDecoration: 'none', fontSize: '14px', fontWeight: 400, color: "#005F54" }}>
                                  <CustomTableCell {...{ row, column, onColumnClick }} />
                                </Link>
                              ) : (
                                <CustomTableCell {...{ row, column, onColumnClick }} />
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}

                    {localRows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={columns?.length}>No records found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </RenderIf>
              </Table>
              <RenderIf isTrue={isLoading}>
                <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '100px' }}>
                  <CircularProgress />
                </Box>
              </RenderIf>
            </TableContainer>
          </Box>
        </Box>
      </Card >
    </Box >
  )
}

export default TableComponent