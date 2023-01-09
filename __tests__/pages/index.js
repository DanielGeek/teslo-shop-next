// src/pages/index.ts

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { createMockRouter } from '../../test-utils/createMockRouter';
import HomePage from '../../pages';

test('HomePage displays a loading spinner while products are loading', () => {
  const { getByText } = render(
    <RouterContext.Provider value={createMockRouter({ asPath: { id: '' } })}>
      <HomePage />
    </RouterContext.Provider>
  );

  expect(getByText('Loading...')).toBeInTheDocument();
});

