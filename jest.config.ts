import type {Config} from 'jest';

export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
        tsconfig: 'tsconfig.test.json',
    }],
  },
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
  },
  setupFiles: ["<rootDir>/jest.setEnvVars.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  verbose: true,
} satisfies Config;