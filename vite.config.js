import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/', // dinámico: GitHub Pages usa /Centro-de-Estudios-Econ-micos/, local usa /
})
