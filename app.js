// Import necessary libraries
const express = require('express');
const fs = require('fs');
const { PDFDocument, rgb, drawText } = require('pdf-lib');
const path = require('path');

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// File path for the pre-defined PDF
const predefinedPdfPath = path.join(__dirname, 'public', 'template.pdf');

// Serve HTML for the app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle PDF editing without requiring upload
app.post('/edit-pdf', async (req, res) => {
  try {
    // Load the predefined PDF
    const existingPdfBytes = fs.readFileSync(predefinedPdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Replace fields with user-provided data
    const { date, Cust_name, Cust_Area, Cust_City, Cust_pin, WGstInr,Month,Year,discount,discountType } = req.body;
    let {weight} = req.body;
    weight_adj = parseFloat(weight);
    const WGstInrD = (WGstInr/1).toFixed(2);
    const PreGstInr = (WGstInr / 1.18).toFixed(2);
    const WGstpkg = (WGstInr / weight_adj).toFixed(2);
    const Pregstpkg = (WGstInr / (1.18*weight_adj)).toFixed(2);
   
    let DPregstpkg=0,DWGstpkg=0,DPreGstInr=0,DWGstInr=0,FPregstpkg=0,FWGstpkg=0,FPreGstInr=0,FWGstInr=0
   
    if (discountType === "perKg") {
      DPregstpkg = (discount/1).toFixed(2);
      DWGstpkg = (DPregstpkg*1.18).toFixed(2);
      DPreGstInr = (DPregstpkg*weight_adj).toFixed(2);
      DWGstInr = (DWGstpkg*weight_adj).toFixed(2);

  } else if (discountType === "full") {
      DWGstInr = (discount/1).toFixed(2);
      DPreGstInr = (DWGstInr/1.18).toFixed(2);
      DWGstpkg = (DWGstInr/weight_adj).toFixed(2);
      DPregstpkg = (DWGstpkg/1.18).toFixed(2);
  }
  FPregstpkg = (Pregstpkg - DPregstpkg).toFixed(2);
  FWGstpkg = (WGstpkg - DWGstpkg).toFixed(2) ;
  FPreGstInr = (PreGstInr - DPreGstInr).toFixed(2);
  FWGstInr = (WGstInrD - DWGstInr).toFixed(2);

    // Draw white rectangles to cover existing text
    firstPage.drawRectangle({ x: 505, y: 689, width: 200, height: 15, color: rgb(1, 1, 1) }); // Date
    firstPage.drawRectangle({ x: 36, y: 652, width: 600, height: 12.5, color: rgb(1, 1, 1) }); // Cust_name
    firstPage.drawRectangle({ x: 36, y: 637, width: 600, height: 12, color: rgb(1, 1, 1) }); // Cust_Area
    firstPage.drawRectangle({ x: 36, y: 621, width: 600, height: 20, color: rgb(1, 1, 1) }); // Custcity and pincode
    firstPage.drawRectangle({ x: 208, y: 415, width: 50, height: 12, color: rgb(1, 1, 1) });// table
    firstPage.drawRectangle({ x: 208, y: 397, width: 50, height: 12, color: rgb(1, 1, 1) });
    firstPage.drawRectangle({ x: 208, y: 379, width: 50, height: 12, color: rgb(1, 1, 1) });
    firstPage.drawRectangle({ x: 308, y: 415, width: 50, height: 12, color: rgb(1, 1, 1) });
    firstPage.drawRectangle({ x: 308, y: 397, width: 50, height: 12, color: rgb(1, 1, 1) });
    firstPage.drawRectangle({ x: 308, y: 379, width: 50, height: 12, color: rgb(1, 1, 1) });
    firstPage.drawRectangle({ x: 408, y: 415, width: 50, height: 12, color: rgb(1, 1, 1) });
    firstPage.drawRectangle({ x: 408, y: 397, width: 50, height: 12, color: rgb(1, 1, 1) });
    firstPage.drawRectangle({ x: 408, y: 379, width: 50, height: 12, color: rgb(1, 1, 1) });
    firstPage.drawRectangle({ x: 493, y: 415, width: 50, height: 12, color: rgb(1, 1, 1) });
    firstPage.drawRectangle({ x: 493, y: 397, width: 50, height: 12, color: rgb(1, 1, 1) });
    firstPage.drawRectangle({ x: 493, y: 379, width: 50, height: 12, color: rgb(1, 1, 1) });
    firstPage.drawRectangle({ x: 36, y: 470, width: 80, height: 13, color: rgb(1, 1, 1) }); // moth&year
    firstPage.drawRectangle({ x: 142, y: 442, width: 35, height: 12, color: rgb(1, 1, 1) });
    firstPage.drawRectangle({ x: 70, y: 430, width: 80, height: 9, color: rgb(1, 1, 1) });

    // Write new data
    firstPage.drawText(date, { x: 505, y: 689, size: 11, color: rgb(0, 0, 0) });
    firstPage.drawText(Cust_name + ",", { x: 37, y: 652, size: 12, color: rgb(0, 0, 0) });
    firstPage.drawText(Cust_Area + ",", { x: 37, y: 637, size: 12, color: rgb(0, 0, 0) });
    firstPage.drawText(Cust_City + " - "+Cust_pin, { x: 37, y: 622, size: 12, color: rgb(0, 0, 0) });
    firstPage.drawText(Month+" "+ Year, { x: 37, y: 473, size: 11, color: rgb(0, 0, 0) });
    firstPage.drawText(WGstInrD, { x: 493, y: 415, size: 12, color: rgb(0, 0, 0) });
    firstPage.drawText(PreGstInr, { x: 408, y: 415, size: 12, color: rgb(0, 0, 0) });
    firstPage.drawText(WGstpkg, { x: 325, y: 415, size: 12, color: rgb(0, 0, 0) });
    firstPage.drawText(Pregstpkg, { x: 220, y: 415, size: 12, color: rgb(0, 0, 0) });
    firstPage.drawText(DWGstInr, { x: 500, y: 397, size: 12, color: rgb(0, 0, 0) });
    firstPage.drawText(DPreGstInr, { x: 415, y: 397, size: 12, color: rgb(0, 0, 0) });
    firstPage.drawText(DWGstpkg, { x: 330, y: 397, size: 12, color: rgb(0, 0, 0) });
    firstPage.drawText(DPregstpkg, { x: 225, y: 397, size: 12, color: rgb(0, 0, 0) });
    firstPage.drawText(FWGstInr, { x: 493, y: 381, size: 12, color: rgb(0, 0, 0) });
    firstPage.drawText(FPreGstInr, { x: 408, y: 381, size: 12, color: rgb(0, 0, 0) });
    firstPage.drawText(FWGstpkg, { x: 325, y: 381, size: 12, color: rgb(0, 0, 0) });
    firstPage.drawText(FPregstpkg, { x: 223, y: 381, size: 12, color: rgb(0, 0, 0) });
    firstPage.drawText(weight,{ x: 50, y: 431, size: 12, color: rgb(0, 0, 0) });

    // Save the updated PDF
    const updatedPdfBytes = await pdfDoc.save();
    const updatedPdfPath = path.join(__dirname, 'uploads', 'updated-template.pdf');
    fs.writeFileSync(updatedPdfPath, updatedPdfBytes);

    // Send the updated PDF back
    res.download(updatedPdfPath, `${Cust_name}_quotation_${Month}${Year}.pdf`);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while processing the PDF.');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 
