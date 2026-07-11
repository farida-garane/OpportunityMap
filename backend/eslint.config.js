const pluginSecurity = require('eslint-plugin-security');

module.exports = [
  pluginSecurity.configs.recommended,
  {
    languageOptions: {
      globals: {
        require: "readonly",
        module: "readonly",
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        URLSearchParams: "readonly",
        URL: "readonly",
        fetch: "readonly",
        alert: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        CustomEvent: "readonly",
        L: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn"
    }
  }
];