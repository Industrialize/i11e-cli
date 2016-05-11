const path = require('path');

function printUsage() {
  console.log('Usage: i11e [entity] [location] [options]');
  console.log('entity: could be robot, pipeline, or factory');
  console.log('location: entity path');
  console.log('options:');
  console.log(' g: graphic interface');
  console.log(' t: run tests');
  console.log(' d: the data file used to run the entity');
}


// get and check arguments for robot options
var argv = require('minimist')(process.argv.slice(2));

if (argv._.length == 0) {
  printUsage();
  process.exit(1);
}

// get the entity

var entity = argv._[0];

if (!entity || (entity !== 'robot' && entity !== 'pipeline' && entity !== 'factory')) {
  printUsage();
  process.exit(1);
}

// get the robot file
var robotPath = argv._[1];
if (!path.isAbsolute(robotPath)) {
  robotPath = path.join(process.cwd(), robotPath);
}
var Robot = require(robotPath);

// init the robot
var robot = new Robot(argv);

if (argv.g) {
  require('./lib/graphics')(robot);
} else if (argv.t) {
  require('./lib/test')(Robot);
} else if (argv.d) {
  require('./lib/datafile')(Robot, argv.d);
} else {
  printUsage();
  process.exit(0);
}
