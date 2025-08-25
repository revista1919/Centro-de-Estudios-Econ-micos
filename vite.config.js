import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Centro-de-Estudios-Econ-micos/', // Nombre correcto del repo
})