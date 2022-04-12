import fs from 'fs';

/**
 * @param {string} suiteFileName
 * @param {Object.<string, PageObject>} pageObjects
 * @param {Object.<string, StateClass>} stateClasses
 * @param {string} testSuiteName - data from 'Тест-сьют' section
 * @param {string} inputBeforeEachData - data from 'Перед каждым тестом' section
 * @param {string} inputTestsData - data from tests section
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

    specFileContent += '})';

    fs.writeFile(`${suiteFileName}.spec.js`, specFileContent, err => {
        if (err) {
            return console.log(err);
        }
        console.log('Success!');
    });
}

function generateBeforeEachBlock(inputBeforeEachData, pageObjects, stateClasses) {
    let beforeEachBlock = '    beforeEach(() => {';
    beforeEachBlock += generateTestSteps(inputBeforeEachData, pageObjects, stateClasses);
    beforeEachBlock += '    })\r\n\r\n';

    return beforeEachBlock;
}

function generateTestSteps(inputBeforeEachData, pageObjects, stateClasses) {
    const testStepsIndent = ' '.repeat(8);

    return testStepsIndent +
      inputBeforeEachData.split('\r\n')
                         .map((stepData) => generateTestStep(stepData, pageObjects, stateClasses))
                         .join('\r\n' + testStepsIndent) + '\r\n';
}

function generateTestStep(stepData, pageObjects, stateClasses) {
    // TODO implement
}
