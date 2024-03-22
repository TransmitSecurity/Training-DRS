import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    threads: false,
    /* As we bend the use of vitest to run integration test
     * we need every "describe" to be run sequentially
     */
    singleThread: true,
    silent: false,
    // reporters: 'verbose',
    passWithNoTests: true,
  },
})
