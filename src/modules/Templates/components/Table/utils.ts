export const getUuidFromDataset = (targetElement: HTMLElement): string => {
    const datasetUuid = targetElement.dataset?.uuid;
    if (datasetUuid) return datasetUuid;

    if (targetElement.parentElement) return getUuidFromDataset(targetElement.parentElement);
    return "";
};
