import { PDFDocument, StandardFonts } from 'pdf-lib';

export class PdfUtil {

    static async  generatePdf(profile, reasons, signature, generatedQR) {
        const creationDate = new Date().toLocaleDateString('fr-FR');
        const creationHour = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h');

        const releaseHours = String(profile.exitTime).substring(0, 2);
        const releaseMinutes = String(profile.exitTime).substring(3, 5);

        // Create a new PDFDocument
        const pdfDoc = await PDFDocument.create();

        // Embed the Times Roman font
        const fontText = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);


        // Add a blank page to the document
        const page = pdfDoc.addPage();

        const height = page.getSize().height - 70;
        const maxWidth = page.getSize().width - 140;

        const drawText = (text, x, y, size = 11) => {
            page.drawText(text, { x, y, size, font: fontText, maxWidth: maxWidth, lineHeight: 12 });
        };

        const svgPath = 'M 10 10 H 25 V 25 H 10 Z';
        const addCube = (x, y) => {
            page.drawSvgPath(svgPath, { x: (x - 13), y: height - (y - 23) });
        };

        const addCheckedCube = (x, y) => {
            page.drawSvgPath(svgPath, { x: (x - 13), y: height - (y - 23) });
            page.drawText('X', { x: x, y: height - y, size: 15 });
        };

        page.drawText('ATTESTATION DE DÉPLACEMENT DÉROCATOIRE', { x: 60, y: height, size: 20, font: timesRomanFont });
        drawText(`Je soussigné(e),`, 60, height - 60);
        drawText(`Mme/M. : ${profile.firstName} ${profile.lastName}`, 60, height - 90);
        drawText(`Né(e) le : ${profile.birthday}`, 60, height - 120);
        drawText(`À : ${profile.birthplace} `, 60, height - 150);
        drawText(`Demeurant : ${profile.address} ${profile.zip} ${profile.city}`, 60, height - 180);
        drawText(`Motifs :`, 60, height - 210);

        let customHeight = 40;
        await profile.reasonList.forEach((element, index) => {
            const xxx = (reasons[index].length / 90);
            customHeight = xxx <= 2 ? 40 : xxx * 15;
            element ? addCheckedCube(63, (243 + (index * customHeight))) : addCube(63, (243 + (index * customHeight)));
            drawText(`${reasons[index]}`, 90, height - (240 + (index * customHeight)));
        });

        if (profile.reasonList !== '') {
            drawText(`Fait à: ${profile.city}`, 70, height - 650);
            // Date sortie
            drawText(`Le: ${profile.exitDate} à ${releaseHours}h${releaseMinutes}`, 70, height - 670);
            drawText(`(Date et heure de début de sortie)`, 70, height - 690);
        }

        const signatureImage = await pdfDoc.embedPng(signature);
        page.drawImage(signatureImage, {
            x: 50,
            y: height - 750,
            width: 300,
            height: 50,
        });

        // Date création
        drawText('Date de création :', 464, height - 730, 7);
        drawText(`${creationDate} à ${creationHour}`, 455, height - 740, 7);

        const qrImage = await pdfDoc.embedPng(generatedQR);
        page.drawImage(qrImage, {
            x: page.getWidth() - 160,
            y: height - 710,
            width: 100,
            height: 100,
        });

        const page2 = pdfDoc.addPage();
        page2.drawImage(qrImage, {
            x: 50,
            y: page2.getHeight() - 350,
            width: 300,
            height: 300,
        });


        const pdfBytes = await pdfDoc.save();

        this._downloadBlob(new Blob([pdfBytes], { type: 'application/pdf' }), profile.exitDate);
    }


    private static _downloadBlob(blob, fileName) {
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
    }

}
