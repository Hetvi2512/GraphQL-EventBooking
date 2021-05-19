const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schemaByBuildSchema/schema/index");
const rootValue = require("./schemaByBuildSchema/resolvers/index");
const isAuth = require("./middleware/isAuth");
const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use(cors());
/** 
 * (1)  There are three ways to build schema 1. using buildSchema  2. Using GraphQL objectype 3.GraphQL introspection query result
   (2) Below is the example of buildSchema
 * 
 */
app.use(isAuth);
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: rootValue,
    graphiql: true,
  })
);

mongoose
  .connect(
    'connection URI'
  )
  .then(() => {
    mongoose.connection.once("open", () => {
      console.log("conneted to database");
    });
    app.listen(3000, () => {
      console.log("App listening on port 3000!");
    });
  })
  .catch((err) => {
    console.log(err);
  });

/**
   * (1) In the above code return is used for callbacks, below is the same version of async/ await
   * createEvent: async a => {
        try {
          const { title, description, price, date } = a.eventInput;
          const event = new Event({title, description, price: +price, date: new Date(date), creator: "blablabla"});
          const savedEvent = await event.save();
          const user = await User.findById("blablabla");
          await user.createdEvents.push(savedEvent);
          await user.save();
          return savedEvent;
        } catch (err) {
          throw new Error("event not created", err);
        }
      },
      createUser: async a => {
        try {
          const { email, password } = a.userInput;
          const existingUser = await User.findOne({ email });
          if (existingUser) {throw new Error("user already exists")}
          const user = new User({email, password: bcrypt.hashSync(password, 10)});
          const res = await user.save();
          return { ...res._doc, password: null };
        } catch (err) {
          throw new Error("user not created", err);
        }
      }
    },
   */
