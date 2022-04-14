#!/usr/bin/env node
import { join, basename } from 'path';
import { readFile, readdirSync, statSync } from 'fs';
import { parseInputPageObjectData, parseInputStateClassData } from './modules/parse-input.mjs';
import { generateSpecFile } from './modules/generate-spec-file.mjs';
import { generateDataFile } from './modules/generate-data-file.mjs';

/**
 * @typedef PageObject
 * @type {object}
 * @property {string} xpath - object locator
 * @property {string[]} keywords - keywords that indicate to this object
 */

/**
 * @typedef StateClass
 * @type {object}
 * @property {string} className - CSS-class
 * @property {string[]} keywords - keywords that indicate to this class
 */

/**
 * @typedef Config
 * @type {object}
 * @property {Object.<string, PageObject>} pageObjects - dictionary of PageObjects
 * @property {Object.<string, StateClass>} stateClasses - dictionary of StateClasses
 * @property {Object.<string, string>} endpoints - dictionary of Endpoints
 * @property {Object.<string, string>} texts - dictionary of Texts
 */

function main() {
    const SUITE_FILE_EXTENSION = '.suite.txt';
    const suiteFiles = getFilesByExtension('.', SUITE_FILE_EXTENSION);

    suiteFiles.forEach((suiteFilePath) => {
        const suiteFileName = basename(suiteFilePath, SUITE_FILE_EXTENSION);
        console.log(suiteFileName + ' suite found...');
        readFile(suiteFilePath, 'utf8', function (err, data) {
            if (err) return console.log(err);
            handleInputData(suiteFileName, data);
        });
    });
}

function getFilesByExtension(dir, extn, files, result, regex) {
    files = files || readdirSync(dir);
    result = result || [];
    regex = regex || new RegExp(`\\${extn}$`);

    for (let i = 0; i < files.length; i++) {
        let file = join(dir, files[i]);
        if (statSync(file).isDirectory()) {
            try {
                result = getFilesByExtension(file, extn, readdirSync(file), result, regex);
            } catch (error) {
            }
        } else {
            if (regex.test(file)) {
                result.push(file);
            }
        }
    }
    return result;
}

function handleInputData(suiteFileName, data) {
    const [inputPageObjectData, inputStateClassData, testSuiteName, inputBeforeEachData, ...inputTestsData] =
      data.split('\r\n\r\n')
          .map(getDataWithoutHeadingOrNull);

    /** @type {Config} */
    const configs = {
        pageObjects: parseInputPageObjectData(inputPageObjectData),
        stateClasses: parseInputStateClassData(inputStateClassData),
        endpoints: {},
        texts: {},
    };

    generateSpecFile(suiteFileName, configs, testSuiteName, inputBeforeEachData, inputTestsData);
    generateDataFile(suiteFileName, configs);
}

function getDataWithoutHeadingOrNull(config) {
    const dataStartIndex = config.indexOf('\n');
    return dataStartIndex === -1 ? null : config.substring(dataStartIndex + 1);
}

main();
