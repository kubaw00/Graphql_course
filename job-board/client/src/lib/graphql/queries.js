import { getAccessToken } from '../auth';
import {
  ApolloClient,
  ApolloLink,
  concat,
  createHttpLink,
  gql,
  InMemoryCache,
} from '@apollo/client';

// const client = new GraphQLClient('http://localhost:9000/graphql', {
//   headers: () => {
//     const accessToken = getAccessToken();
//     if (accessToken) {
//       return { Authorization: `Bearer ${accessToken}` };
//     }
//     return {};
//   },
// });
const httpLink = createHttpLink({ uri: 'http://localhost:9000/graphql' });

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
});

const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        date
        title
        description
        id
        company {
          name
          description
          id
        }
      }
    }
  `;
  const { data } = await apolloClient.mutate({
    mutation,
    variables: {
      input: {
        title,
        description,
      },
    },
    update: (cache, { data }) => {
      cache.writeQuery({
        query: getJobByIdQuery,
        variables: { id: data.job.id },
        data,
      });
    },
  });

  return data.job;
}

// export async function deleteJob({ id }) {
//   const mutation = gql`
//     mutation CreateJob($id: ID!) {
//       job: deleteJob(id: $id) {
//         id
//       }
//     }
//   `;
//   const { data } = apolloClient.mutate({
//     mutation,
//     variables: {
//       id,
//     },
//   });

//   return data.job;
// }

const getJobByIdQuery = gql`
  query JobById($id: ID!) {
    job(id: $id) {
      date
      title
      description
      id
      company {
        name
        description
        id
      }
    }
  }
`;

export async function getCompany(id) {
  const query = gql`
    query getCompany($id: ID!) {
      company(id: $id) {
        description
        name
        id
        jobs {
          id
          description
          date
          title
        }
      }
    }
  `;
  const { data } = await apolloClient.query({ query, variables: { id } });
  return data.company;
}

export async function getJob(id) {
  const { data } = await apolloClient.query({
    query: getJobByIdQuery,
    variables: { id },
  });
  return data.job;
}

export async function getJobs() {
  const query = gql`
    query {
      jobs {
        title
        id
        date
        company {
          name
          id
        }
      }
    }
  `;

  const { data } = await apolloClient.query({
    query,
    fetchPolicy: 'network-only',
  });
  return data.jobs;
}
