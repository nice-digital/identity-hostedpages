/**
 * React Static Boilerplate
 * https://github.com/koistya/react-static-boilerplate
 *
 * Copyright © 2015-2016 Konstantin Tarkus (@koistya)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const task = require('./task')

module.exports = task('build', () =>
  Promise.resolve()
    .then(() => require('./clean'))
    .then(() => require('./copy'))
    .then(() => require('./bundle'))
    .then(() => require('./bundle.password_reset'))
    .then(() => require('./rename'))
    .then(() => require('./rename_error'))
    .then(() => require('./rename_password_reset')))
