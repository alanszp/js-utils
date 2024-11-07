import { get } from "lodash";

export function formatTable(
  headers: unknown,
  rows: unknown,
  rowProperty?: string
): string {
  if (
    !Array.isArray(headers) ||
    !Array.isArray(rows) ||
    rows.some((r) => !Array.isArray(r)) ||
    headers.length === 0 ||
    rows.length === 0 ||
    rows.some((r) => r.length > headers.length)
  ) {
    throw new Error("formatTable: Invalid input");
  }

  const mappedRows =
    rows.every((r) => r.every((c) => typeof c === "object")) &&
    rowProperty &&
    typeof rowProperty === "string"
      ? rows.map((r) => r.map((c) => get(c, rowProperty)))
      : rows;

  const columnWidths = headers.map((header, i) => {
    return Math.max(header.length, ...mappedRows.map((row) => row[i].length));
  });

  const headerRow = headers.map((header, i) => {
    return header.padEnd(columnWidths[i]);
  });

  const separatorRow = columnWidths.map((width) => "-".repeat(width));

  const bodyRows = mappedRows.map((row) => {
    return row.map((cell, i) => {
      return cell.padEnd(columnWidths[i]);
    });
  });

  return [headerRow, separatorRow, ...bodyRows]
    .map((row) => row.join(" | "))
    .join("\n");
}
