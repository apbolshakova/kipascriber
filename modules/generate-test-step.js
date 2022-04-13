import { updateEndpointsConfig, updateTextsConfig } from './config-update.mjs';

/**
 * @param {string} stepData - description of step
 * @param {Config} config
 * @param {number} testStepsIndent - number of indents to offset step action code
 */

const VISIT_ACTION_REGEX = /^Перейти на ([\w:/._\-]+)$/i;
const SCROLL_PAGE_ACTION_REGEX = /^Пролистать страницу (наверх|вниз|влево|вправо|в центр)$/i;
const CONTAINS_TEXT_SELECTION_REGEX = /элемент с текстом "(.+)"/i;

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

    const elementSelectionCommand = generateElementSelectionCommand(stepDescription, config, testStepsIndent);

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

function generateElementSelectionCommand(stepDescription, config, testStepsIndent) {
    const selectionCommand = generateSelectionCommand(stepDescription, config);
    const offsetCommand = generateOffsetCommand(stepDescription);

    return selectionCommand + (offsetCommand && '\r\n' + testStepsIndent + '  ' + offsetCommand);
}

function generateSelectionCommand(stepDescription, config) {
    const pageObject = tryToGetPageObject(stepDescription, config);

    if (pageObject) {
        return `cy.get(PageObject.${pageObject})`;
    }

    if (isContainsTextSelection(stepDescription)) {
        return generateContainsTextCommand(stepDescription, config);
    }

    if (stepDescription.includes(' чекбокс')) {
        return `.find('[type="checkbox"]')`;
    }

    if (stepDescription.includes(' радиокнопк')) {
        return `.find('[type="radio"]')`;
    }

    if (stepDescription.includes(' текстовое поле')) {
        return `.find('[type="text"]')`;
    }
}

function tryToGetPageObject(stepDescription, config) {
    let pageObjectName = null;
    Object.entries(config.pageObjects).some(([name, pageObject]) =>
      pageObject.keywords.some((keyword) => {
          if (stepDescription.includes(keyword)) {
              pageObjectName = name;
              return true;
          }
          return false;
      }));
    return pageObjectName;
}

function isContainsTextSelection(stepDescription) {
    return CONTAINS_TEXT_SELECTION_REGEX.test(stepDescription);
}

function generateContainsTextCommand(stepDescription, config) {
    const text = CONTAINS_TEXT_SELECTION_REGEX.exec(stepDescription)[1];
    const textName = updateTextsConfig(config, text);
    return `cy.contains(Text.${textName})`;
}

function generateOffsetCommand(stepDescription) {
    if (stepDescription.includes(' перв')) {
        return '.first()';
    }

    if (stepDescription.includes(' последн')) {
        return '.last()';
    }

    if (stepDescription.includes(' элемент перед')) {
        return '.prev()';
    }

    if (stepDescription.includes(' элемент после')) {
        return '.next()';
    }
}
