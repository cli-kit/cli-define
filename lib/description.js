var utils = require('cli-util')
  , rtrim = utils.rtrim
  , markzero = require('markzero')
  , Parser = markzero.Parser
  , TextRenderer = markzero.TextRenderer
  , lexer = new markzero.Lexer()
  , renderer = new TextRenderer;

/**
 *  Encapsulates a string represented as markdown and plain text.
 */
function Description(md) {
  this.parse(md);
}

Description.prototype.parse = function(md) {
  //if(append && this.md) {
    //md = this.md = (this.md + md);
  //}else{
  //}
  this.md = '' + md;
  var tokens = lexer.lex(md);
  var parser = new Parser({renderer: renderer});
  this.txt = rtrim(parser.parse(tokens));
}

//Description.prototype.concat = function(md) {
  //this.parse(md, true);
//}

Description.prototype.toString = function() {
  return this.txt;
}

module.exports = Description;
