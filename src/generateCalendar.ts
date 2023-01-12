// @ts-ignore
global.window = {};

import jsPDF from "jspdf";
import { argv, stdout } from "process";
import LuxonDate from "luxon-date";
import addFontsToDoc from "./addFontsToDoc";
import renderPage, { cellsPerPage } from "./renderPage";

const startDate = LuxonDate.restoreFromDB(argv[2]);
const endDate = LuxonDate.restoreFromDB(argv[3]);

const doc = new jsPDF();
addFontsToDoc(doc);

const numPages = Math.ceil(endDate.diff(startDate, "days").days / cellsPerPage);

for (let pageNo = 0; pageNo < numPages; pageNo++) {
  if (pageNo > 0) {
    doc.addPage();
  }
  renderPage(
    doc,
    startDate.plus({ days: cellsPerPage * pageNo }),
    startDate.month
  );
}

const docText = doc.output("arraybuffer");

stdout.write(Buffer.from(docText));
