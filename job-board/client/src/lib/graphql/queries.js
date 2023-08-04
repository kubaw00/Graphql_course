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

export const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});

const jobDetailFragment = gql`
  fragment JobDetail on Job {
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
`;

export const getJobByIdQuery = gql`
  query JobById($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

export const createJobMutation = gql`
  mutation CreateJob($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;
export const jobsQuery = gql`
  query GetJobs($limit: Int, $offset: Int) {
    jobs(limit: $limit, offset: $offset) {
      items {
        title
        description
        id
        date
        company {
          name
          id
        }
      }
      totalCount
    }
  }
`;

// export async function createJob({ title, description }) {
//   const mutation = gql`
//     mutation CreateJob($input: CreateJobInput!) {
//       job: createJob(input: $input) {
//         ...JobDetail
//       }
//     }
//     ${jobDetailFragment}
//   `;
//   const { data } = await apolloClient.mutate({
//     mutation,
//     variables: {
//       input: {
//         title,
//         description,
//       },
//     },
//     update: (cache, { data }) => {
//       cache.writeQuery({
//         query: getJobByIdQuery,
//         variables: { id: data.job.id },
//         data,
//       });
//     },
//   });

//   return data.job;
// }

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

export const companyQuery = gql`
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

// export async function getCompany(id) {
//   const { data } = await apolloClient.query({
//     query: companyQuery,
//     variables: { id },
//   });
//   return data.company;
// }

// export async function getJob(id) {
//   const { data } = await apolloClient.query({
//     query: getJobByIdQuery,
//     variables: { id },
//   });
//   return data.job;
// }
