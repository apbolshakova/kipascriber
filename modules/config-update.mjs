export function updatePageObjectsConfig(config) {
}

export function updateStateClassesConfig(config) {
}

export function updateEndpointsConfig(config, url) {
    const endpointName = getUniquePropertyName(config.endpoints, url);
    config.endpoints[endpointName] = url;
    return endpointName;
}

export function updateTextsConfig(config) {
}

function getUniquePropertyName(configParams, dataString) {
    const propertyName = [...dataString.match(/\b(\w+)\b/g)]
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
