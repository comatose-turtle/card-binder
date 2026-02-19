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
    "\\.(jpg|ico|jpeg|png|gif|webp|svg)$": "<rootDir>/mocks/fileMock.ts"
  },
  setupFiles: ["<rootDir>/jest.setEnvVars.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  verbose: true,
  clearMocks: true,
} satisfies Config;