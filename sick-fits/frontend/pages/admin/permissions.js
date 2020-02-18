import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import styled from 'styled-components';
import ErrorMessage from '../../components/ErrorMessage';
import LogInGuard from '../../components/LogInGuard';
import Table from '../../components/styles/Table';

const PermissionClickArea = styled.label`
  display: block;
  text-align: center;
  width: 100%;
  height: 100%;
  padding: 1rem 0;
`;

// @TODO: Check how to fetch that from server
const PERMISSION_TYPES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  ITEM_CREATE: 'ITEM_CREATE',
  ITEM_UPDATE: 'ITEM_UPDATE',
  ITEM_DELETE: 'ITEM_DELETE',
  PERMISSION_UPDATE: 'PERMISSION_UPDATE',
};

const possiblePermissions = Object.values(PERMISSION_TYPES);

const USERS_QUERY = gql`
  query USERS_MUTATION {
    users {
      name
      permissions
      id
      email
    }
  }
`;

const UserPermissionsRow = ({ user: { name, email, permissions } }) => {
  const [userPermissions, setPermissions] = useState(permissions);

  const handleChange = ({ target: { value, checked } }) => {
    if (checked) {
      setPermissions(userPermissions => [...userPermissions, value]);
    } else {
      setPermissions(userPermissions => userPermissions.filter(permission => permission !== value));
    }
  };

  return (
    <tr>
      <td>{name}</td>
      <td>{email}</td>
      {possiblePermissions.map(permissionName => (
        <td key={permissionName}>
          <PermissionClickArea>
            <input
              value={permissionName}
              type="checkbox"
              checked={userPermissions.includes(permissionName)}
              onChange={handleChange}
            />
          </PermissionClickArea>
        </td>
      ))}
      <td>
        <button type="button">Update</button>
      </td>
    </tr>
  );
};

const PermissionsPage = () => {
  const { loading, error, data } = useQuery(USERS_QUERY);

  if (error) return <ErrorMessage error={error} />;
  if (loading) return 'Loading...';

  return (
    <LogInGuard>
      <Table>
        <caption>User permissions</caption>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            {possiblePermissions.map(permissionName => (
              <th key={permissionName}>{permissionName}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.users.map(user => (
            <UserPermissionsRow user={user} key={user.id} />
          ))}
        </tbody>
      </Table>
    </LogInGuard>
  );
};

export default PermissionsPage;
