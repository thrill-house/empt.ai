var md = require('markdown-it')();

module.exports = function (source, map) {
  this.callback(null, 'module.exports = function(Component) {Component.options.__docs = ' + JSON.stringify(md.render(source)) + ' }', map);
}