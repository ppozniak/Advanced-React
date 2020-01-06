import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import PaginationStyles from './styles/PaginationStyles';

const Pagination = ({ currentPage, totalItems, totalPages }) => {
  const isNextDisabled = currentPage === totalPages;

  return (
    <PaginationStyles>
      <Link
        href={{
          pathname: '/',
          query: {
            page: currentPage - 1,
          },
        }}
      >
        <a aria-disabled={currentPage <= 1}>Prev</a>
      </Link>

      <div>
        Current page: {currentPage} of {totalPages}
      </div>
      <div>Total items: {totalItems}</div>

      <Link
        href={{
          pathname: '/',
          query: {
            page: currentPage + 1,
          },
        }}
      >
        <a aria-disabled={isNextDisabled}>Next</a>
      </Link>
    </PaginationStyles>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
};

export default Pagination;
