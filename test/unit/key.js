var path = require('path');
var expect = require('chai').expect;
var key = require('../..').key;

describe('cli-define:', function() {
  it('should get key from raw string (single element)', function(done) {
    var names = 'build-all';
    var k = key(names);
    expect(k).to.eql('buildAll');
    done();
  });
  it('should get key from delimited string (,)', function(done) {
    var names = 'build-all, ba';
    var k = key(names);
    expect(k).to.eql('buildAll');
    done();
  });
  it('should get key from delimited string ( )', function(done) {
    var names = 'build-all  ba';
    var k = key(names);
    expect(k).to.eql('buildAll');
    done();
  });
  it('should get key from delimited string (|)', function(done) {
    var names = 'build-all | ba';
    var k = key(names);
    expect(k).to.eql('buildAll');
    done();
  });
  it('should prefer longest identifier ( )', function(done) {
    var names = 'b ba build-all';
    var k = key(names);
    expect(k).to.eql('buildAll');
    done();
  });
  it('should prefer longest identifier (,)', function(done) {
    var names = 'b,ba,build-all';
    var k = key(names);
    expect(k).to.eql('buildAll');
    done();
  });
  it('should prefer longest identifier (|)', function(done) {
    var names = 'b|ba|build-all';
    var k = key(names);
    expect(k).to.eql('buildAll');
    done();
  });
  it('should get key from single array element', function(done) {
    var names = ['build-all'];
    var k = key(names);
    //console.dir(k);
    expect(k).to.eql('buildAll');
    done();
  });
  it('should get key from array of names', function(done) {
    var names = ['install', 'ins', 'i'];
    var k = key(names);
    expect(k).to.eql('install');
    done();
  });
})
