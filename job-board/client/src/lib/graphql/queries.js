import { GraphQLClient, gql } from 'graphql-request';
import { getAccessToken } from '../auth';

const client = new GraphQLClient('http://localhost:9000/graphql', {
  headers: () => {
    const accessToken = getAccessToken();
    if (accessToken) {
      return { Authorization: `Bearer ${accessToken}` };
    }
    return {};
  },
});

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
      }
    }
  `;
  const { job } = await client.request(mutation, {
    input: { title, description },
  });
  return job;
}

export async function deleteJob({ id }) {
  const mutation = gql`
    mutation CreateJob($id: ID!) {
      job: deleteJob(id: $id) {
        id
      }
    }
  `;
  const { job } = await client.request(mutation, {
    id,
  });
  return job;
}

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
  const { company } = await client.request(query, { id });
  return company;
}

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
          id
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
