module.exports = (Robot, datafile) => {
  const i11e = require('./dep').i11e;
  const _ = i11e.prodline;
  const Box = i11e.Box;


  var data = null;
  try {
    data = require(datafile);
  } catch (err) {
    console.error(`Fail! ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  }

  var robot = new Robot(datafile.options);
  _([new i11e.Box(data.input)])
      .robot(robot)
      .checkpoint(data.output)
      .doto((robot) => {
        console.log('output:')
        console.log(JSON.stringify(robot, null, 2));
      })
      .errors((err) => {
        failed++;
        console.error(`Fail! ${err.message}`);
        console.error(err.stack);
      })
      .drive((box) => {
        console.log('done');
      });

  process.exit(0);
}
