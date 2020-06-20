import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
// import CircularProgress from '@material-ui/core/CircularProgress';

export default function ServiceOrderAutocomplete(props) {
    const { label, noOptionsText, handleSearch, getSelected, collectionData } = props

    return (
        <Autocomplete
            id="asynchronous-demo"
            size="small"
            required
            closeIcon={null}
            onChange={(_, value) => getSelected(value)}
            noOptionsText={noOptionsText}
            getOptionSelected={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            options={collectionData}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    required
                    variant="outlined"
                    color="secondary"
                    onChange={handleSearch}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    )
}