import jsPDF from "jspdf";
import LuxonDate from "luxon-date";
import moment from "moment";
import holidays from "../holidays.json";
import { calendarFont } from "./addFontsToDoc";

const numRows = 10;
const numCols = 7;
export const cellsPerPage = numRows * numCols;
const cellWidth = 27;
const cellHeight = 24;
const headerHeight = 6;
const pageWidth = 210;
const pageHeight = 297;
const paddingX = (pageWidth - numCols * cellWidth) / 2;
const paddingY = (pageHeight - numRows * cellHeight - headerHeight) / 2;
const endX = pageWidth - paddingX;
const endY = pageHeight - paddingY;
const cellPaddingTop = 3;
const cellPaddingBottom = 2;
const cellPaddingLeft = 4;
const dayTextSize = 20;
const holidayOffset = 8;
const holidayTextSize = 8;
const monthTextSize = 10;
const weekdayTextSize = 10;
const headerPaddingTop = 1;
const baseLineWidth = 0.2;
const weekendLineWidth = 0.5;

moment.locale("uk");
const monthNames = moment
  .monthsShort()
  .map((m) => m.toLocaleUpperCase().replace(/\.$/, ""));
const weekdayNames = moment
  .weekdaysShort(true)
  .map((w) => w.toLocaleUpperCase());

export default function renderPage(
  doc: jsPDF,
  startDate: LuxonDate,
  startMonth: number
) {
  doc.setFont(calendarFont, "bold");
  doc.setFontSize(dayTextSize);
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      const date = startDate.plus({ days: i * numCols + j });

      const cellX = paddingX + j * cellWidth;
      const cellY = paddingY + headerHeight + i * cellHeight;

      const shadeDate = (24 + date.month - startMonth) % 2 === 1;
      if (shadeDate) {
        doc.setFillColor("#EEEEEE");
        doc.rect(cellX, cellY, cellWidth, cellHeight, "F");
      }

      const label = `${date.day}`;
      const x = cellX + cellPaddingLeft;
      const y = cellY + cellPaddingTop;

      doc.text(label, x, y, { baseline: "top" });
    }
  }

  doc.setFont(calendarFont, "normal");
  doc.setFontSize(holidayTextSize);
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      const date = startDate.plus({ days: i * numCols + j });
      const holiday = holidays[date.castToDB()];

      if (holiday) {
        const cellX = paddingX + j * cellWidth;
        const cellY = paddingY + headerHeight + i * cellHeight;
        const x = cellX + cellPaddingLeft;
        const y = cellY + cellPaddingTop + holidayOffset;
        doc.text(holiday, x, y, { baseline: "top" });
      }
    }
  }

  doc.setFont(calendarFont, "bold");
  doc.setFontSize(monthTextSize);
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      const date = startDate.plus({ days: i * numCols + j });
      if (date.day !== 1) {
        continue;
      }

      const x = paddingX + j * cellWidth + cellPaddingLeft;
      const y =
        paddingY + headerHeight + (i + 1) * cellHeight - cellPaddingBottom;

      doc.text(monthNames[date.month - 1], x, y, {
        baseline: "bottom",
      });
    }
  }

  doc.setFont(calendarFont, "normal");
  doc.setFontSize(weekdayTextSize);
  const headerLabelY = paddingY + headerPaddingTop;
  for (let i = 0; i < numCols; i++) {
    doc.setFillColor("#DDDDDD");
    doc.rect(paddingX + i * cellWidth, paddingY, cellWidth, headerHeight, "F");
    const x = paddingX + i * cellWidth + cellPaddingLeft;
    doc.text(weekdayNames[i], x, headerLabelY, { baseline: "top" });
  }

  // trace lines
  doc.setLineWidth(baseLineWidth);
  for (let i = 0; i <= numCols; i++) {
    const x = paddingX + i * cellWidth;
    doc.line(x, paddingY, x, endY);
  }

  for (let i = 0; i <= numRows; i++) {
    const y = paddingY + headerHeight + i * cellHeight;
    doc.line(paddingX, y, endX, y);
  }
  doc.line(paddingX, paddingY, endX, paddingY);

  doc.setLineWidth(weekendLineWidth);
  doc.line(paddingX + 5 * cellWidth, paddingY, paddingX + 5 * cellWidth, endY);
  doc.setLineWidth(baseLineWidth);
}
