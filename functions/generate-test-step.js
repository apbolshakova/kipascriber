/**
 * @param {string} stepData - description of step
 * @param {Object.<string, PageObject>} pageObjects
 * @param {Object.<string, StateClass>} stateClasses
 */
export function generateTestStep(stepData, pageObjects, stateClasses) {
    if (!stepData.length) return '';
    // TODO implement
    return 'cy.log(`' + stepData + '`)\r\n';
}
