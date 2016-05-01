var blessed = require('blessed');

module.exports = function logo(options) {
  var top = options.top || 0;
  var left = options.left || 0;

  var box = blessed.box({
    top: options.top,
    left: options.left,
    width: options.width || 16,
    height: options.height || 3,
    tags: true,
    // border: {
    //   type: 'line',
    //   fg: 'blue'
    // },
    // style: {
    //   focus: {
    //     border: {
    //       fg: 'red'
    //     }
    //   }
    // }
  });

  var buf = [];

  buf.push('{black-fg}{white-bg} BHOU {/white-bg}{/black-fg}');
  buf.push('{white-fg}{red-bg} STUDIO {/red-bg}{/white-fg}');

  box.setContent(
    buf.join('')
  );

  return box;
}
