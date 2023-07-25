import { getJobs } from './db/jobs.js';

export const resolvers = {
  Query: {
    job: () => getJobs(),
  },

  Job: {
    date: (job) => toISODate(job.createdAt),
  },
};

function toISODate(value) {
  return value.slice(0, 'dd-mm-yyyy'.length);
}
