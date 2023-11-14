const fs = require("fs");
const path = require("path");
const { translationsFolderName, targetFolderPath, outputFileName } = require('./config');

/**
 * Extracts translation keys from the specified file and adds them to the translation object.
 * @param {string} filePath - The path of the file to extract translation keys from.
 * @param {object} translations - The translation object to add the keys to.
 */
function extractTranslationsFromFile(filePath, translations) {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const regex = /(?<![a-zA-Z])t\(["'](.*?)["']\)/g;
    let match;

    while ((match = regex.exec(fileContents)) !== null) {
        const translationKey = match[1];
        translations[translationKey] = "";
    }
}


/**
 * Recursively processes files in the specified folder and extracts translation keys.
 * @param {string} folderPath - The path of the folder to process.
 * @param {object} translations - The translation object to add the keys to.
 */
const processFolder = (folderPath, translations) => {
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const isDirectory = fs.statSync(filePath).isDirectory();
        const type = path.extname(file);
        if (isDirectory && file !== translationsFolderName) {
            processFolder(filePath, translations);
        } else if (!isDirectory && (type === ".ts" || type === ".tsx" || type === ".js") || type === ".jsx") {
            extractTranslationsFromFile(filePath, translations);
        }
    }
};

/**
 * Main function.
 */
const main = () => {
    const translations = {};
    const outputFilePath = path.join(
        targetFolderPath,
        translationsFolderName,
        outputFileName
    );

    // Check the target folder
    if (!fs.existsSync(targetFolderPath)) {
        console.error(
            'The target folder does not exist. Please specify the correct path in the "config.js" file.'
        );
        return;
    }

    // Check output file name
    if (!outputFileName.endsWith(".json")) {
        console.error(
            'The output file name must end with ".json". Please specify the correct name in the "config.js" file.'
        );
        return;
    }

    // Check output file path
    if (fs.existsSync(outputFilePath)) {
        console.error(
            `The output file already exists. Please delete it before running the script again: ${outputFilePath}`
        );
        return;
    }

    // Recursively process files in the target folder.
    processFolder(targetFolderPath, translations);


    const jsonOutput = JSON.stringify(translations, null, 2);
    fs.writeFileSync(outputFilePath, jsonOutput, "utf8");
    console.log(`Translation keys have been written to ${outputFilePath}.`);
};

main();
