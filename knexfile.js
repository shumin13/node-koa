// Update with your config settings.

const path = require('path')
const BASE_PATH = path.join(__dirname, 'db')

module.exports = {
  test: {
    client: 'pg',
    connection: 'postgres://localhost/node_koa_test',
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  },
  development: {
    client: 'pg',
    connection: 'postgres://localhost/node_koa',
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  }
}
