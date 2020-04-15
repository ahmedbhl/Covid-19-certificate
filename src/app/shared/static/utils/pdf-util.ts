import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export class PdfUtil {
    public static async createPdf() {
        const pdfDoc = await PDFDocument.create();
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        const fontSize = 30;
        page.drawText('Gnerae the pdf file', {
            x: 50,
            y: height - 4 * fontSize,
            size: fontSize,
            font: timesRomanFont,
            color: rgb(0, 0.53, 0.71),
        });

        const pdfBytes = await pdfDoc.save();
    }

}
