import { Autocomplete, MenuItem, TextField } from '@mui/material';

const SearchBar = () => {
  return (
    <Autocomplete
      freeSolo
      size='small'
      options={[
        { id: 1, label: 'John Doe' },
        { id: 2, label: 'Jane Doe' },
      ]}
      filterOptions={(option) => option}
      renderOption={(props, option) => (
        <MenuItem {...props}>{option.label}</MenuItem>
      )}
      renderInput={(params) => <TextField {...params} label='Search' />}
      sx={{
        width: 280,
      }}
    />
  );
};

export default SearchBar;
