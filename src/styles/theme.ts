import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const theme = extendTheme({
  styles: {
    global: (props) => ({
      body: {
        bg: mode('gray.50', 'gray.800')(props)
      }
    })
  },
  colors: {
    indigo : {
      '50': '#EEF2FF',
      '100': '#E0E7FF',
      '200': '#C7D2FE',
      '300': '#A5B4FC',
      '400': '#818CF8',
      '500': '#6366F1',
      '600': '#4F46E5',
      '700': '#4338CA',
      '800': '#3730A3',
      '900': '#312E81'   
    }
  }
});

const COLOR_SCHEME = 'indigo';

export { theme, COLOR_SCHEME };