module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/standard"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "eol-last": 0,
    "space-before-function-paren": 0,
    "no-debugger": "off",
    camelcase: 0,
    quotes: [0, "double"], //使用双引号，关闭
  }
};
