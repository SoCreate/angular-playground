import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'apHighlightSearchMatch', pure: false})
export class HighlightSearchMatchPipe implements PipeTransform {
  transform(value: string, indexMatches: number[], offset = 0): any {
    // Match null and undefined, but not 0 or ''
    if (value == null || indexMatches == null) {
      return value;
    }

    let transformedValue = '';
    let indexes = indexMatches.reduce((a, n) => n >= offset ? [...a, n - offset] : a, []);

    for (let i = 0; i < value.length; i++) {
      if (indexes.some(item => item === i)) {
        transformedValue += `<mark>${value[i]}</mark>`;
      } else {
        transformedValue += value[i];
      }
    }

    return transformedValue;
  }
}
