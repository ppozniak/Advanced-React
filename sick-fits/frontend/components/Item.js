import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import formatMoney from '../lib/formatMoney';

const ItemContainer = styled.li`
  @keyframes smoothBlink {
    from {
      opacity: 100%;
    }

    to {
      opacity: 25%;
    }
  }

  display: flex;
  padding: 1.5rem;
  align-items: center;

  ${props =>
    props.loading &&
    `
    animation: smoothBlink .7s infinite forwards alternate ease-out;
  `}
`;

const ItemsTotalContainer = styled.div`
  padding: 1.5rem;
  text-align: right;
  border-top: 3px double ${props => props.theme.black};
`;

const Thumbnail = styled.img`
  border: 2px solid ${props => props.theme.black};
  height: 8rem;
  width: 8rem;
  object-fit: cover;
  margin-right: 1rem;
  flex-shrink: 0;
`;

const FakeThumbnail = styled(Thumbnail)`
  display: flex;
  justify-content: center;
  align-items: center;
  &:before {
    display: block;
    content: '${props => (props.deleted ? '🗑' : '❔')}';
  }
`;

const ContentWrapper = styled.div`
  flex: auto;
  overflow: hidden;
  white-space: nowrap;

  * {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Title = styled.div`
  font-size: 2rem;
  text-transform: uppercase;
  margin-bottom: 1rem;
`;

const PriceTag = styled.div`
  font-size: 2.5rem;
  padding: 0 2rem;
`;

const Quantity = styled.div`
  font-size: 2rem;
  opacity: 0.5;
  margin-left: auto;
  &:before {
    content: 'x';
  }
`;

const DeleteButton = styled.button`
  padding: 0.5rem;
  margin-left: 1rem;
  border-radius: 50%;
  background: ${props => props.theme.lightgrey};
  border: 1px solid ${props => props.theme.grey};
  transition: all 0.2s ease-out;
  cursor: pointer;
  font-size: 2rem;
  width: 2.5rem;
  height: 2.5rem;
  line-height: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    color: #fff;
    background-color: ${props => props.theme.grey};
  }
`;

const WarningIcon = styled.span`
  font-size: 0.9em;
  opacity: 0.7;
  cursor: help;
`;

const Item = ({ title, description, price, image, quantity, handleDelete, loading, warning }) => {
  const itemDeleted = !title && !description && !price;

  // For deleted items
  if (itemDeleted)
    return (
      <ItemContainer loading={loading || undefined}>
        <FakeThumbnail as="div" deleted />
        <ContentWrapper>
          <Title>Deleted item</Title>
          <p>This item is no longer available.</p>
        </ContentWrapper>
        {handleDelete && <DeleteButton onClick={handleDelete}>&times;</DeleteButton>}
      </ItemContainer>
    );

  return (
    <ItemContainer loading={loading || undefined}>
      {image && <Thumbnail src={image} alt="" />}
      {!image && <FakeThumbnail as="div" />}

      <ContentWrapper>
        <Title>{title}</Title>
        <p>
          <ReactMarkdown
            allowedTypes={['text']}
            unwrapDisallowed
            renderers={{ text: ({ value }) => value.concat(' ') }}
          >
            {description}
          </ReactMarkdown>
        </p>
      </ContentWrapper>

      <PriceTag>
        {formatMoney(price)}
        {warning && (
          <WarningIcon title="This item has now a different price than when you bought it or it was deleted.">
            ⚠
          </WarningIcon>
        )}
      </PriceTag>
      <Quantity>{quantity} </Quantity>
      {handleDelete && <DeleteButton onClick={handleDelete}>&times;</DeleteButton>}
    </ItemContainer>
  );
};

export const ItemsTotal = ({ total }) => (
  <ItemsTotalContainer>
    <PriceTag>Total: {formatMoney(total)}</PriceTag>
  </ItemsTotalContainer>
);

export default Item;
