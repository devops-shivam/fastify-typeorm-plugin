import { FastifyPluginAsync } from "fastify";
import { DataSource, DataSourceOptions } from "typeorm";
declare module "fastify" {
    interface FastifyInstance {
        orm: DataSource & FastifyTypeormInstance.FastifyTypeormNamespace;
    }
}
declare namespace FastifyTypeormInstance {
    interface FastifyTypeormNamespace {
        [namespace: string]: DataSource;
    }
}
type DBConfigOptions = {
    connection?: DataSource;
    namespace?: string;
} & Partial<DataSourceOptions>;
declare const _default: FastifyPluginAsync<DBConfigOptions>;
export default _default;
