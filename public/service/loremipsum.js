const { LoremIpsum } = require('lorem-ipsum');

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

const sentence = (num = 3) => {
  return lorem.generateSentences(num);
};
const paragraph = (num = 3) => {
  return lorem.generateParagraphs(num);
};

const loremIpsum = (kind, num = 3) => {
  let numb = Number(num);
  if (numb > 100) {
    numb = 100;
  }
  if (kind === 'paragraph') {
    return paragraph(numb);
  }
  return sentence(numb);
};

module.exports = loremIpsum;
