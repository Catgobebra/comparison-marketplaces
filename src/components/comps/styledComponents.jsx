import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const DraggableTableRow = styled(StyledTableRow)(
  ({ theme, isdragging }) => ({
    cursor: isdragging === "true" ? "grabbing" : "grab",
    backgroundColor:
      isdragging === "true" ? theme.palette.action.selected : "inherit",
    opacity: isdragging === "true" ? 0.6 : 1,
    transition: "all 0.2s ease",
  })
);
