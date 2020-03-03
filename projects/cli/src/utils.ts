import { readFileSync, writeFileSync } from 'fs';

export function delay(ms: number) {
  return new Promise(resolve => {
      setTimeout(() => {
          resolve();
      }, ms);
  });
}
