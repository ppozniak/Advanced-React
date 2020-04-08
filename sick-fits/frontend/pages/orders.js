import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import styled from 'styled-components';
import { formatRelative } from 'date-fns';
import Link from 'next/link';
import LogInGuard from '../components/LogInGuard';
import ErrorMessage from '../components/ErrorMessage';
import Item, { ItemsTotal } from '../components/Item';

const OrderList = styled.ul`
  margin-top: 3rem;
  padding: 0;
  list-style-type: none;
`;

const Order = styled.li`
  margin-bottom: 5rem;
`;

const OrderHeader = styled.header`
  display: flex;
  justify-content: space-between;
`;

const RelativeDate = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  font-weight: bold;
`;

const PaymentStatus = styled.div`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
`;

const ItemsList = styled.ul`
  padding: 2rem;
  list-style-type: none;
  border: 1px solid ${props => props.theme.lightgrey};
  box-shadow: 2px 2px 4px #00000055;
  border-radius: 2px;
`;

export const ORDERS_QUERY = gql`
  query ORDERS_QUERY {
    orders {
      id
      createdAt
      payment {
        id
        status
      }
      items {
        id
        title
        description
        image
        quantity
        price
        itemConnection {
          id
          price
        }
      }
      total
    }
  }
`;

const ItemLink = styled.a`
  text-decoration: none;
  color: inherit;

  &:hover {
    text-decoration: underline;
  }
`;

function LinkWrapper({ children, href }) {
  return (
    <Link href="item/[id]" as={href} passHref>
      <ItemLink>{children}</ItemLink>
    </Link>
  );
}

const OrdersPage = () => {
  const { data, loading, error } = useQuery(ORDERS_QUERY);
  const orders = (data && data.orders) || [];

  return (
    <LogInGuard>
      <h1>Orders</h1>

      {error && <ErrorMessage error={error} />}
      {loading && 'Loading your orders...'}
      {!loading && !error && !orders.length && 'You have no orders. Go buy something, please.'}

      <OrderList>
        {orders.map(({ id, payment, total, items, createdAt }) => (
          <Order key={id}>
            <OrderHeader>
              <RelativeDate>{formatRelative(new Date(createdAt), new Date())}</RelativeDate>
              <PaymentStatus>{payment.status}</PaymentStatus>
            </OrderHeader>
            <ItemsList>
              {/* @TODO: Show warning if item connection price has changed */}
              {items.map(({ id, title, description, image, itemConnection, price, quantity }) => {
                const href = itemConnection && `item/${itemConnection.id}`;
                const ConditionalLinkWrapper = ({ children }) =>
                  href ? <LinkWrapper href={href}>{children}</LinkWrapper> : children;
                const priceHasChanged = itemConnection && itemConnection.price !== price;

                return (
                  <ConditionalLinkWrapper key={id}>
                    <Item
                      title={title}
                      description={description}
                      image={image}
                      price={price}
                      quantity={quantity}
                      href={href}
                      warning={priceHasChanged || !href}
                    />
                  </ConditionalLinkWrapper>
                );
              })}
              <ItemsTotal total={total} />
            </ItemsList>
          </Order>
        ))}
      </OrderList>
    </LogInGuard>
  );
};

export default OrdersPage;
