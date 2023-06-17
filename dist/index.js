"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const typeorm_1 = require("typeorm");
const typeOrmConnector = (fastify, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { namespace } = options;
    delete options.namespace;
    let connection;
    if (options.connection) {
        connection = options.connection;
    }
    else if (Object.keys(options).length) {
        connection = new typeorm_1.DataSource(options);
    }
    else {
        throw new Error(`No valid DataSourceOPtions provided to the plugin`);
    }
    if (namespace) {
        if (!fastify.orm) {
            fastify.decorate("orm", {});
        }
        if (fastify.orm[namespace]) {
            throw new Error(`This namespace has already been declared: ${namespace}`);
        }
        else {
            fastify.orm[namespace] = connection;
            yield fastify.orm[namespace].initialize().then(() => {
                fastify.addHook("onClose", (fastifyInstance, done) => __awaiter(void 0, void 0, void 0, function* () {
                    yield fastifyInstance.orm[namespace].destroy();
                    done();
                }));
                return Promise.resolve();
            });
        }
    }
    fastify.decorate("orm", yield connection.initialize());
    fastify.addHook("onClose", (fastifyInstance, done) => __awaiter(void 0, void 0, void 0, function* () {
        yield fastifyInstance.orm.destroy();
        done();
    }));
    return Promise.resolve();
});
exports.default = (0, fastify_plugin_1.default)(typeOrmConnector, {
    fastify: "3.x",
    name: "@fastify-typeorm",
});
//# sourceMappingURL=index.js.map