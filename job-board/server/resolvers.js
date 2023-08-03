import {
  getJob,
  getJobs,
  getJobsByCompany,
  createJob,
  deleteJob,
  updateJob,
} from './db/jobs.js';
import { getCompany } from './db/companies.js';
import { GraphQLError } from 'graphql';

export const resolvers = {
  Query: {
    jobs: () => getJobs(),
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if (!job) {
        throw customError('No job found with id ' + id);
      }
      return job;
    },
    company: async (_root, { id }) => {
      const company = await getCompany(id);
      if (!company) {
        throw customError('No company find with id ' + id);
      }
      return company;
    },
  },

  Mutation: {
    createJob: (_root, { input: { title, description } }, { user }) => {
      if (!user) {
        throw authorizationError('You shoud be authenticated');
      }
      console.log(user);

      return createJob({ companyId: user.companyId, title, description });
    },
    deleteJob: async (_root, { id }, { user }) => {
      if (!user) {
        throw authorizationError('You shoud be authenticated');
      }

      const job = await deleteJob(id, user.companyId);
      if (!job) {
        throw customError('No Job found with id ' + id);
      }
      return job;
    },
    updateJob: async (
      _root,
      { input: { id, title, description } },
      { user }
    ) => {
      if (!user) {
        throw authorizationError('You shoud be authenticated');
      }
      const job = await updateJob({
        id,
        title,
        description,
        companyId: user.companyId,
      });
      if (!job) {
        throw customError('No Job found with id ' + id);
      }
      return job;
    },
  },

  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },

  Job: {
    company: (job) => getCompany(job.companyId),
    date: (job) => toISODate(job.createdAt),
  },
};

function toISODate(value) {
  return value.slice(0, 'dd-mm-yyyy'.length);
}

function authorizationError(message) {
  return new GraphQLError(message, {
    extensions: { code: 'NOT_AUTORIZED' },
  });
}

function customError(message) {
  return new GraphQLError(message, {
    extensions: { code: 'NOT_FOUND' },
  });
}
