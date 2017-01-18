const path = require('path');
const watch = require('node-watch');

export const startWatch = (config, cb) => {
  let filter = (fn) => {
    return (filename) => {
      if (!/node_modules/.test(filename) && /\.sandbox.ts$/.test(filename)) {
        fn(filename);
      }
    };
  };
  watch([path.resolve(config.sourceRoot)], filter(cb));
};
