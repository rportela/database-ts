export function arraySlice(arr: any[], offset?: number, limit?: number) {
  if (!arr) return arr;
  else if (offset) {
    if (limit) return arr.slice(offset, Math.min(offset + limit, arr.length));
    else return arr.slice(offset, arr.length);
  } else if (limit) return arr.slice(0, Math.min(limit, arr.length));
  else return arr;
}
