export const RETIRES = Date.parse('2026-12-26T18:00:00Z');
export function available(now=Date.now()){return now < RETIRES;}
