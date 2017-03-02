
export class LocalStorageService {
    set(key: string, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    get(key: string) {
        return localStorage.getItem(key);
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }
}