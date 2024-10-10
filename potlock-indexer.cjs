const targetPath = "./src/common/api/potlock/generated/client.ts";

module.exports = {
  "potlock-indexer": {
    input: "https://test-dev.potlock.io/api/schema",

    output: {
      target: targetPath,
      client: "swr",
    },

    hooks: {
      afterAllFilesWrite: `eslint --fix ${targetPath}`,
    },
  },
};
