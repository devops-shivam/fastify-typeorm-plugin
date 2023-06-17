# fastify-plugin-typeorm

[![Package Version](https://img.shields.io/npm/v/fastify-plugin-typeorm.svg)](https://npm.im/fastify-plugin-typeorm)

Fastify plugin for TypeORM 

A Fastify plugin for using TypeORM version 0.3.x with Fastify version 3.x for sharing the same TypeORM connection in every part of your server.
Under the hood the official [TypeORM](https://www.npmjs.com/package/typeorm) module is used.

**Note: This plugin is specifically designed to support TypeORM version 0.3.x for Fastify version 3.x.**

## Features

- Integrates TypeORM's new `DataSource` approach instead of the deprecated `Connection` and `ConnectionOptions`.
- Supports namespaces in TypeORM for better organization and management of entities.

## Installation

To install the `fastify-plugin-typeorm` plugin, use either of the following methods:

**NPM:**

```shell
npm install fastify-plugin-typeorm
```

**Yarn:**

```shell
yarn add fastify-plugin-typeorm
```

## Usage

Once the plugin is installed, you can register it in your Fastify application.

### JavaScript

```javascript
const fastify = require('fastify');
const fastifyPluginTypeORM = require('fastify-plugin-typeorm');

const app = fastify();

// Register the plugin
app.register(fastifyPluginTypeORM, {
  // Provide your TypeORM configuration options
  // See TypeORM documentation for details: https://typeorm.io/data-source-options
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'your_username',
  password: 'your_password',
  database: 'your_database',
  entities: ['src/entities/**/*.js'], // Specify the path to your entity files
  migrations: ['src/migrations/**/*.js'], // Specify the path to your migration files
  subscribers: ['src/subscribers/**/*.js'], // Specify the path to your subscriber files
  synchronize: true,
  logging: true,
  entityNamespacePrefix: 'App.Entities', // Set the namespace prefix for entities
  migrationNamespacePrefix: 'App.Migrations', // Set the namespace prefix for migrations
  subscriberNamespacePrefix: 'App.Subscribers', // Set the namespace prefix for subscribers
});

// Start your application
app.listen(3000, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});
```

routes.js

```javascript
const root = async (fastify, opts) => {
  fastify.get('/', async function (request, reply) {
    const userRepository = fastify.orm.getRepository(Users);
  });
};
```

### TypeScript

```typescript
import fastify from 'fastify';
import fastifyPluginTypeORM from 'fastify-plugin-typeorm';

const app = fastify();

// Register the plugin
app.register(fastifyPluginTypeORM, {
  // Provide your TypeORM configuration options
  // See TypeORM documentation for details: https://typeorm.io/data-source-options
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'your_username',
  password: 'your_password',
  database: 'your_database',
  entities: ['src/entities/**/*.ts'], // Specify the path to your entity files
  migrations: ['src/migrations/**/*.ts'], // Specify the path to your migration files
  subscribers: ['src/subscribers/**/*.ts'], // Specify the path to your subscriber files
  synchronize: true,
  logging: true,
  entityNamespacePrefix: 'App.Entities', // Set the namespace prefix for entities
  migrationNamespacePrefix: 'App.Migrations', // Set the namespace prefix for migrations
  subscriberNamespacePrefix: 'App.Subscribers', // Set the namespace prefix for subscribers
});

// Start your application
app.listen(3000, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});
```

### Using Namespace Option in Configuration

```javascript
const fastify = require('fastify');
const fastifyPluginTypeORM = require('fastify-plugin-typeorm');

const app = fastify();

// Register the plugin
app.register(fastifyPluginTypeORM, {
  // Provide your TypeORM configuration options
  // See TypeORM documentation for details: https://typeorm.io/data-source-options
  namespace: 'your_namespace',
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'your_username',
  password: 'your_password',
  database: 'your_database',
});

// Start your application
app.listen(3000, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});
```

### Using an Existing Connection in Configuration

```javascript
const fastify = require('fastify');
const fastifyPluginTypeORM = require('fastify-plugin-typeorm');
const { DataSource } = require('typeorm');

const app = fastify();

// Create a TypeORM data source
const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'your_username',
  password: 'your_password',
  database: 'your_database',
});

// Register the plugin with an existing data source
app.register(fastifyPluginTypeORM, {
  dataSource,
});

// Start your application
app.listen(3000, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});
```
This is the only way to initialize a "namespaced" instance using this plugin.

The namespace will be available everywhere your fastify server is. For example, to access the namespace declared in the above code: fastify.orm['postgres1'].getRepository()

## Configuration Options

Please refer to the [TypeORM documentation](https://typeorm.io/data-source-options) for configuration options and advanced usage.

## License

This project is licensed under the [MIT License](LICENSE).