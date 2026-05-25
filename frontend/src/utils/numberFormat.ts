// amount is returned from backend as string
// first cast to Number
// then fix to 2 decimals as usual money formatting
export function formatMoney(value: number | string): string {
    return Number(value).toFixed(2);
}