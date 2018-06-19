// Env is a linked list currently, so each scope can have their own appends

module.exports = Env
function Env (parent) {
  this.tail = parent
  this.map = new Map()
}

Env.create = function () {
  return new Env()
}

Env.prototype.create = function () {
  return new Env(this)
}

Env.prototype.set = function (key, value) {
  if (this.map.has(key)) throw new Error('Cannot set a key twice')
  this.map.set(key, value)
  return this
}

Env.prototype.get = function (key) {
  var head = this

  do {
    if (head.map.has(key)) return head.map.get(key)
  } while ((head = head.tail) != null)

  return null
}
