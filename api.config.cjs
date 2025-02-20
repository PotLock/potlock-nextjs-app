//? NOTE: Orval does not support ESM configs at the moment
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolve } = require("path");

const apiPath = resolve(__dirname, "./src/common/api");
const clientPath = "internal/client.generated.ts";

const targetPaths = {
  indexer: resolve(apiPath, "indexer", clientPath),
  "intear-prices": resolve(apiPath, "intear-prices", clientPath),
};

module.exports = {
  /**
   * Docs: https://test-dev.potlock.io/api/schema/swagger-ui
   */
  indexer: {
    input: "https://test-dev.potlock.io/api/schema",

    output: {
      target: targetPaths.indexer,
      client: "swr",
    },

    hooks: {
      afterAllFilesWrite: `eslint --fix ${targetPaths.indexer}`,
    },
  },

  "intear-prices": {
    input: "https://prices.intear.tech/openapi",

    output: {
      target: targetPaths["intear-prices"],
      client: "swr",
    },

    hooks: {
      afterAllFilesWrite: `eslint --fix ${targetPaths["intear-prices"]}`,
    },
  },
};
