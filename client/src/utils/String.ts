import { capitalize } from 'lodash';

export function capitaliseSentence(text: string): string {
  let splitText = text.split(' ');
  splitText = splitText.map((t) => capitalize(t));
  return splitText.join(' ');
}