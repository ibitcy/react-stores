'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/index.dev.js');
} else {
  module.exports = require('./lib/index.js');
}
