export const LOOKUPS_ENDPOINTS = {
    root: "lookup",
    workplaces() {
        return `${this.root}/workplaces`;
    },
    urgencyTypes() {
        return `${this.root}/urgency_types`;
    },
    damageTypes() {
        return `${this.root}/damage_types`;
    },
};
