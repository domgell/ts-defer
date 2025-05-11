/**
 * Attaches `[Symbol.dispose]` to `obj` to call the `defer` callback at the end of this scope.
 * ```ts
 * using file = deferred(openFile(), f => f.close());
 * ...
 * // `f.close()` is called at the end of the scope
 * ```
 * @param obj Object to attach `[Symbol.dispose]` to
 * @param fn Function to call at the end of the scope
 * @returns Input object with the `[Symbol.dispose]` property
 */
export function deferred<T extends object>(obj: T, fn: (obj: T) => void): T & Disposable {
    obj[Symbol.dispose] = () => fn(obj);
    return obj as T & Disposable;
}

/**
 * Creates a new disposable instance which will call all callbacks at the end of this scope (in reverse order).
 * ```ts
 * using defer = Defer();
 * 
 * const file = openFile();
 * defer(() => file.close());
 * ...
 * // `file.close()` is called at the end of the scope
 * ```
 * @constructor
 * @returns Instance with `[Symbol.dispose]`. 
 * 
 * Add a callback by calling the instance with that callback as an input.
 */
export function Defer(): ((fn: () => void) => void) & Disposable {
    const stack = new Array<() => void>();
    const obj = (fn: () => void) => stack.push(fn);

    obj[Symbol.dispose] = () => {
        while (stack.length > 0) {
            const fn = stack.pop()!;
            fn();
        }
    };

    return obj;
}