module.exports = (Robot) => {
  const i11e = require('./dep').i11e;
  const _ = i11e.prodline;
  const Box = i11e.Box;

  var examples = Robot.examples();

  var total = 0;
  var failed = 0;
  for (var example in examples) {
    process.stdout.write(`${example}: `);
    var robot = new Robot(examples[example].options);
    total++;
    _([new i11e.Box(examples[example].input)])
        .robot(robot)
        .checkpoint(examples[example].output)
        .errors((err) => {
          failed++;
          console.error(`Fail! ${err.message}`);
          console.error(err.stack);
        })
        .drive((box) => {
          console.log('done');
        });
  }
  console.log();
  console.log(`fail: ${failed}, pass: ${total-failed}, total: ${total}`)

  if (failed === 0) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}
