const targetPath = "./src/common/api/indexer/generated/client.ts";

module.exports = {
  /**
   * Docs: https://test-dev.potlock.io/api/schema/swagger-ui
   */
  indexer: {
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
