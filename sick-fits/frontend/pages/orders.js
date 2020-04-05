import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import LogInGuard from '../components/LogInGuard';
import ErrorMessage from '../components/ErrorMessage';
import formatMoney from '../lib/formatMoney';

const QUERY_ORDERS = gql`
  query QUERY_ORDERS {
    orders {
      id
      payment {
        id
        status
      }
      items {
        title
      }
      total
    }
  }
`;

const OrdersPage = () => {
  const { data, loading, error } = useQuery(QUERY_ORDERS);
  console.log(data);
  return (
    <LogInGuard>
      <h1>Orders</h1>

      {error && <ErrorMessage error={error} />}
      {loading && 'Loading your orders...'}
      {!loading &&
        !error &&
        data &&
        !data.orders.length &&
        'You have no orders. Go buy something, please.'}

      <ul>
        {data &&
          data.orders.map(order => (
            <li key={order.id}>
              {order.id} - {order.payment.status} - {formatMoney(order.total)}
            </li>
          ))}
      </ul>
    </LogInGuard>
  );
};

export default OrdersPage;
