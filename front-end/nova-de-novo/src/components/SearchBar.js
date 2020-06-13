import React from 'react';

import TextField from '@material-ui/core/TextField'

function SearchBar(props) {
    const { placeholder, handleSearch } = props
    return (
        <TextField
            fullWidth
            onChange={handleSearch}
            label={placeholder}
            margin="normal"
            variant="outlined"
            size="small" />
    )
}

export default SearchBar;