import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { config } from 'dotenv'

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  plugins: [react()],
});