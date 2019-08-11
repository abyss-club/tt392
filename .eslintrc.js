module.exports = {
  "extends": ["eslint:recommended", "airbnb", "plugin:jsdoc/recommended"],
  "plugins": [
    "react-hooks",
    "jsdoc",
    "graphql",
  ],
  "rules": {
    "graphql/template-strings": ['error', {
      env: 'apollo',
      schemaJson: require('./schema.json'),
    }],
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
    "no-underscore-dangle": ["error", {"allow": ["__sharethis__", "__typename"]}],
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
