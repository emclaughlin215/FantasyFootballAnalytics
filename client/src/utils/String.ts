import { capitalize } from 'lodash';

export function capitaliseSentence(text: string, splitter: string): string {
  let splitText = text.split(splitter);
  splitText = splitText.map((t) => capitalize(t));
  return splitText.join(' ');
}

export function numberAbbreviator(number: number): string {
  if (number > 1000000000) {
    return (number / 1000000000).toString() + 'G';
  } else if (number > 1000000) {
    return (number/1000000).toString() + 'M';
  } else if (number > 1000) {
    return (number/1000).toString() + 'K';
  } else {
    return number.toString();
  }
}


export function numberFormatter(number: number): string {
  if (number < 1000) {
    return number.toString();
  }
  let numberArray = number.toString();
  let formattedNumber = '';
  while (numberArray.length > 3) {
    formattedNumber = "," + numberArray.slice(numberArray.length - 3) + formattedNumber;
    numberArray = numberArray.slice(0, numberArray.length - 3);
  }
  return numberArray.slice(numberArray.length - 3) + formattedNumber;
}
