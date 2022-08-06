import sum from "./sum";

export default (text: string, phrase: string) => {
  const textWords = text.toLocaleLowerCase().split(" ");
  const phraseWords = phrase.toLocaleLowerCase().split(" ");

  const wordIndex = textWords.findIndex((word, i) => word !== phraseWords[i]);
  if (wordIndex === -1) return text;

  const highlightIndex = sum(
    textWords
      .slice(0, wordIndex + 1)
      .map((curr, i) =>
        curr.startsWith(phraseWords[i]) ? phraseWords[i].length : 0
      ),
    wordIndex
  );

  const [normal, bold] = [
    text.slice(0, highlightIndex),
    text.slice(highlightIndex),
  ];
  return [
    normal ? <span key={`${text}normal`}>{normal}</span> : null,
    bold ? <b key={`${text}bold`}>{bold}</b> : null,
  ];
};
