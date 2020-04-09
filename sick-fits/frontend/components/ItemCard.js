import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import formatMoney from '../lib/formatMoney';
import SickButton from './styles/SickButton';
import PriceTag from './styles/PriceTag';
import useAddToCart from '../hooks/useAddToCart';

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  text-align: center;
  min-height: 11.5rem;
  box-shadow: 3px 3px 12px #00000025;
  overflow: hidden;
  padding: 1rem;
`;

const Thumbnail = styled.img`
  display: block;
  width: 100%;
  height: 140px;
  margin: 0 auto;
  object-fit: cover;
  object-position: top center;
  transform: rotate(3deg) scaleX(1.2);
  margin-bottom: 20px;
  margin-top: -20px;
`;

const FakeThumbnail = styled(Thumbnail)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ccc;
  text-align: left;
  font-size: 5rem;
  &:before {
    display: inline-block;
    content: '❔';
  }
`;

const Title = styled.div`
  font-size: 2rem;
  text-transform: uppercase;
  margin-bottom: 1rem;
`;

function limitWords(string, maxWords) {
  const stringDivided = string.split(' ');
  const isOverLimit = stringDivided.length > maxWords;
  if (!isOverLimit) {
    return string;
  }

  return stringDivided
    .slice(0, maxWords)
    .join(' ')
    .concat('...');
}

const ItemCard = ({ title, description, id, price, image, currentUser }) => {
  const { addToCart, addingToCart, buttonText } = useAddToCart({ id, currentUser });

  return (
    <ItemContainer>
      <Link href="item/[id]" as={`item/${id}`} passHref>
        <a style={{ textDecoration: 'none' }}>
          {image && <Thumbnail src={image} alt="" />}
          {!image && <FakeThumbnail as="div" />}
        </a>
      </Link>

      <Title>{limitWords(title, 5)}</Title>
      <p>{limitWords(description, 10)}</p>

      <PriceTag>{formatMoney(price)}</PriceTag>

      <SickButton
        fullWidth
        type="button"
        onClick={addToCart}
        disabled={addingToCart || !currentUser}
      >
        {buttonText}
      </SickButton>
    </ItemContainer>
  );
};

export default ItemCard;
