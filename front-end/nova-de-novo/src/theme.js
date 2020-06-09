import { createMuiTheme } from '@material-ui/core/styles'
const theme = createMuiTheme({
    typography: {
        fontSize: 12
    },
    palette: {
        primary: { main: '#E8B657', dark: '#c99e4b' },
        secondary: { main: '#C6554D', light: '#FFDBD9' }
    },
})
export default theme