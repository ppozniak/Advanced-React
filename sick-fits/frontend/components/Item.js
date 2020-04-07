import React from 'react';
import styled from 'styled-components';
import formatMoney from '../lib/formatMoney';

const ItemContainer = styled.li`
  display: flex;
  padding: 1.5rem;
  align-items: center;
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
`;

const FakeThumbnail = styled(Thumbnail)`
  display: flex;
  justify-content: center;
  align-items: center;
  &:before {
    display: block;
    content: '❔';
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

const Item = ({ title, description, price, image, quantity }) => (
  <ItemContainer>
    {image && <Thumbnail src={image} alt="" />}
    {!image && <FakeThumbnail as="div" />}

    <ContentWrapper>
      <Title>{title}</Title>
      <p>{description}</p>
    </ContentWrapper>

    <PriceTag>{formatMoney(price)}</PriceTag>
    <Quantity>{quantity}</Quantity>
  </ItemContainer>
);

export const ItemsTotal = ({ total }) => (
  <ItemsTotalContainer>
    <PriceTag>Total: {formatMoney(total)}</PriceTag>
  </ItemsTotalContainer>
);

export default Item;
