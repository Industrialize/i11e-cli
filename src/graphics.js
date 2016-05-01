module.exports = (robot) => {
  const height = 7;

  const i11e = require('./dep').i11e;
  const _ = i11e.prodline;
  const Box = i11e.Box;
  var blessed = require('blessed');
  var contrib = require('blessed-contrib');
  var screen = blessed.screen({
    dockBorders: true,
    terminal: process.platform === 'win32' ? 'windows-ansi' : 'xterm',
    smartCSR: true
  });

  var grid = new contrib.grid({
    rows: 12,
    cols: 12,
    screen: screen
  });

  var log = grid.set(8, 0, 4, 12, contrib.log, {
    fg: "green",
    selectedFg: "green",
    label: 'Log'
  });
  require('./logger')(log.log.bind(log));

  var helpTxt = grid.set(0, 0, 1, 12, blessed.text, {
    align: 'left',
    content: 'Robot test board v0.1.0 - Keys - Ctrl+N: change focus;   Ctrl+R: run the robot;   Ctrl-e: edit input;   Ctrl-C: exit'
  });

  var input = grid.set(1, 0, height, 4, blessed.textarea, {
    label: 'Input',
    border: {
      type: 'line',
      fg: 'blue'
    },
    style: {
      border: {
        fg: 'blue'
      },
      focus: {
        border: {
          fg: 'green'
        }
      }
    },
    keys: true,
    vi: true,
    scrollable: true,
    value: ''
  });
  input.set('title', 'Input');

  var output = grid.set(1, 8, height, 4, blessed.textarea, {
    label: 'Output',
    style: {
      focus: {
        border: {
          fg: 'red'
        }
      }
    },
    scrollable: true,
    value: ''
  });

  var tree = grid.set(1, 4, height, 4, contrib.tree, {
    label: 'Output Tree View',
    fg: "blue"
  });
  tree.set('title', 'Output Tree View');

  function toTreeData(obj) {
    var node = {
      extended: true,
      children: {}
    };

    if (Array.isArray(obj)) {
      for (var key of obj) {
        node.children[key] = {children: {}}
      }
      return node;
    }

    if (typeof obj === 'string') {
      node.children[obj] = {children: {}}
      return node;
    }

    if (typeof obj !== 'object') {
      node.children['' + obj] = {children: {}}
      return node;
    }

    for (var key in obj) {
      node.children[key] = toTreeData(obj[key]);
    }

    return node;
  }

  var index = 0;
  input.focus();

  var widgets = [input, tree];

  function onNextFocus(ch, key) {
    index = (index + 1) % widgets.length;
    widgets[index].focus();
    screen.render();
  };
  for (var widget of widgets) {
    widget.key(['escape', 'C-n'], onNextFocus);
  }

  screen.key(['escape', 'C-n'], function(ch, key) {
    input.focus();
    screen.render();
  });

  screen.key(['C-c'], function(ch, key) {
    process.exit(0);
  });

  function run(ch, key) {
    var inputData = input.getValue();
    console.info('Input:', inputData);

    var inputObj = null;
    try {
      inputObj = JSON.parse(inputData);
    } catch (err) {
      console.error('input data is not a valid JSON object');
      console.error(err.message);
      return;
    }
    try {
      _([new i11e.Box(inputObj)])
      .robot(robot)
      .errors((err) => {
        console.error(`fail! ${err.message}`);
        console.error(err.stack);
      })
      .drive((box) => {
        var newBox = new Box(box);
        for (var key in newBox) {
          if (key.indexOf('_') == 0) {
            delete newBox[key];
          }
        }

        output.setContent(JSON.stringify(newBox, null, 2));
        tree.setData(toTreeData(newBox));
        screen.render();
      });
    } catch (err) {
      console.error(err.message);
      console.error(err.stack);
    }

  };

  function edit() {
    input.focus();
    input.readInput(()=>{});
  }

  screen.key('C-e', edit);
  tree.key('C-e', edit);

  screen.key(['C-r'], run);
  input.key(['C-r'], run);

  input.key(['C-c'], () => {
    process.exit(0);
  });

  screen.render();
}
