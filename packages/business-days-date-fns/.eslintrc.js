// eslint-disable-next-line unicorn/prefer-module
module.exports = {
  plugins: [
    "@typescript-eslint",
    "eslint-comments",
    "jest",
    "promise",
    "unicorn",
  ],
  extends: [
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:eslint-comments/recommended",
    "plugin:jest/recommended",
    "plugin:promise/recommended",
    "plugin:unicorn/recommended",
    "prettier",
  ],
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    // Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
    "no-prototype-builtins": "off",
    // https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
    "import/prefer-default-export": "off",
    "import/no-default-export": "error",
    // Too restrictive: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
    "react/destructuring-assignment": "off",
    // No jsx extension: https://github.com/facebook/create-react-app/issues/87#issuecomment-234627904
    "react/jsx-filename-extension": "off",
    // Use function hoisting to improve code readability
    "no-use-before-define": [
      "error",
      { functions: false, classes: true, variables: true },
    ],
    // Allow most functions to rely on type inference. If the function is exported, then `@typescript-eslint/explicit-module-boundary-types` will ensure it's typed.
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-use-before-define": [
      "error",
      { functions: false, classes: true, variables: true, typedefs: true },
    ],
    // Common abbreviations are known and readable
    "unicorn/prevent-abbreviations": "off",
    // Airbnb prefers forEach
    "unicorn/no-array-for-each": "off",
    "unicorn/filename-case": [
      "error",
      {
        cases: {
          camelCase: true,
          pascalCase: true,
        },
      },
    ],
    "class-methods-use-this": "off",
    "unicorn/prefer-node-protocol": "off",
    "unicorn/prefer-module": "off",
    "@typescript-eslint/no-implicit-any-catch": "error",
    "@typescript-eslint/no-misused-promises": [
      "error",
      { checksVoidReturn: false },
    ],
    "unicorn/no-null": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { vars: "all", args: "all", argsIgnorePattern: "^_" },
    ],
    "no-unused-vars": "off",
    "consistent-return": "off",
    "no-underscore-dangle": "off",
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: ["**/test/**", "**/*.test.js"] },
    ],
    curly: ["error", "multi-line"],
  },
  overrides: [
    {
      files: ["*.js"],
      rules: {
        // Allow `require()`
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
};
