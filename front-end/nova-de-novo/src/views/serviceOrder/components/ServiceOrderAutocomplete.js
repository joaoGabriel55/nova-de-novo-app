import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
// import CircularProgress from '@material-ui/core/CircularProgress';

export default function ServiceOrderAutocomplete(props) {
    const { label, valueProp, noOptionsText, handleSearch, getSelected, collectionData } = props
    const [inputValue, setInputValue] = React.useState('');

    React.useEffect(() => {
        const loadEditValue = () => {
            if (valueProp) {
                setInputValue(valueProp.name)
            }
        }
        loadEditValue()
    }, [valueProp])

    return (

        <Autocomplete
            value={valueProp}
            noOptionsText={noOptionsText}
            onChange={(_, newValue) => {
                getSelected(newValue)

            }}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue)
                handleSearch(newInputValue)
            }}
            disableClearable={true}
            getOptionSelected={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option ? option.name : ""}
            id="controllable-states-demo"
            options={collectionData}
            size="small"
            renderInput={(params) => <TextField required color="secondary" {...params} label={label} variant="outlined" />}
        />

    )
}