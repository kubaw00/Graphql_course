import {
  companyQuery,
  getJobByIdQuery,
  jobsQuery,
  createJobMutation,
} from './queries';
import { useMutation, useQuery } from '@apollo/client';

export function useCompany(id) {
  const { data, loading, error } = useQuery(companyQuery, {
    variables: { id },
  });
  return { error: Boolean(error), loading, company: data?.company };
}

export function useJob(id) {
  const { data, loading, error } = useQuery(getJobByIdQuery, {
    variables: { id },
  });
  return { error: Boolean(error), loading, job: data?.job };
}

export function useJobs() {
  const { data, loading, error } = useQuery(jobsQuery, {
    fetchPolicy: 'network-only',
  });
  return { error: Boolean(error), loading, jobs: data?.jobs };
}

export function useCreateJob() {
  const [mutate, { loading }] = useMutation(createJobMutation);

  const createJob = async ({ title, description }) => {
    const {
      data: { job },
    } = await mutate({
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

    return job;
  };

  return { loading, createJob };
}
