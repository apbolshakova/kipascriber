#!/usr/bin/env node
import fs from 'fs';
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
