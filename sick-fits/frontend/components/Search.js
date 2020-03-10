import React, { useCallback } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import debounce from 'lodash.debounce';
import { useCombobox } from 'downshift';
import { useRouter } from 'next/router';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchQuery: String!) {
    items(
      where: { OR: [{ title_contains: $searchQuery }, { description_contains: $searchQuery }] }
    ) {
      id
      title
      image
    }
  }
`;

const ON_CHANGE_DEBOUNCE_MS = 350;

const Search = () => {
  const [searchForItems, { loading, error, data, called, updateQuery }] = useLazyQuery(
    SEARCH_ITEMS_QUERY
  );
  const { push } = useRouter();

  const items = (data && data.items) || [];
  const debouncedSearchForItems = useCallback(debounce(searchForItems, ON_CHANGE_DEBOUNCE_MS), []);

  const handleChange = ({ inputValue }) => {
    if (!inputValue) {
      return updateQuery(() => ({ items: [] }));
    }

    debouncedSearchForItems({
      variables: {
        searchQuery: inputValue,
      },
    });
  };

  const { getItemProps, getMenuProps, highlightedIndex, getInputProps, isOpen } = useCombobox({
    items,
    itemToString: item => item.title,
    onSelectedItemChange: ({ selectedItem }) => {
      push(`/item/${selectedItem.id}`);
    },
    onInputValueChange: handleChange,
  });

  return (
    <SearchStyles>
      <input
        type="text"
        placeholder="Search for items..."
        {...getInputProps()}
        className={loading ? 'loading' : ''}
      />
      {isOpen && (
        <DropDown {...getMenuProps()}>
          {items.map((item, index) => (
            <DropDownItem
              key={item.id}
              {...getItemProps({ item, index, highlighted: highlightedIndex === index })}
            >
              <img width="50" src={item.image} alt="" />
              {item.title}
            </DropDownItem>
          ))}
          {!error && !loading && !items.length && called && 'No items found.'}
        </DropDown>
      )}
    </SearchStyles>
  );
};

export default Search;
