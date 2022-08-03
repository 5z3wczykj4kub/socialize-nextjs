import { Autocomplete, MenuItem, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { ChangeEvent, SyntheticEvent } from 'react';
import { useLazySearchQuery } from '../../../api';

const SearchBar = () => {
  const [search, { data: users }] = useLazySearchQuery();

  /**
   * TODO:
   * 1. Debounce this function.
   * 2. Handle searching (loading) states.
   * 3. Add user avatar to menu item.
   * 4. Test if it's necessary to abort cancelled requests.
   */
  const handleSearchPhraseChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const searchPhrase = event.target.value.trim();
    if (searchPhrase.length === 0) return;
    search(searchPhrase);
  };

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
      onChange={handleAutocompleteChange}
      filterOptions={(option) => option}
      renderOption={(props, option) => (
        <MenuItem {...props}>{option.label}</MenuItem>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label='Search'
          onChange={handleSearchPhraseChange}
        />
      )}
      sx={{
        width: 280,
      }}
    />
  );
};

export default SearchBar;
