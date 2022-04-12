#!/usr/bin/env node
import fs from 'fs';
import { parseInputPageObjectData, parseInputStateClassData } from './functions/parse-input.mjs';
import { generateSpecFile } from './functions/generate-spec-file.mjs';
import { generateDataFile } from './functions/generate-data-file.mjs';

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

const suiteFileName = 'todo';

fs.readFile(`${suiteFileName}.suite.txt`, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    handleInputData(suiteFileName, data);
});

function handleInputData(suiteFileName, data) {
    const [inputPageObjectData, inputStateClassData, testSuiteName, inputBeforeEachData, ...inputTestsData] =
      data.split('\r\n\r\n')
          .map(getDataWithoutHeadingOrNull);

    const pageObjects = parseInputPageObjectData(inputPageObjectData);
    const stateClasses = parseInputStateClassData(inputStateClassData);

    generateSpecFile(suiteFileName, pageObjects, stateClasses, testSuiteName, inputBeforeEachData, inputTestsData);
    generateDataFile(suiteFileName, pageObjects, stateClasses);
}

function getDataWithoutHeadingOrNull(config) {
    const dataStartIndex = config.indexOf('\n');

    return dataStartIndex === -1 ? null : config.substring(dataStartIndex + 1);
}
