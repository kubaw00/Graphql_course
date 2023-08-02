import { GraphQLClient, gql } from 'graphql-request';

const client = new GraphQLClient('http://localhost:9000/graphql');

export async function getJobs() {
  const query = gql`
    query {
      job {
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
  const { job } = await client.request(query);
  return job;
}
