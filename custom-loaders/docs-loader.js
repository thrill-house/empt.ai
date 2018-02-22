var markdown = require('markdown').markdown

module.exports = function (source, map) {
  this.callback(null, 'module.exports = function(Component) {Component.options.__docs = ' + JSON.stringify(markdown.toHTML(source)) + ' }', map)
}