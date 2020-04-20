import { PDFDocument, StandardFonts } from 'pdf-lib';

export class PdfUtil {
    /* public static async createPdf(message: string) {
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

     public static async embedPdfPages(message: any, img: any) {
         debugger
         const flagUrl = 'https://pdf-lib.js.org/assets/american_flag.pdf';
         const constitutionUrl = 'https://pdf-lib.js.org/assets/us_constitution.pdf';

         const flagPdfBytes = await fetch(flagUrl).then((res) => res.arrayBuffer());
         const constitutionPdfBytes = await fetch(constitutionUrl).then((res) =>
             res.arrayBuffer(),
         );

         const pdfDoc = await PDFDocument.create();

         const [americanFlag] = await pdfDoc.embedPdf(flagPdfBytes);

         const usConstitutionPdf = await PDFDocument.load(constitutionPdfBytes);
         const preamble = await pdfDoc.embedPage(usConstitutionPdf.getPages()[1], {
             left: 55,
             bottom: 485,
             right: 300,
             top: 575,
         });

       const americanFlagDims = americanFlag.scale(0.3);
         const preambleDims = preamble.scale(2.25);

        const page = pdfDoc.addPage();

         page.drawPage(americanFlag, {
             ...americanFlagDims,
             x: page.getWidth() / 2 - americanFlagDims.width / 2,
             y: page.getHeight() - americanFlagDims.height - 150,
         });
         page.drawPage(preamble, {
             ...preambleDims,
             x: page.getWidth() / 2 - preambleDims.width / 2,
             y: page.getHeight() / 2 - preambleDims.height / 2 - 50,
         });

         const pdfBytes = await pdfDoc.save();

   }

     public static async  modifyPdf() {
         const url = 'https://pdf-lib.js.org/assets/with_update_sections.pdf'
         const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());

         const pdfDoc = await PDFDocument.load(existingPdfBytes);
         const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

   const pages = pdfDoc.getPages();
         const firstPage = pages[0];
         const { width, height } = firstPage.getSize();
         firstPage.drawText('This text was added with JavaScript!', {
             x: 5,
             y: height / 2 + 300,
             size: 50,
             font: helveticaFont,
             color: rgb(0.95, 0.1, 0.1),
             rotate: degrees(-45),
         });

         const pdfBytes = await pdfDoc.save();
     }*/

    static async  generatePdf(profile, generatedQR) {
        const creationDate = new Date().toLocaleDateString('fr-FR');
        const creationHour = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h');


        const releaseHours = String(profile.exitTime).substring(0, 2);
        const releaseMinutes = String(profile.exitTime).substring(3, 5);

        let data = [];
        data = [
            `Je soussigné(e),`,
            `Cree le: ${creationDate} a ${creationHour}`,
            `Mme/M.: ${profile.firstName} ${profile.lastName}`,
            `Né(e) le: ${profile.birthday}`,
            `À ${profile.birthplace} `,
            `Demeurant: ${profile.address} ${profile.zip} ${profile.city}`,
            `Motifs: ${profile.reasonList}`,
            `Fait à: ${profile.city}`,
            `Le: ${profile.exitDate} à ${releaseHours}h${releaseMinutes}`,
            `(Date et heure de début de sortie)`
        ];

        // Create a new PDFDocument
        const pdfDoc = await PDFDocument.create();

        // Embed the Times Roman font
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Add a blank page to the document
        const page = pdfDoc.addPage();

        const height = page.getSize().height - 40;

        page.drawText('ATTESTATION DE DÉPLACEMENT DÉROCATOIRE', { x: 60, y: height, size: 20 });

        const drawText = (text, x, y, size = 11) => {
            page.drawText(text, { x, y, size, font });
        };

        /*data.forEach((element, index) => {
            const h = (height - ((index + 1) * 20));
            drawText(`${element}`, 60, h);

        });*/

        drawText(`Je soussigné(e),`, 60, height - 10);
        drawText(`Cree le: ${creationDate} a ${creationHour}`, 60, height - 20);
        drawText(`Mme/M.: ${profile.firstName} ${profile.lastName}`, 60, height - 40);
        drawText(`Né(e) le: ${profile.birthday}`, 60, height - 30);
        drawText(`À ${profile.birthplace} `, 60, height - 50);
        drawText(`Demeurant: ${profile.address} ${profile.zip} ${profile.city}`, 60, height - 60);
        drawText(`Motifs: ${profile.reasonList}`, 60, height - 70);

        /* drawText(`${profile.firstName} ${profile.lastName}`, 123, 686);
         drawText(profile.birthday, 123, 661);
         drawText(profile.birthplace, 92, 638);
         drawText(`${profile.address} ${profile.zip} ${profile.city}`, 134, 613);*/

        if (profile.reasonList.includes('travail')) {
            drawText('x', 76, 527, 19);
        }
        if (profile.reasonList.includes('courses')) {
            drawText('x', 76, 478, 19);
        }
        if (profile.reasonList.includes('sante')) {
            drawText('x', 76, 436, 19);
        }
        if (profile.reasonList.includes('famille')) {
            drawText('x', 76, 400, 19);
        }
        if (profile.reasonList.includes('sport')) {
            drawText('x', 76, 345, 19);
        }
        if (profile.reasonList.includes('judiciaire')) {
            drawText('x', 76, 298, 19);
        }
        if (profile.reasonList.includes('missions')) {
            drawText('x', 76, 260, 19);
        }
        /*   let locationSize = idealFontSize(font, profile.city, 83, 7, 11);
   
           if (!locationSize) {
               alert('Le nom de la ville risque de ne pas être affiché correctement en raison de sa longueur. ' +
                   'Essayez d\'utiliser des abréviations ("Saint" en "St." par exemple) quand cela est possible.')
               locationSize = 7
           }
   
           drawText(profile.city, 111, 226, locationSize)*/

        if (profile.reasonList !== '') {
            drawText(`Fait à: ${profile.city}`, 70, height - 580);
            // Date sortie
            drawText(`Le: ${profile.exitDate} à ${releaseHours}h${releaseMinutes}`, 70, height - 600);
            drawText(`(Date et heure de début de sortie)`, 70, height - 610);
        }

        // Date création
        drawText('Date de création:', 464, 150, 7);
        drawText(`${creationDate} à ${creationHour}`, 455, 144, 7);

        /* const qrImage = await pdfDoc.embedPng(generatedQR);
 
         page.drawImage(qrImage, {
             x: page.getWidth() - 170,
             y: 155,
             width: 100,
             height: 100,
         });
 
         pdfDoc.addPage();
         const page2 = pdfDoc.getPages()[1];
         page2.drawImage(qrImage, {
             x: 50,
             y: page2.getHeight() - 350,
             width: 300,
             height: 300,
         });*/

        const pdfBytes = await pdfDoc.save();

        this._downloadBlob(new Blob([pdfBytes], { type: 'application/pdf' }), 'pdf');
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
