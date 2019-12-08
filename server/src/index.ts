import "reflect-metadata";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { JWTData } from "./entity/JWTData";
import * as jwt from "jsonwebtoken"
import { AuthDirective } from "./filter/AuthDirective";
import * as express from "express"

const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    context: async ({ req }) => {
        // console.log(req)
        // console.log(req.body.operationName)
        // console.log(req.headers)
        if (req && req.headers && req.headers.token) {
            const token = req.headers.token
            if (token) {
                try {
                    const data = <JWTData>jwt.verify(token, "secret")
                    if (!data.isRefresh) {
                        return { user: data.user }
                    }
                } catch (e) {
                    console.log(`error token ${token}`)
                }
            }
        }
    },
    // validationRules:[depthLimit(5)],// 最多递归调用层数
    schemaDirectives: {
        auth: AuthDirective,
    }
})

const app = express()
server.applyMiddleware({ app })

createConnection().then(async connection => {
    app.listen({ port: 4000 }, () =>
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
}).catch(error => console.log(error));