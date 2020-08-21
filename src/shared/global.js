import { glob } from 'goober'

export const fontUrl = 'https://fonts.googleapis.com/css?family=Noto+Sans:400,400i,700,700i&display=swap'

export const GlobalStyle = glob`
  body {
    font-family: 'Noto Sans', sans-serif;
  }
`
