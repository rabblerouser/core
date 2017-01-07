import React from 'react';
import styled from 'styled-components';

const Icon = styled.span`
  width: 100%;
  height: 100%;
  position: absolute;
  right: 0;
  opacity: 0;
  padding: 5px;
  text-align: right;
  &:hover {
    opacity: 1;
  }
`;

const Button = styled.button`
  text-align: left;
  position: relative;
  border-radius: 0;
  width: 100%;
  &:hover {
      background: ${props => props.theme.lightGrey};
      cursor: pointer;
      color: ${props => props.theme.black};
  }
  &:focus {
    outline-color: ${props => props.theme.primaryDark};
    outline-style: dashed;
    outline-width: 1px;
  }
  background-color: ${props => props.theme.white};
  color: ${props => props.theme.primaryDark};
  padding: 0px;
  margin: 0px;
  word-wrap: break-word;
  font-weight: 400;
  vertical-align: top;
  font-size: 1em;
  line-height: 1.2em;
`;

const Label = styled.span`
  display: inline-block;
  padding: 5px;
  width: 100%;
`;

const SortButton = ({ children }) =>
  <Button>
    <Label >{children}</Label>
    <Icon className="fa fa-sort-desc" />
  </Button>;

export default SortButton;
