import React, { useState } from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from 'react-rte';

const MyStatefulEditor = ({ onChange }) => {
  const [value, setValue] = useState(RichTextEditor.createEmptyValue());

  const handleOnChange = (newValue) => {
    setValue(newValue);
    if (onChange) {
      // Send the changes up to the parent component as an HTML string.
      // This is here to demonstrate using `.toString()` but in a real app it
      // would be better to avoid generating a string on each change.
      onChange(newValue.toString('html'));
    }
  };

  return (
    <RichTextEditor
      value={value}
      onChange={handleOnChange}
    />
  );
};

MyStatefulEditor.propTypes = {
  onChange: PropTypes.func
};

export default MyStatefulEditor;
