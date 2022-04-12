import fs from 'fs';
import { generateTestStep } from './generate-test-step.js';

/**
 * @param {string} suiteFileName
 * @param {Object.<string, PageObject>} pageObjects
 * @param {Object.<string, StateClass>} stateClasses
 * @param {string} testSuiteName - data from 'Тест-сьют' section
 * @param {string} inputBeforeEachData - data from 'Перед каждым тестом' section
 * @param {string[]} inputTestsData - data from tests section
 */
export function generateSpecFile(
  suiteFileName, pageObjects, stateClasses,
  testSuiteName, inputBeforeEachData, inputTestsData) {
    let specFileContent =
      `import {PageObject, StateClass, Endpoint, Text} from '${suiteFileName}.data'\r\n\r\n` +
      `describe('${testSuiteName}', () => {\r\n`;

    if (inputBeforeEachData) {
        specFileContent += generateBeforeEachBlock(inputBeforeEachData, pageObjects, stateClasses);
    }

    inputTestsData.forEach((inputTestData) =>
      specFileContent += generateTestBlock(inputTestData, pageObjects, stateClasses));

    specFileContent = specFileContent.substring(0, specFileContent.length - 2); // Delete extra newline
    specFileContent += '})';

    fs.writeFile(`${suiteFileName}.spec.js`, specFileContent, err => {
        if (err) {
            return console.log(err);
        }
        console.log('Success!');
    });
}

function generateBeforeEachBlock(inputBeforeEachData, pageObjects, stateClasses) {
    let beforeEachBlock = '    beforeEach(() => {\r\n';
    beforeEachBlock += generateTestSteps(inputBeforeEachData.split('\r\n'), pageObjects, stateClasses);
    beforeEachBlock += '    })\r\n\r\n';
    return beforeEachBlock;
}

function generateTestBlock(inputTestData, pageObjects, stateClasses) {
    const splitTestData = inputTestData.split('\r\n');
    const testTitle = splitTestData.shift();

    let testBlock = `    it('${testTitle}', () => {\r\n`;
    testBlock += generateTestSteps(splitTestData, pageObjects, stateClasses);
    testBlock += '    })\r\n\r\n';
    return testBlock;
}

function generateTestSteps(inputBeforeEachData, pageObjects, stateClasses) {
    const testStepsIndent = ' '.repeat(8);
    return testStepsIndent +
      inputBeforeEachData.filter((stepData) => !!stepData)
                         .map((stepData) => generateTestStep(stepData, pageObjects, stateClasses, testStepsIndent))
                         .join('\r\n' + testStepsIndent);
}
