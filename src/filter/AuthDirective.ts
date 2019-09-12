import {
    SchemaDirectiveVisitor
} from "graphql-tools";
import {
    AuthenticationError, ApolloError
} from 'apollo-server'
import {
    GraphQLField,
    GraphQLSchema,
    GraphQLDirective,
    DirectiveLocation,
    GraphQLObjectType
} from "graphql"

export class AuthDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field: GraphQLField < any, any > ) {
        console.log("visitFieldDefinition")
        const next = field.resolve
        field.resolve = async (result, args, context, info) => {
            if (context.user) {
                return next(result, args, context, info)
            } else {
                throw new ApolloError("you must login", "TOKEN_EXPIRE")
            }
        }
    }
    visitObject(object: GraphQLObjectType){
        console.log("visitObject")
        const fields = object.getFields();
        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            const next = field.resolve;

            field.resolve = function(result, args, context, info) {
                if (context.user) {
                    return next(result, args, context, info)
                } else {
                    throw new ApolloError("you must login", "TOKEN_EXPIRE")
                }
            };
          });
    }
    static getDirectiveDeclaration(directiveName: string, schema: GraphQLSchema) {
        return new GraphQLDirective({
            name: "auth",
            locations: [DirectiveLocation.FIELD_DEFINITION, DirectiveLocation.OBJECT]
        })
    }
}