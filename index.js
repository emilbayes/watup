var dfs = require('depth-first-map')

function evaluate (ast, env) {
  return dfs(ast, function (elm, i) {
    if (elm === dfs.break) return dfs.break
    if (elm === dfs.continue) return dfs.continue
    if (elm === dfs.drop) return dfs.drop

    if(elm == 'macro') {
      var name = this[2]
      var params = this[4]
      var body = this.slice(6)
      env.macros.set(name.toString(), {
        params: params,
        body: body
      })

      return dfs.drop
    }

    if (elm == 'define') {
      var name = this[2]
      var body = this.slice(4)

      env.definitions.set(name.toString(), {
        body: body
      })

      return dfs.drop
    }

    if (env.definitions.has(elm.toString())) {
      return dfs.spread(env.definitions.get(elm.toString()).body)
    }

    if (env.macros.has(elm[0].toString())) {
      return dfs.spread(applyMacro(elm, env.macros.get(elm[0].toString())))
    }

    return elm
  })
}

function applyMacro(source, macro) {
  var sourceParams = source.slice(2)

  var paramMap = new Map()

  var slen = sourceParams.length
  var mlen = macro.params.length
  for (var i = 0, j = 0; i < mlen; i++, j++) {
    var paramName = macro.params[i].toString()
    if (paramName.endsWith('*')) {
      var params = sourceParams.slice(j, slen - j)
      console.log(j)
      j += slen - j - (params.length * 2 - 1)
      console.log(j, slen)
      console.log('>', sourceParams[j + 1])
      paramMap.set(paramName, dfs.spread(params))
    } else {
      paramMap.set(paramName, sourceParams[j].toString())
    }
  }

  return dfs(macro.body, function (node, i) {
    return paramMap.get(node.toString()) || node
  })
}

function stringify (ast) {
  return ast.reduce(recurse, '')

  function recurse (str, node) {
    if (Array.isArray(node)) return str + '(' + node.reduce(recurse, '') + ')'
    return str + node
  }
}

module.exports = function (ast) {
  var mappedSource = evaluate(ast, {
    macros: new Map(),
    definitions: new Map()
  })

  return stringify(mappedSource)
}
