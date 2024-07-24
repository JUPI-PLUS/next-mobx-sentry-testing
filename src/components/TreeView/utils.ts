import { TemplatesTreeNode } from "./models";

const getPaths = (path: string) => {
    const currentId = path.substring(0, path.indexOf("."));
    const newPath = path.substring(path.indexOf(".") + 1);
    return [currentId, newPath];
};

const isLastChild = (newPath: string, foundLink: TemplatesTreeNode): boolean => {
    return !newPath.substring(0, newPath.indexOf(".")) && foundLink.child?.length === 1;
};

export const getNestedLvlByPath = (path: string): number => {
    return (path.match(/\./g)?.length || 0) + 1;
};

export const getLastUuidFromPath = (path: string): string => {
    return path.substring(path.lastIndexOf(".") + 1);
};

export const findLinkByPath = (data: Array<TemplatesTreeNode>, path: string): TemplatesTreeNode => {
    const [currentId, newPath] = getPaths(path);
    if (!currentId) {
        return data.find(item => item.uuid === newPath)!;
    } else {
        const foundLink = data.find(item => item.uuid === currentId)!;
        return findLinkByPath(foundLink.child!, newPath);
    }
};

export const deleteByPath = (data: Array<TemplatesTreeNode>, path: string): void => {
    const [currentId, newPath] = getPaths(path);
    if (!currentId) {
        const index = data.findIndex(item => item.uuid === newPath)!;
        data.splice(index, 1);
    } else {
        const foundLink: TemplatesTreeNode = data.find(item => item.uuid === currentId)!;
        if (isLastChild(newPath, foundLink)) {
            foundLink.child = undefined;
        } else {
            return deleteByPath(foundLink.child!, newPath);
        }
    }
};

export const cutByPath = (data: Array<TemplatesTreeNode>, path: string): TemplatesTreeNode | void => {
    const [currentId, newPath] = getPaths(path);
    if (!currentId) {
        const index = data.findIndex(item => item.uuid === newPath)!;
        return data.splice(index, 1)[0];
    } else {
        const foundLink: TemplatesTreeNode = data.find(item => item.uuid === currentId)!;
        if (isLastChild(newPath, foundLink)) {
            const index = foundLink.child!.findIndex(item => item.uuid === newPath)!;
            const childNode = foundLink.child!.splice(index, 1)[0];
            foundLink.child = undefined;
            return childNode;
        } else {
            return cutByPath(foundLink.child!, newPath);
        }
    }
};
