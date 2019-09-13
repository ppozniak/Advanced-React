import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import formatMoney from '../lib/formatMoney';

const ItemContainer = styled.div`
  padding: 1rem;
  text-align: center;
  min-height: 10rem;
  box-shadow: 3px 3px 12px #00000043;
  overflow: hidden;
`;

const Thumbnail = styled.img`
  display: block;
  width: 100%;
  max-height: 125px;
  margin: 0 auto;
  object-fit: cover;
  object-position: top center;
  transform: rotate(3deg) scaleX(1.2);
  margin-bottom: 20px;
  margin-top: -20px;
`;

const FakeThumbnail = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 125px;
  object-position: top center;
  transform: rotate(3deg) scaleX(1.2);
  background-color: #ccc;
  text-align: left;
  margin-bottom: 20px;
  margin-top: -20px;

  &:before {
    display: block;
    content: '💯';
  }
`;

const Title = styled.div`
  font-size: 2rem;
  text-transform: uppercase;
`;

const Item = ({ title, description, id, price, image, handleDelete }) => (
  <ItemContainer>
    <Link href="item/[id]" as={`item/${id}`} passHref>
      <a>
        {image && <Thumbnail src={image} alt="" />}
        {!image && <FakeThumbnail />}
        <Title>{title}</Title>
      </a>
    </Link>

    <p>{description}</p>

    <strong>For only: {formatMoney(price)}❗</strong>

    {handleDelete && (
      <button type="button" onClick={handleDelete}>
        Delete ❌
      </button>
    )}
  </ItemContainer>
);

export default Item;
