var assert = require('assert')
var env = require('../env')

var sm = env.create()

assert(sm.set('hello', 'world') === sm)
assert(sm.set('other', true) === sm)
assert(sm.get('hi') === null)
assert(sm.get('hello') === 'world')
var sm2 = sm.create()
var v = {world: true}
assert(sm2.set('hello', v) === sm2)
assert(sm2.get('other') === true)
assert(sm2.get('hello') === v)
assert(sm.get('hello') === 'world')
