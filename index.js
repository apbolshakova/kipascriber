#!/usr/bin/env node
import fs from 'fs';
import {
    parseInputPageObjectData,
    parseInputStateClassData,
} from './functions/parse-input.mjs';
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

fs.readFile('todo.suite.txt', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    handleInputData(data);
});

function handleInputData(data) {
    const [inputPageObjectData, inputStateClassData, testSuiteName, inputBeforeEachData, ...inputTestsData] =
      data.split('\r\n\r\n')
          .map((config) => config.substring(config.indexOf('\n') + 1));

    const pageObjects = parseInputPageObjectData(inputPageObjectData);
    const stateClasses = parseInputStateClassData(inputStateClassData);

    generateSpecFile(pageObjects, stateClasses, testSuiteName, inputBeforeEachData, inputTestsData);
    generateDataFile(pageObjects, stateClasses);
}
