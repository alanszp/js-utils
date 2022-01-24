module.exports = {
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"],
  roots: ["<rootDir>/src/"],
  clearMocks: true,
  resetMocks: true,
  testEnvironment: "node",
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
    "^jose/(.*)$": "<rootDir>/node_modules/jose/dist/node/cjs/$1",
  },
};
