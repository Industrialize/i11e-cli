module.exports = (logFunc) => {
  var info = console.log;

  function args2str (...args) {
    var ret = [];
    for (var i = 0; i < args.length; i++) {
      if (typeof args[i] === 'object' && typeof args[i] !== 'string') {
        ret.push(JSON.stringify(args[i], null, 2));
      } else if (typeof args[i] === 'string') {
        ret.push(args[i]);
      }
    }
    return ret.join('');
  }

  console.info = function(...args) {
    var msg = args2str.apply(this, args);
    var lines = msg.split('\n');
    for (var line of lines) {
     logFunc(`[INFO] ${line}`);
    }
  }

  console.warn = function(...args) {
    var msg = args2str.apply(this, args);
    var lines = msg.split('\n');
    for (var line of lines) {
      logFunc(`[WARN] ${line}`);
    }
  }

  console.error = function(...args) {
    var msg = args2str.apply(this, args);
    var lines = msg.split('\n');
    for (var line of lines) {
      logFunc(`[ERRO] ${line}`);
    }
  }
}
