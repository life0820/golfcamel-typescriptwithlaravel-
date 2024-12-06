export const useDebounce = (callback: any, wait: number) => {
    let timeoutId: any = null;
    return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            callback(...args);
        }, wait);
    };
}
