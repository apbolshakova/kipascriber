import { updateEndpointsConfig } from './config-update.mjs';
/**
 * @param {string} stepData - description of step
 * @param {Config} config
 * @param {number} testStepsIndent - number of indents to offset step action code
 */

const VISIT_ACTION_REGEX = /^Перейти на ([\w:/._\-]+)$/i;

export function generateTestStep(stepData, config, testStepsIndent) {
    if (!stepData.length) return '';

    const step = 'cy.log(`' + stepData + '`)\r\n';
    const stepDescription = stepData.substring(stepData.indexOf('-') + 1).trim();

    return step + testStepsIndent +
      generateStepAction(stepDescription, config, testStepsIndent) + '\r\n';
}

function generateStepAction(stepDescription, config, testStepsIndent) {
    if (isVisitAction(stepDescription)) {
        return generateVisitCommand(stepDescription, config);
    }

    // if (isScrollPageAction()) {
    //     return generateScrollPageCommand();
    // }
    //
    // const elementSelectionCommand = generateElementSelectionCommand();
    //
    // if (isCheckAction()) {
    //     return elementSelectionCommand + generateCheckCommand();
    // }
    //
    // return elementSelectionCommand + generateActionCommand();
}

function isVisitAction(stepDescription) {
    return VISIT_ACTION_REGEX.test(stepDescription);
}

function generateVisitCommand(stepDescription, config) {
    const url = VISIT_ACTION_REGEX.exec(stepDescription)[1];
    const endpointName = updateEndpointsConfig(config, url);
    return endpointName;
}
