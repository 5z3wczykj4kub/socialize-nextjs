import {
  Autocomplete,
  Avatar,
  CircularProgress,
  debounce,
  MenuItem,
  TextField,
} from '@mui/material';
import { useRouter } from 'next/router';
import { ChangeEvent, SyntheticEvent } from 'react';
import { useLazySearchQuery } from '../../../RTKQ/api';

const SearchBar = () => {
  const [search, { data: users, isFetching }] = useLazySearchQuery();

  const handleSearchPhraseChange = debounce(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const searchPhrase = event.target.value.trim();
      if (searchPhrase.length === 0) return;
      search(searchPhrase);
    },
    500
  );

  const router = useRouter();

  const handleUserSelect = (userId: string) => router.push(`/users/${userId}`);

  const handleAutocompleteChange = (
    event: SyntheticEvent<Element, Event>,
    value:
      | string
      | {
          id: string;
          label: string;
        }
      | null
  ) => {
    if (!value) return;
    handleUserSelect(
      (
        value as {
          id: string;
          label: string;
        }
      ).id
    );
  };

  const options = users
    ? users.map(({ id, firstName, lastName }) => ({
        id,
        label: `${firstName} ${lastName}`,
      }))
    : [];

  return (
    <Autocomplete
      freeSolo
      size='small'
      options={options}
      loading={isFetching}
      onChange={handleAutocompleteChange}
      filterOptions={(option) => option}
      renderOption={(props, option) => (
        <MenuItem {...props} sx={{ columnGap: 2 }}>
          <Avatar sx={{ width: 28, height: 28, fontSize: 'small' }}>
            {option.label.split(' ')[0][0]}
            {option.label.split(' ')[1][0]}
          </Avatar>
          {option.label}
        </MenuItem>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label='Search'
          onChange={handleSearchPhraseChange}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isFetching ? (
                  <CircularProgress color='inherit' size={16} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      sx={{
        width: 280,
        '&': {
          '.MuiOutlinedInput-root.MuiInputBase-sizeSmall': {
            pr: 4.875,
          },
        },
      }}
    />
  );
};

export default SearchBar;
