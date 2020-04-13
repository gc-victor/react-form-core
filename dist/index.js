
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./react-form-core.cjs.production.min.js')
} else {
  module.exports = require('./react-form-core.cjs.development.js')
}
