import { GraphQLClient, gql } from 'graphql-request';

const client = new GraphQLClient('http://localhost:9000/graphql');

export async function getJob(id) {
  const query = gql`
    query JobById($id: ID!) {
      job(id: $id) {
        date
        title
        description
        id
        company {
          name
          description
        }
      }
    }
  `;
  const { job } = await client.request(query, { id });
  return job;
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
  const { jobs } = await client.request(query);
  return jobs;
}
