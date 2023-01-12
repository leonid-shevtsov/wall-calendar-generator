import { readFileSync } from "fs";
import jsPDF from "jspdf";

export const calendarFont = "e-Ukraine Head";

export default function addFontsToDoc(doc: jsPDF) {
  const font = readFileSync("fonts/e-UkraineHead-Thin.ttf", {
    encoding: "base64",
  });
  doc.addFileToVFS("e-UkraineHead-Thin.ttf", font);
  doc.addFont("e-UkraineHead-Thin.ttf", calendarFont, "normal");
  const boldFont = readFileSync("fonts/e-UkraineHead-Bold.ttf", {
    encoding: "base64",
  });
  doc.addFileToVFS("e-UkraineHead-Bold.ttf", boldFont);
  doc.addFont("e-UkraineHead-Bold.ttf", calendarFont, "bold");
}
