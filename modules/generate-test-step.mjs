import { updateEndpointsConfig, updateTextsConfig } from './config-update.mjs';

const VISIT_ACTION_REGEX = /^Перейти на ([\w:/._\-]+)$/i;
const SCROLL_PAGE_ACTION_REGEX = /^Пролистать страницу (наверх|вниз|влево|вправо|в центр)$/i;
const CONTAINS_TEXT_SELECTION_REGEX = /элемент с текстом "(.+)"/i;
const CHECK_ACTION_REGEX = /^Проверить/i;
const ATTR_CHECK_REGEX = /(не )?цвета ([\w\d#().,% \-]+)$/i;
const VALUE_CHECK_REGEX = /(не )?значение "(.+)"$/i;
const TEXT_CHECK_REGEX = /(не )?текст "(.+)"$/i;
const LENGTH_CHECK_REGEX = /(не )?(\d+) штук/i;
const CHECKEDNESS_CHECK_REGEX = /(не )?отмечен/i;
const VISIBILITY_CHECK_REGEX = /что (не )?вид/i;
const SCROLL_TO_ACTION_REGEX = /^Пролистать (.+) (наверх|вниз|влево|вправо|в центр)$/i;
const SELECT_ACTION_REGEX = /^Выбрать опцию "(.+)"/i;
const TYPE_ACTION_REGEX = /ввести "(.+)"/i;

/**
 * @param {string} stepData - description of step
 * @param {Config} config
 * @param {number} testStepsIndent - number of indents to offset step action code
 */
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

    const subCommandIndent = testStepsIndent + ' '.repeat('cy'.length);
    const elementSelectionCommand = generateElementSelectionCommand(stepDescription, config, subCommandIndent);

    if (isCheckAction(stepDescription)) {
        return elementSelectionCommand + '\r\n' + subCommandIndent + generateCheckCommand(stepDescription, config);
    }

    return elementSelectionCommand + '\r\n' + subCommandIndent + generateActionCommand(stepDescription, config);
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

function generateElementSelectionCommand(stepDescription, config, subCommandIndent) {
    const selectionCommand = generateSelectionCommand(stepDescription, config);
    const offsetCommand = generateOffsetCommand(stepDescription);

    return selectionCommand + (offsetCommand ? '\r\n' + subCommandIndent + offsetCommand : '');
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
        return `cy.find('[type="checkbox"]')`;
    }

    if (stepDescription.includes(' радиокнопк')) {
        return `cy.find('[type="radio"]')`;
    }

    if (stepDescription.includes(' текстовое поле')) {
        return `cy.find('[type="text"]')`;
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

function isCheckAction(stepDescription) {
    return CHECK_ACTION_REGEX.test(stepDescription);
}

function generateCheckCommand(stepDescription, config) {
    const [stateClass, stateKeyword] = tryToGetStateClassAndKeyword(stepDescription, config);

    if (stateClass && stateKeyword) {
        return generateClassCheckCommand(stepDescription, config, stateClass, stateKeyword);
    }

    if (isAttrCheck(stepDescription)) {
        return generateAttrCheckCommand(stepDescription);
    }

    if (isValueCheck(stepDescription)) {
        return generateValueCheckCommand(stepDescription, config);
    }

    if (isTextCheck(stepDescription)) {
        return generateTextCheckCommand(stepDescription, config);
    }

    if (isLengthCheck(stepDescription)) {
        return generateLengthCheckCommand(stepDescription);
    }

    if (isCheckednessCheck(stepDescription)) {
        return generateCheckednessCheckCommand(stepDescription);
    }

    if (isVisibilityCheck(stepDescription)) {
        return generateVisibilityCheckCommand(stepDescription);
    }
}

function tryToGetStateClassAndKeyword(stepDescription, config) {
    let stateClassName = null;
    let stateKeyword = null;
    Object.entries(config.stateClasses).some(([name, stateClass]) =>
      stateClass.keywords.some((keyword) => {
          if (stepDescription.endsWith(keyword)) {
              stateClassName = name;
              stateKeyword = keyword;
              return true;
          }
          return false;
      }));
    return [stateClassName, stateKeyword];
}

function generateClassCheckCommand(stepDescription, config, stateClass, stateKeyword) {
    const isNot = stepDescription.endsWith(`не ${stateKeyword}`);
    return `.should('${isNot ? 'not.' : ''}have.class', StateClass.${stateClass})`;
}

function isAttrCheck(stepDescription) {
    return ATTR_CHECK_REGEX.test(stepDescription);
}

function generateAttrCheckCommand(stepDescription) {
    const isNot = !!ATTR_CHECK_REGEX.exec(stepDescription)[1];
    const color = ATTR_CHECK_REGEX.exec(stepDescription)[2];
    return `.should('${isNot ? 'not.' : ''}have.attr', 'style', 'color: ${color};')`;
}

function isValueCheck(stepDescription) {
    return VALUE_CHECK_REGEX.test(stepDescription);
}

function generateValueCheckCommand(stepDescription, config) {
    const isNot = !!VALUE_CHECK_REGEX.exec(stepDescription)[1];
    const text = VALUE_CHECK_REGEX.exec(stepDescription)[2];
    const textName = updateTextsConfig(config, text);
    return `.should('${isNot ? 'not.' : ''}have.value', Text.${textName})`;
}

function isTextCheck(stepDescription) {
    return TEXT_CHECK_REGEX.test(stepDescription);
}

function generateTextCheckCommand(stepDescription, config) {
    const isNot = !!TEXT_CHECK_REGEX.exec(stepDescription)[1];
    const text = TEXT_CHECK_REGEX.exec(stepDescription)[2];
    const textName = updateTextsConfig(config, text);
    return `.should('${isNot ? 'not.' : ''}have.text', Text.${textName})`;
}

function isLengthCheck(stepDescription) {
    return LENGTH_CHECK_REGEX.test(stepDescription);
}

function generateLengthCheckCommand(stepDescription) {
    const isNot = !!LENGTH_CHECK_REGEX.exec(stepDescription)[1];
    const length = LENGTH_CHECK_REGEX.exec(stepDescription)[2];
    return `.should('${isNot ? 'not.' : ''}have.length', ${length})`;
}

function isCheckednessCheck(stepDescription) {
    return CHECKEDNESS_CHECK_REGEX.test(stepDescription);
}

function generateCheckednessCheckCommand(stepDescription) {
    const isNot = !!CHECKEDNESS_CHECK_REGEX.exec(stepDescription)[1];
    return `.should('${isNot ? 'not.' : ''}be.checked')`;
}

function isVisibilityCheck(stepDescription) {
    return VISIBILITY_CHECK_REGEX.test(stepDescription);
}

function generateVisibilityCheckCommand(stepDescription) {
    const isNot = !!VISIBILITY_CHECK_REGEX.exec(stepDescription)[1];
    return `.should('${isNot ? 'not.' : ''}be.visible')`;
}

function generateActionCommand(stepDescription, config) {
    if (isScrollToAction(stepDescription)) {
        return generateScrollToCommand(stepDescription);
    }

    if (stepDescription.startsWith('Пролистать страницу')) {
        return '.scrollIntoView()';
    }

    if (stepDescription.startsWith('Дважды кликнуть')) {
        return '.dblclick()';
    }

    if (stepDescription.startsWith('Кликнуть правой кнопкой')) {
        return '.rightclick()';
    }

    if (stepDescription.startsWith('Кликнуть')) {
        return '.click()';
    }

    if (stepDescription.startsWith('Отметить')) {
        return '.check()';
    }

    if (stepDescription.startsWith('Снять отметку')) {
        return '.uncheck()';
    }

    if (stepDescription.startsWith('Очистить текст')) {
        return '.clear()';
    }

    if (stepDescription.startsWith('Установить фокус')) {
        return '.focus()';
    }

    if (stepDescription.startsWith('Снять фокус')) {
        return '.blur()';
    }

    if (stepDescription.startsWith('Отправить')) {
        return '.submit()';
    }

    if (isSelectAction(stepDescription)) {
        return generateSelectCommand(stepDescription, config);
    }

    if (isTypeAction(stepDescription)) {
        return generateTypeCommand(stepDescription, config);
    }
}

function isScrollToAction(stepDescription) {
    return SCROLL_TO_ACTION_REGEX.test(stepDescription);
}

function generateScrollToCommand(stepDescription) {
    const direction = SCROLL_TO_ACTION_REGEX.exec(stepDescription)[2];
    return `.scrollTo('${mapDescriptionToDirection(direction)}')`;
}

function isSelectAction(stepDescription) {
    return SELECT_ACTION_REGEX.test(stepDescription);
}

function generateSelectCommand(stepDescription, config) {
    const text = SELECT_ACTION_REGEX.exec(stepDescription)[1];
    const textName = updateTextsConfig(config, text);
    return `.select(Text.${textName})`;
}

function isTypeAction(stepDescription) {
    return TYPE_ACTION_REGEX.test(stepDescription);
}

function generateTypeCommand(stepDescription, config) {
    const text = TYPE_ACTION_REGEX.exec(stepDescription)[1];
    const textName = updateTextsConfig(config, text);
    return `.type(Text.${textName})`;
}
