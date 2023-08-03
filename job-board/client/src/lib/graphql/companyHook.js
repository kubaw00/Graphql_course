import { companyQuery } from './queries';
import { useQuery } from '@apollo/client';

export function useCompany(companyId) {
  const { data, loading, error } = useQuery(companyQuery, {
    variables: { id: companyId },
  });

  return { errr: Boolean(error), loading, company: data?.company };
}
