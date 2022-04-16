export function updateEndpointsConfig(config, url) {
    const endpointName = getUniquePropertyName(config.endpoints, url);
    config.endpoints[endpointName] = url;
    return endpointName;
}

export function updateTextsConfig(config, text) {
    const textName = getUniquePropertyName(config.texts, text);
    config.texts[textName] = text;
    return textName;
}

function getUniquePropertyName(configParams, dataString) {
    const NAME_FOR_NUMBERS_PROPERTY = 'number';
    const propertyName = [...(dataString.match(/\b([A-Za-zА-Яа-я]\w*)\b/g) ?? [NAME_FOR_NUMBERS_PROPERTY])]
      .map((word) => word[0].toUpperCase() + word.substring(1))
      .join('');

    let additionalIndex = '';
    if (configParams[propertyName]) {
        let paramFound = false;
        do {
            if (configParams[propertyName + additionalIndex] === dataString) {
                paramFound = true;
                return propertyName + additionalIndex;
            }
            additionalIndex = ++additionalIndex;
        } while (configParams[propertyName + additionalIndex]);
    }
    return propertyName + additionalIndex;
}
