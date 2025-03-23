module.exports = {
    extends: [
      "next/core-web-vitals",
      "next/typescript",
      "plugin:react-hooks/recommended",
      "plugin:react-refresh/recommended"
    ],
    plugins: [
      "react-hooks",
      "react-refresh"
    ],
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn"
    }
  };
  