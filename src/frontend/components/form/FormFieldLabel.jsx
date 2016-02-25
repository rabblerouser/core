import { ApplicationFormFieldLabels as Labels } from '../../config/strings.js';
import React from 'react';
import InlineError from './InlineError.jsx';

export default ({ fieldName, isOptional, hasError }) => {

  let error = hasError && fieldName ? (<InlineError errorFor={ fieldName }/>) : "";
  let optional = isOptional ? ( <span className='optional'>(optional)</span> ) :
                              ( <span className='mandatory'></span> );
  return (
    <label className={ hasError ? 'invalid' : '' } htmlFor={ fieldName }>{Labels[fieldName]}
      { optional }
      { error }
    </label>
  )
}
