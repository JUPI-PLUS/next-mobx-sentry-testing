export const EMAILS_ENDPOINTS = {
    root: "emails",
    list(uuid: string) {
        return `${this.root}/user/${uuid}`;
    },
    item(uuid: string) {
        return `${this.root}/${uuid}`;
    },
    setPrimary(uuid: string) {
        return `${this.item(uuid)}/set_primary`;
    },
};
