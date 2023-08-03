import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getCompany } from '../lib/graphql/queries';
import JobList from '../components/JobList';
import { useQuery } from '@apollo/client';
import { companyQuery } from '../lib/graphql/queries';

function CompanyPage() {
  const { companyId } = useParams();
  const {
    data: { company },
    loading,
    error,
  } = useQuery(companyQuery, {
    variables: { id: companyId },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className='has-text-danger'>Data unavailable</div>;
  }

  return (
    <div>
      <h1 className='title'>{company.name}</h1>
      <div className='box'>{company.description}</div>
      <h2 className='title is-5'>Jobs at {company.name}</h2>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
