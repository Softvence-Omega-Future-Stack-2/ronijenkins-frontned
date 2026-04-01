import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation logout {
    logout
  }
`;

export const CUSTOMERS_QUERY = gql`
  query customers($input: GetAllGenericArgs) {
    customers(input: $input) {
      
        id
        email
        username
        role
        status
        createdAt
        avatar
        customer {
          fullName
          pauseType
          address
          city
          state
          country
          topics
          zip
        
      }
    }
  }
`;
