import { updateEndpointsConfig } from './config-update.mjs';

/**
 * @param {string} stepData - description of step
 * @param {Config} config
 * @param {number} testStepsIndent - number of indents to offset step action code
 */

const VISIT_ACTION_REGEX = /^Перейти на ([\w:/._\-]+)$/i;
const SCROLL_PAGE_ACTION_REGEX = /^Пролистать страницу (наверх|вниз|влево|вправо|в центр)$/i;

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

    if (isScrollPageAction(stepDescription)) {
        return generateScrollPageCommand(stepDescription);
    }

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
    return `cy.visit(Endpoint.${endpointName})`;
}

function isScrollPageAction(stepDescription) {
    return SCROLL_PAGE_ACTION_REGEX.test(stepDescription);
}

function generateScrollPageCommand(stepDescription) {
    const direction = SCROLL_PAGE_ACTION_REGEX.exec(stepDescription)[1];
    return `cy.scrollTo('${mapDescriptionToDirection(direction)}')`;
}

function mapDescriptionToDirection(dirDescription) {
    switch (dirDescription) {
        case 'наверх':
            return 'top';
        case 'вниз':
            return 'bottom';
        case 'влево':
            return 'left';
        case 'вправо':
            return 'right';
        case 'в центр':
            return 'center';
    }
}
