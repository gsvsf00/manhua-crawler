const { PDFDocument } = require('pdf-lib');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

async function createPDFFromImages(imgList, pdfFileName) {
    // Create a folder with the same name as the PDF file
    const folderName = path.basename(pdfFileName, path.extname(pdfFileName));
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
    createPDFFromImages
}
