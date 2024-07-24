export default new (class {
    store: Record<string, string> = {};

    setItem = (key: string, val: string): void => {
        this.store[key] = val;
    };

    getItem = (key: string): string => this.store[key];

    removeItem = (key: string): void => {
        delete this.store[key];
    };

    clear = (): void => {
        this.store = {};
    };
})();
