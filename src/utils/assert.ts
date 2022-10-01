
export function assert(expr: any, message?: string): asserts expr {
    if (!Boolean(expr)) {
        throw new Error(message || 'assertion error');
    }
}
