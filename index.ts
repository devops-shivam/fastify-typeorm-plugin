import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { DataSource, DataSourceOptions } from "typeorm";

declare module "fastify" {
  export interface FastifyInstance {
    orm: DataSource & FastifyTypeormInstance.FastifyTypeormNamespace;
  }
}

// Declaring Multiple DataSources in a Project requires creation of namespace
declare namespace FastifyTypeormInstance {
  interface FastifyTypeormNamespace {
    [namespace: string]: DataSource;
  }
}

type DBConfigOptions = {
  connection?: DataSource; //A new DataSource passed to plugin
  namespace?: string; //Optional namespace to declare multiple DataSources in your project
} & Partial<DataSourceOptions>;

const typeOrmConnector: FastifyPluginAsync<DBConfigOptions> = async (
  fastify,
  options
) => {
  const { namespace } = options;
  delete options.namespace;
  let connection: DataSource;

  if (options.connection) {
    connection = options.connection;
  } else if (Object.keys(options).length) {
    connection = new DataSource(options as DataSourceOptions);
  } else {
    throw new Error(`No valid DataSourceOPtions provided to the plugin`);
  }

  // If a namespace is passed
  if (namespace) {
    // If fastify instance does not already have orm initialized
    if (!fastify.orm) {
      fastify.decorate("orm", {});
    }

    // Check if namespace is already used
    if (fastify.orm[namespace]) {
      throw new Error(`This namespace has already been declared: ${namespace}`);
    } else {
      fastify.orm[namespace] = connection;
      await fastify.orm[namespace].initialize().then(() => {
        fastify.addHook("onClose", async (fastifyInstance, done) => {
          await fastifyInstance.orm[namespace].destroy();
          done();
        });

        return Promise.resolve();
      });
    }
  }

  // Else no namespace is provided, initialize the connection directly on orm

  fastify.decorate("orm", await connection.initialize());
  fastify.addHook("onClose", async (fastifyInstance, done) => {
    await fastifyInstance.orm.destroy();
    done();
  });

  return Promise.resolve();
};

export default fp(typeOrmConnector, {
  fastify: "3.x",
  name: "@fastify-typeorm",
});
