'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/index.js');
} else {
  module.exports = require('./lib/index.dev.js');
}
