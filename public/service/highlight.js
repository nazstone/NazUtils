const hljs = require('highlight.js/lib/core');
hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'));
hljs.registerLanguage('html', require('highlight.js/lib/languages/xml'));
hljs.registerLanguage('json', require('highlight.js/lib/languages/json'));
hljs.registerLanguage('yaml', require('highlight.js/lib/languages/yaml'));
hljs.registerLanguage('css', require('highlight.js/lib/languages/css'));
hljs.registerLanguage('scss', require('highlight.js/lib/languages/scss'));
hljs.registerLanguage('less', require('highlight.js/lib/languages/less'));
hljs.registerLanguage('markdown', require('highlight.js/lib/languages/markdown'));
hljs.registerLanguage('babel', require('highlight.js/lib/languages/javascript'));
hljs.registerLanguage('sql', require('highlight.js/lib/languages/sql'));

const highlight = (value, kind) => {
  try {
    return hljs.highlight(value, { language: kind }).value;
  } catch (error) {
    return value;
  }
};

module.exports = highlight;
