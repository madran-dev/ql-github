const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID, GraphQLList, GraphQLInt } = require('graphql');
const fetch = require('node-fetch');

const app = express();

const GithubAccountType = new GraphQLObjectType({
    name: 'GithubAccount',
    description: 'this is a Github Account',
    fields: () => ({
        login: { type: GraphQLString },
        url: { type: GraphQLString },
        public_repos: { type: GraphQLInt },
        followers: { type: GraphQLInt },
    })
});

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        githubAccount: {
            type: GithubAccountType,
            description: 'Get a single Github Account',
            args: { id: { type: GraphQLString } },
            resolve: (parent, args) => getGithubAccount(args.id)
        }
    })
});

getGithubAccount = async (id) => {
    const res = await fetch(`https://api.github.com/users/${id}`, {
        headers: {
            "Content-Type": "application/vnd.github.v3+json"
        }
    });

    return await res.json();
};

const schema = new GraphQLSchema({
    query: RootQueryType,
});

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(5000, () => console.log('Server is running'));