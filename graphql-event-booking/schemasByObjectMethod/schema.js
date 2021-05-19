const graphql = require("graphql");
const Event = require("../models/events");
const User = require("../models/users");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const EventType = new GraphQLObjectType({
  name: "Event",
  fields: () => ({
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    price: { type: GraphQLFloat },
    date: { type: GraphQLString },
    date: { type: GraphQLString },
  }),
});
