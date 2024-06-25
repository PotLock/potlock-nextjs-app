module.exports = {
  "pagoda-eapi": {
    input: "./pagoda-eapi.json",

    output: {
      target: "./src/common/api/pagoda/generated/client.ts",
      client: "swr",
    },

    hooks: {
      afterAllFilesWrite: "yarn format",
    },
  },
};
