const targetPath = "./src/common/api/potlock/generated/client.ts";

module.exports = {
  "potlock-indexer": {
    input: "https://dev.potlock.io/api/schema",

    output: {
      target: targetPath,
      client: "swr",
    },

    hooks: {
      afterAllFilesWrite: `eslint --fix ${targetPath}`,
    },
  },
};
