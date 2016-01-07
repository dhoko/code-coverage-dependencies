var chalk = require('chalk');

function render(list) {

  var msg = ['', chalk.black.bgWhite.bold(' ~ Dependencies per file ~ '), ''];

  Object
    .keys(list)
    .forEach(function (key) {

      if (list[key].length) {
        msg.push(chalk.magenta(key) + ':')

        list[key]
          .forEach(function (dep) {
            msg.push('    # ' + dep.name)
          });
        msg.push('')

      }
    });

  console.log(msg.join('\n'))
}

module.exports = render;
