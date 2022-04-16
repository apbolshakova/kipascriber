import fs from 'fs';
import { generateTestStep } from './generate-test-step.mjs';

const INDENT = ' '.repeat(2);

/**
 * @param {string} suiteFileName
 * @param {string} dirName
 * @param {Config} config
 * @param {string} testSuiteName - data from 'Тест-сьют' section
 * @param {string} inputBeforeEachData - data from 'Перед каждым тестом' section
 * @param {string[]} inputTestsData - data from tests section
 */
export function generateSpecFile(
  suiteFileName, dirName, config, testSuiteName, inputBeforeEachData,
  inputTestsData) {
    let specFileContent =
      `import { PageObject, StateClass, Endpoint, Text } from '${suiteFileName}.data'\r\n\r\n` +
      `describe(\`${testSuiteName}\`, () => {\r\n`;

    if (inputBeforeEachData) {
        specFileContent += generateBeforeEachBlock(inputBeforeEachData, config);
    }

    inputTestsData.forEach((inputTestData) =>
      specFileContent += generateTestBlock(inputTestData, config));

    specFileContent = specFileContent.substring(0, specFileContent.length - 2); // Delete extra newline
    specFileContent += '})';

    fs.writeFile(`${dirName}\\${suiteFileName}.spec.js`, specFileContent, err => {
        if (err) {
            return console.log(err);
        }
        console.log('.spec file generation success!');
    });
}

function generateBeforeEachBlock(inputBeforeEachData, config) {
    let beforeEachBlock = `${INDENT}beforeEach(() => {\r\n`;
    beforeEachBlock += generateTestSteps(inputBeforeEachData.split('\r\n'), config);
    beforeEachBlock += `${INDENT}})\r\n\r\n`;
    return beforeEachBlock;
}

function generateTestBlock(inputTestData, config) {
    const splitTestData = inputTestData.split('\r\n');
    const testTitle = splitTestData.shift();

    let testBlock = `${INDENT}it('${testTitle}', () => {\r\n`;
    testBlock += generateTestSteps(splitTestData, config);
    testBlock += `${INDENT}})\r\n\r\n`;
    return testBlock;
}

function generateTestSteps(inputBeforeEachData, config) {
    const testStepsIndent = INDENT.repeat(2);
    return testStepsIndent +
      inputBeforeEachData.filter((stepData) => !!stepData)
                         .map((stepData) => generateTestStep(stepData, config, testStepsIndent))
                         .join('\r\n' + testStepsIndent);
}
