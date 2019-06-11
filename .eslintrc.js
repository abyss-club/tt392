module.exports = {
  "extends": "airbnb",
  "plugins": [
    "react-hooks",
  ],
  "rules": {
    "react/jsx-filename-extension": [1, {
      "extensions": [".js", ".jsx"]
    }],
    "jsx-a11y/anchor-is-valid": [ "error", {
      "components": [ "Link" ],
      "specialLink": [ "to" ]
    }],
    "jsx-a11y/label-has-for": [ 2, {
      "required": {
        "some": ["nesting", "id"]
      }
    }],
    "no-use-before-define": [0, {}],
    "no-underscore-dangle": ["error", {"allow": ["__sharethis__"]}],
    "strict": 0,
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
  },
  "settings": {
    "import/resolver": {
      "node": {
        "paths": ["src"]
      }
    }
  },
  "env": {
    "es6": true,
    "browser": true,
  },
  "parser": "babel-eslint",
};
