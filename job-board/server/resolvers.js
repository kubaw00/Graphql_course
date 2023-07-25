export const resolvers = {
  Query: {
    job: () => {
      return {
        id: 'test-id',
        title: () => 'Example title',
        description: () => 'Example description',
      };
    },
  },
};
