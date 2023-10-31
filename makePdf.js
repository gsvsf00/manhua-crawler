const { PDFDocument } = require('pdf-lib');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const { getPDFGenerationChoice } = require('./userInput.js');
const { filterImgFromCapContent } = require('./filterContent.js');

async function createPdfFromChoice(chaptersChoose, title) {
    let pdfGenerationChoice = ''; // Initialize the choice variable

    if (typeof chaptersChoose.chapter === 'number') {
        console.log("\nSingle chapter selected.\n");
        const imgList = await filterImgFromCapContent(chaptersChoose.links);
        const pdfFileName = `${title} - ${chaptersChoose.chapter}.pdf`;
        await createPDFFromImages(imgList, pdfFileName, title);
        return;
    } else if (chaptersChoose.chapter !== 'all') {
        chaptersChoose.length = chaptersChoose.chapter[1] - chaptersChoose.chapter[0] + 1;
        console.log("Length", chaptersChoose.length);
    }

    pdfGenerationChoice = await getPDFGenerationChoice();

    if (pdfGenerationChoice.toLowerCase() === 's') {
        for (let i = 0; i < chaptersChoose.length; i++) {
            const pdfFileName = `${title}_chapter_${i + 1}.pdf`;
            const selectedChapters = chaptersChoose.links[i]; // Use all chapters
            await createPDFFromImages(selectedChapters, pdfFileName);
        }
    } else if (pdfGenerationChoice.toLowerCase() === 'm') {
        const startChapter = chaptersChoose.chapter[0];
        const endChapter = chaptersChoose.chapter[1];
        const mergedPDFFileName = `${title} ${startChapter}-${endChapter}.pdf`;
        const mergedChapters = [];

        for (let i = startChapter - 1; i < endChapter; i++) {
            const imgList = await filterImgFromCapContent(chaptersChoose.links[i]);
            mergedChapters.push(...imgList);
        }

        await createPDFFromImages(mergedChapters, mergedPDFFileName, title);
    } else {
        console.log("Invalid PDF generation choice.");
        createPdfFromChoice(chaptersChoose, title);
    }
}

async function createPDFFromImages(imgList, pdfFileName, title) {
    
    const folderName = path.basename(title, path.extname(title));

    const folderPath = path.join(__dirname, folderName);

    if (!fs.existsSync(folderPath)) {
        await mkdir(folderPath);
    }

    const pdfDoc = await PDFDocument.create();

    for (const imgUrl of imgList) {
        try {
            const imageBytes = await axios.get(imgUrl, { responseType: 'arraybuffer' });
    
            if (imgUrl.endsWith('.jpg') || imgUrl.endsWith('.jpeg')) {
                // Process JPEG images
                const image = await pdfDoc.embedJpg(imageBytes.data);
                const page = pdfDoc.addPage([image.width, image.height]);
                const { width, height } = page.getSize();
                page.drawImage(image, {
                    x: 0,
                    y: 0,
                    width,
                    height,
                });
            } else if (imgUrl.endsWith('.png')) {
                // Process PNG images
                const image = await pdfDoc.embedPng(imageBytes.data);
                const page = pdfDoc.addPage([image.width, image.height]);
                const { width, height } = page.getSize();
                page.drawImage(image, {
                    x: 0,
                    y: 0,
                    width,
                    height,
                });
            } else {
                console.error(`Unsupported image format: ${imgUrl}`);
            }
        } catch (error) {
            console.error(`Error processing image: ${imgUrl}`);
            // Continue processing other images
            continue;
        }
    }

    const pdfBytes = await pdfDoc.save();
    const pdfPath = path.join(folderPath, pdfFileName);

    await writeFile(pdfPath, pdfBytes);

    console.log(`PDF file "${pdfFileName}" has been created in the folder "${folderName}".`);
}

module.exports = {
    createPDFFromImages,
    createPdfFromChoice
}