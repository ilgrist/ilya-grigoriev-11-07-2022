import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export const WeatherSearch = ({ searchResults, onSearch, onSelectLocation }) => {
  const [txt, setTxt] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const updateInput = (ev) => {
    if (ev) {
      const newTxt = ev.target.value;
      if (isValid(newTxt)) {
        setTxt(newTxt);
        setIsError(false);
        setErrorMessage('');
        onSearch(newTxt);
      } else {
        setTxt('');
        setIsError(true);
        setErrorMessage('English letters only');
      }
    }
  };

  const isValid = (txt) => {
    const reg = new RegExp(/^[a-zA-Z ]*$/g);
    return reg.test(txt);
  };

  const selectLocation = (ev, selection, reason) => {
    if (reason) {
      onSelectLocation(selection);
      setTxt('');
    }
  };

  return (
    <div className="autocomplete-cont">
      <Autocomplete
        disablePortal
        freeSolo
        clearOnBlur
        loading={false}
        onChange={selectLocation}
        inputValue={txt}
        onInputChange={(ev) => updateInput(ev)}
        getOptionLabel={(option) => {
          return `${option.LocalizedName}, ${option.Country.LocalizedName}`;
        }}
        id="combo-box-demo"
        options={searchResults}
        filterOptions={(x) => x}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Enter city"
            error={isError}
            helperText={errorMessage}
            autoFocus
          />
        )}
      />
    </div>
  );
};
