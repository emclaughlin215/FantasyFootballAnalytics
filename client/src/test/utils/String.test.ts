import { capitaliseSentence, numberAbbreviator, numberFormatter } from '../../utils/String';

test("Capitalise Sentence Test", () => {
  expect(capitaliseSentence("good morning", ' ')).toBe("Good Morning");
  expect(capitaliseSentence("Good_morning", '_')).toBe("Good Morning");
  expect(capitaliseSentence("good, morning?!", ' ')).toBe("Good, Morning?!");
})

test("Number Abbreviator", () => {
  expect(numberAbbreviator(2000)).toBe("2K");
  expect(numberAbbreviator(200000)).toBe("200K");
  expect(numberAbbreviator(2000000)).toBe("2M");
  expect(numberAbbreviator(2000000000)).toBe("2G");
})

test("Number Formatter", () => {
  expect(numberFormatter(2000)).toBe("2,000");
  expect(numberFormatter(200000)).toBe("200,000");
  expect(numberFormatter(2000000)).toBe("2,000,000");
  expect(numberFormatter(2000000000)).toBe("2,000,000,000");
})
