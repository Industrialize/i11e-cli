const path = require('path');

// get and check arguments for robot options
var argv = require('minimist')(process.argv.slice(2));

if (argv._.length == 0) {
  process.exit(1);
}

// get the robot file
var robotPath = argv._[0];
if (!path.isAbsolute(robotPath)) {
  robotPath = path.join(process.cwd(), robotPath);
}
var Robot = require(robotPath);

// init the robot
var robot = new Robot(argv);

if (argv.g) {
  require('./lib/graphics')(robot);
} else {
  // require('./lib/cli')(robot);
}
