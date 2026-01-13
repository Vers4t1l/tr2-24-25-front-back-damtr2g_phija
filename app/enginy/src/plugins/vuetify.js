import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          // Primary - Deep Crimson Red
          primary: '#C41E3A', // Deep crimson
          'primary-darken-1': '#8B0000', // Dark red
          'primary-lighten-1': '#DC143C', // Crimson

          // Secondary - Slate Gray
          secondary: '#2C3E50', // Slate gray
          'secondary-darken-1': '#1A252F', // Dark slate
          'secondary-lighten-1': '#34495E', // Light slate

          // Accent - Gold/Amber
          accent: '#F39C12', // Warm gold
          'accent-darken-1': '#D68910', // Dark gold
          'accent-lighten-1': '#F8B739', // Light gold

          // Success - Emerald Green
          success: '#27AE60', // Emerald
          'success-darken-1': '#1E8449', // Dark emerald
          'success-lighten-1': '#52BE80', // Light emerald

          // Warning - Amber Orange
          warning: '#E67E22', // Amber orange
          'warning-darken-1': '#CA6F1E', // Dark amber
          'warning-lighten-1': '#F39C12', // Light amber

          // Error - Bright Red
          error: '#E74C3C', // Bright red
          'error-darken-1': '#C0392B', // Dark red
          'error-lighten-1': '#EC7063', // Light red

          // Info - Sky Blue
          info: '#3498DB', // Sky blue
          'info-darken-1': '#2874A6', // Dark blue
          'info-lighten-1': '#5DADE2', // Light blue

          // Background & Surface
          background: '#F8F9FA', // Light gray background
          surface: '#FFFFFF', // White surface
          'surface-variant': '#ECF0F1', // Light variant
          'on-surface': '#2C3E50', // Dark text on surface

          // Neutral Grays
          'grey-50': '#F9FAFB',
          'grey-100': '#F3F4F6',
          'grey-200': '#E5E7EB',
          'grey-300': '#D1D5DB',
          'grey-400': '#9CA3AF',
          'grey-500': '#6B7280',
          'grey-600': '#4B5563',
          'grey-700': '#374151',
          'grey-800': '#1F2937',
          'grey-900': '#111827',
        },
      },
      dark: {
        colors: {
          primary: '#DC143C',
          'primary-darken-1': '#8B0000',
          'primary-lighten-1': '#FF6B6B',
          secondary: '#34495E',
          'secondary-darken-1': '#1A252F',
          'secondary-lighten-1': '#4A5F7F',
          accent: '#F39C12',
          success: '#27AE60',
          warning: '#E67E22',
          error: '#E74C3C',
          info: '#3498DB',
          background: '#121212',
          surface: '#1E1E1E',
          'surface-variant': '#2C2C2C',
          'on-surface': '#FFFFFF',
        },
      },
    },
  },
})
