import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Base API URL from environment variables
// Base API URL - Using relative path to support Vite proxy and session cookies
const API_URL = "/graphql";

// HTTP Link
const httpLink = createHttpLink({
  uri: API_URL,
  credentials: "include",
});

// Authentication Link - attaches token if it exists in cookie or localStorage
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
    },
  };
});

// Apollo Client Instance
export const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          customers: {
            // Simple merge strategy for pagination if needed
            merge(_, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});
