import React from 'react';
import { SpacedLayout } from 'layabout';
import styled from 'styled-components';
import { Button } from '../../common';

const HeaderText = styled.span`
  font-size: 1.1em;
  font-weight: bold;
`;

const FormHeaderWithSave = ({ children }) => (
  <SpacedLayout container="header">
    <HeaderText>{children}</HeaderText>
    <Button type="submit">Save</Button>
  </SpacedLayout>
);

export default FormHeaderWithSave;
