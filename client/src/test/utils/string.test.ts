import { capitaliseSentence } from '../../utils/String';

test("Capitalise Sentence Test", () => {
  expect(capitaliseSentence("good morning")).toBe("Good Morning");
  expect(capitaliseSentence("Good morning")).toBe("Good Morning");
  expect(capitaliseSentence("good, morning?!")).toBe("Good, Morning?!");
})