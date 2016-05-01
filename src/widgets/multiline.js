var blessed = require('blessed');

module.exports = (options = {}) => {
  var top = options.top || 0;
  var left = options.left || 0;
  var width = options.width || 16;
  var height = options.height || 8;
  var title = options.title || 'Input text:';
  var defaultValue = options.default || '';

  var box = blessed.box({
    top: top,
    left: left,
    width: width,
    height: height,
    border: {
      type: 'line',
      fg: 'blue'
    },
    style: {
      focus: {
        border: {
          fg: 'red'
        }
      }
    }
  });

  var title = blessed.box({
    parent: box,
    top: 0,
    left: 0,
    width: width - 2,
    height: 1,
    tags: true,
    content: title
  });


  var textarea = blessed.textarea({
    parent: box,
    top: 1,
    left: 0,
    width: width - 2,
    height: height -2,
    border: {
      type: 'line',
      fg: 'blue'
    },
    style: {
      focus: {
        border: {
          fg: 'red'
        }
      }
    },
    inputOnFocus: true,
    value: defaultValue
  });


  box.on('focus', (data) => {
    textarea.focus();
  });

  return box;
}
