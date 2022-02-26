const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');
const app = express();

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'HelloWorld',
        fields: () => ({
            message: {
                type: GraphQLString,
                resolve: () => 'Hello World1'
            }
        })
    })
});

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));
app.listen(5000, ()=> console.log('Server is running'));