import { companyQuery, getJobByIdQuery, jobsQuery } from './queries';
import { useQuery } from '@apollo/client';

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
