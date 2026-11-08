import { defineConfig, devices } from '@playwright/test';

// Teste le site prérendu (build/) servi par `vite preview`. Lancer `pnpm build` avant `pnpm e2e`.
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: 'http://localhost:4173', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    // Toujours un serveur neuf : un ancien `vite preview` servirait la liste de fichiers d'un vieux build.
    reuseExistingServer: false,
  },
});
