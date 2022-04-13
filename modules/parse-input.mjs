/**
 * @param {string} inputPageObjectData - data from 'Объекты' section
 * @return {Object.<string, PageObject>} - dictionary of page objects
 */
export function parseInputPageObjectData(inputPageObjectData) {
    const NAME_DIVIDER = ':';
    const XPATH_DIVIDER = '//';
    const KEYWORD_DIVIDER = '|';

    const pageObjects = {};

    inputPageObjectData.split('\r\n').forEach((pageObjectData) => {
        const propName =
          pageObjectData.substring(0, pageObjectData.indexOf(NAME_DIVIDER))
                        .trim();
        const xpath =
          pageObjectData.substring(pageObjectData.indexOf(NAME_DIVIDER) + NAME_DIVIDER.length, pageObjectData.indexOf(XPATH_DIVIDER))
                        .trim();
        const keywords =
          pageObjectData.substring(pageObjectData.indexOf(XPATH_DIVIDER) + XPATH_DIVIDER.length)
                        .trim()
                        .split(KEYWORD_DIVIDER);

        pageObjects[propName] = {xpath, keywords};
    });

    return pageObjects;
}

/**
 * @param {string} inputStateClassData - data from 'Состояния' section
 * @return {Object.<string, StateClass>} - dictionary of page objects
 */
export function parseInputStateClassData(inputStateClassData) {
    const NAME_DIVIDER = ':';
    const CLASS_DIVIDER = '//';
    const KEYWORD_DIVIDER = '|';

    const stateClass = {};

    inputStateClassData.split('\r\n').forEach((stateClassData) => {
        const propName =
          stateClassData.substring(0, stateClassData.indexOf(NAME_DIVIDER))
                        .trim();
        const className =
          stateClassData.substring(stateClassData.indexOf(NAME_DIVIDER) + NAME_DIVIDER.length, stateClassData.indexOf(CLASS_DIVIDER))
                        .trim();
        const keywords =
          stateClassData.substring(stateClassData.indexOf(CLASS_DIVIDER) + CLASS_DIVIDER.length)
                        .trim()
                        .split(KEYWORD_DIVIDER);

        stateClass[propName] = {className, keywords};
    });

    return stateClass;
}
