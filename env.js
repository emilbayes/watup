// Env is a linked list currently, so each scope can have their own appends/set
module.exports = Env

function Env (depth, parent) {
  this.tail = parent
  this.map = new Map()
  // Used as an optimisation when walking the ast, so a new env can be created
  // only when new definitions appear. Ie. if(ast.depth > curEnv.depth) curEnv = curEnv.create()
  this.depth = depth
}

// Static method for creating the initial env
Env.create = function () {
  return new Env(0, null)
}

// Used for recursing
Env.prototype.create = function () {
  return new Env(this.depth + 1, this)
}

// Keys can only be set once (otherwise there should have been a .create or
// it's a duplicate definition)
Env.prototype.set = function (key, value) {
  if (this.map.has(key)) throw new Error('Cannot set a key twice')
  this.map.set(key, value)
  return this
}

// Return null if not present. O(n) but in practise n will be small
Env.prototype.get = function (key) {
  var head = this

  do {
    if (head.map.has(key)) return head.map.get(key)
  } while ((head = head.tail) != null)

  return null
}
