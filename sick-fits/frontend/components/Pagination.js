import React from 'react';
import Link from 'next/link';
import PaginationStyles from './styles/PaginationStyles';

const Pagination = ({ currentPage, totalItems, lastCursor, firstCursor, itemsPerPage }) => {
  const pages = Math.ceil(totalItems / itemsPerPage);

  const showPrev = currentPage > 1;
  const showNext = currentPage < pages;

  return (
    <PaginationStyles>
      <Link
        href={{
          pathname: '/',
          query: {
            before: firstCursor,
            page: currentPage - 1,
          },
        }}
      >
        <a aria-disabled={!showPrev}>Prev</a>
      </Link>

      <div>
        Current page: {currentPage} of {pages}
      </div>
      <div>Total items: {totalItems}</div>

      <Link
        href={{
          pathname: '/',
          query: {
            after: lastCursor,
            page: currentPage + 1,
          },
        }}
      >
        <a aria-disabled={!showNext}>Next</a>
      </Link>
    </PaginationStyles>
  );
};

export default Pagination;
