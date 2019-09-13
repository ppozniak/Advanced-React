import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import formatMoney from '../lib/formatMoney';

const ItemContainer = styled.div`
  padding: 1rem;
  border: 3px double ${p => p.theme.black};
  text-align: center;
  min-height: 10rem;
`;

const Thumbnail = styled.img`
  display: block;
  width: 100%;
  max-height: 125px;
  margin: 0 auto;
  object-fit: cover;
  transform: rotate(3deg);
`;

const Title = styled.a`
  font-size: 2rem;
  font-family: monospace;
  color: ${props => props.theme.red};
`;

const Item = ({ title, description, id, price, image }) => (
  <ItemContainer>
    {image && <Thumbnail src={image} alt="" />}
    <Link href="item/[id]" as={`item/${id}`} passHref>
      <Title>{title}</Title>
    </Link>

    <p>{description}</p>

    <strong>Za jedyne: {formatMoney(price)}</strong>
  </ItemContainer>
);

export default Item;
