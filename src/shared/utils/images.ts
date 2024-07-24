export const blobToBase64 = (blob: string) => {
    const base64WithoutTags = Buffer.from(blob, "binary").toString("base64");
    return `data:image/jpeg;base64,${base64WithoutTags}`;
};
