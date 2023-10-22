import fs from "fs";
import path from "path";
import { translationsFolderName, targetFolderPath, outputFileName } from "./config.js";

/**
 * Extracts translation keys from the specified file and adds them to the translation object.
 * @param {string} filePath - The path of the file to extract translation keys from.
 * @param {object} translations - The translation object to add the keys to.
 */
function extractTranslationsFromFile(filePath, translations) {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const regex = /t\(["'](.*?)["']\)/g;
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

        if (isDirectory && file !== translationsFolderName) {
            processFolder(filePath, translations);
        } else if (!isDirectory && path.extname(file) === ".ts") {
            extractTranslationsFromFile(filePath, translations);
        }
    }
};

/**
 * Main function.
 */
const main = () => {
    const translations = {};

    // Check the target folder
    if (!fs.existsSync(targetFolderPath)) {
        console.error(
            'The target folder does not exist. Please specify the correct path in the "config.js" file.'
        );
        return;
    }

    // Recursively process files in the target folder.
    processFolder(targetFolderPath, translations);

    const outputFilePath = path.join(
        targetFolderPath,
        translationsFolderName,
        outputFileName
    );
    const jsonOutput = JSON.stringify(translations, null, 2);
    fs.writeFileSync(outputFilePath, jsonOutput, "utf8");
};

main();
