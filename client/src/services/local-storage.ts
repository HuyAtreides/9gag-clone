/** Provides functions for working with local storage. */
export namespace LocalStorage {
    export function save(key: string, item: Object): void {
        localStorage.setItem(key, JSON.stringify(item));
    }

    export function remove(key: string): void {
        localStorage.removeItem(key);
    }

    export function get(key: string): Object | null {
        const value = localStorage.getItem(key);

        if (value !== null) {
            return JSON.parse(value);
        }

        return null;
    }
}
