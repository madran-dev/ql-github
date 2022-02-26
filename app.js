const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID, GraphQLList } = require('graphql');

const app = express();

const authors = [
    { id: 1, name: 'J. K. Rowling' },
    { id: 2, name: 'J. R. R. Tolkien' },
    { id: 3, name: 'Brent Weeks' }
];

const books = [
    { id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
    { id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
    { id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
    { id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
    { id: 5, name: 'The Two Towers', authorId: 2 },
    { id: 6, name: 'The Return of the King', authorId: 2 },
    { id: 7, name: 'The Way of Shadows', authorId: 3 },
    { id: 8, name: 'Beyond the Shadows', authorId: 3 }
];

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'this is an author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        books: {
            type: new GraphQLList(BookType),
            resolve: author => books.filter(book => book.authorId === author.id)
        }
    })
});

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'this is a book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve: book => authors.find(author => author.id === book.authorId)
        }
    })
});

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        books: {
            type: new GraphQLList(BookType),
            description: 'List all books',
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List all authors',
            resolve: () => authors
        },
        book: {
            type: BookType,
            description: 'Get a single book',
            args: { id: { type: GraphQLID } },
            resolve: (parent, args) => books.find((book) => book.id == args.id)
        },
        author: {
            type: AuthorType,
            description: 'Get a single author',
            args: { id: { type: GraphQLID } },
            resolve: (parent, args) => authors.find((author) => author.id == args.id)
        },
    })
});

const schema = new GraphQLSchema({
    query: RootQueryType
});

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(5000, () => console.log('Server is running'));