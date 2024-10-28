const targetPath = "./src/common/api/pagoda/generated/client.ts";

module.exports = {
  "pagoda-eapi": {
    input: "./pagoda-eapi.json",

    output: {
      target: targetPath,
      client: "swr",
    },

    hooks: {
      afterAllFilesWrite: `eslint --fix ${targetPath}`,
    },
  },
};
