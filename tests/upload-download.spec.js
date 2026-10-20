const {test, expect} = require('@playwright/test');
const ExcelJs = require('exceljs');
const path = require('path');

const filePath = path.join(__dirname, 'download.xlsx');

async function writeExcelTest(searchText, replaceText, filePath) {
    const workbook = new ExcelJs.Workbook();

    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet('Sheet1');

    if (!worksheet) {
        throw new Error('Sheet1 not found');
    }

    const output = readExcel(worksheet, searchText);

    if (output.row === -1) {
        throw new Error(`${searchText} not found in Excel`);
    }

    const cell = worksheet.getCell(output.row, output.column);
    cell.value = replaceText;

    await workbook.xlsx.writeFile(filePath);

    console.log(`Replaced ${searchText} with ${replaceText}`);
}

function readExcel(worksheet, searchText) {
    let output = { row: -1, column: -1 };

    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
            if (cell.value === searchText) {
                output.row = rowNumber;
                output.column = colNumber;
            }
        });
    });

    return output;
}

test.skip('Upload Download Excel Validation', async ({page})=>{
    await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole('button', {name : 'Download'}).click();
    await downloadPromise;

    writeExcelTest("Apple", "Iphone", filePath);

    await page.locator("#fileinput").click();
    await page.locator("#fileinput").setInputFiles(filePath);
});
