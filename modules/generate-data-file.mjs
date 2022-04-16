import fs from 'fs';

const INDENT = ' '.repeat(2);

/**
 * @param {string} suiteFileName
 * @param {string} dirName
 * @param {Config} config
 */
export function generateDataFile(suiteFileName, dirName, config) {
    let dataFileContent =
      generatePageObjectData(config.pageObjects) +
      generateStateClassData(config.stateClasses) +
      generateEndpointData(config.endpoints) +
      generateTextData(config.texts);

    fs.writeFile(`${dirName}\\${suiteFileName}.data.js`, dataFileContent, err => {
        if (err) {
            return console.log(err);
        }
        console.log('.data file generation success!');
    });
}

function generatePageObjectData(pageObjects) {
    let dataContent = 'export const PageObject = {\r\n';
    Object.entries(pageObjects)
          .forEach(([name, pageObject]) =>
            dataContent +=
              `${INDENT}${name}: '${pageObject.xpath}', // ${pageObject.keywords.join('|')}\r\n`);
    dataContent += '}\r\n\r\n';
    return dataContent;
}

function generateStateClassData(stateClasses) {
    let dataContent = 'export const StateClass = {\r\n';
    Object.entries(stateClasses)
          .forEach(([name, stateClass]) =>
            dataContent +=
              `${INDENT}${name}: '${stateClass.className}', // ${stateClass.keywords.join('|')}\r\n`);
    dataContent += '}\r\n\r\n';
    return dataContent;
}

function generateEndpointData(endpoints) {
    let dataContent = 'export const Endpoint = {\r\n';
    Object.entries(endpoints)
          .forEach(([name, endpoint]) => dataContent += `${INDENT}${name}: '${endpoint}',\r\n`);
    dataContent += '}\r\n\r\n';
    return dataContent;
}

function generateTextData(texts) {
    let dataContent = 'export const Text = {\r\n';
    Object.entries(texts)
          .forEach(([name, text]) => dataContent += `${INDENT}${name}: '${text}',\r\n`);
    dataContent += '}\r\n\r\n';
    return dataContent;
}
