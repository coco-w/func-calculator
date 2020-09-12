module.exports = {
    "env": {
        "browser": true,
        // "es2020": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    "rules": {
      "react/display-name": 0,
      "no-debugger": 0,
      '@typescript-eslint/no-explicit-any': 0,
    }
};
