/**
 * @param {string} stepData - description of step
 * @param {Object.<string, PageObject>} pageObjects
 * @param {Object.<string, StateClass>} stateClasses
 * @param {number} testStepsIndent - number of indents to offset step action code
 */
export function generateTestStep(stepData, pageObjects, stateClasses, testStepsIndent) {
    if (!stepData.length) return '';

    const step = 'cy.log(`' + stepData + '`)\r\n';
    const stepDescription = stepData.substring(stepData.indexOf('-') + 1).trim();

    return step + testStepsIndent +
      generateStepAction(stepDescription, pageObjects, stateClasses, testStepsIndent) + '\r\n';
}

function generateStepAction(stepDescription, pageObjects, stateClasses, testStepsIndent) {
    if (isVisitAction(stepDescription)) {
        return generateVisitCommand();
    }

    if (isScrollPageAction()) {
        return generateScrollPageCommand();
    }

    const elementSelectionCommand = generateElementSelectionCommand();

    if (isCheckAction()) {
        return elementSelectionCommand + generateCheckCommand();
    }

    return elementSelectionCommand + generateActionCommand();
}

function isVisitAction(stepDescription) {
    const visitActionPattern = new RegExp(/^Перейти на [\w:/.]+$/i);
    return visitActionPattern.test(stepDescription);
}
