module.exports = {
  parser: "babel-eslint",
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended"
  ],
  plugins: [
    "prettier"
  ],
  rules: {
    "prettier/prettier": [
      2, {
        "singleQuote": true,
        "semi": false
      }
    ]
  },
  env: {
    node: true,
    es6: true,
    browser: true
  }
}
