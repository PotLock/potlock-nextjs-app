module.exports = {
  "potlock-indexer": {
    input: "https://dev.potlock.io/api/schema",

    output: {
      target: "./src/common/api/potlock/generated/client.ts",
      client: "swr",
    },

    hooks: {
      afterAllFilesWrite: "yarn format",
    },
  },
};
