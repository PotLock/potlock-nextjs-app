const targetPaths = {
  indexer: "./src/common/api/indexer/internal/client.generated.ts",
};

module.exports = {
  /**
   * Docs: https://test-dev.potlock.io/api/schema/swagger-ui
   */
  indexer: {
    input: "https://test-dev.potlock.io/api/schema",
    output: { target: targetPaths.indexer, client: "swr" },

    hooks: {
      afterAllFilesWrite: `eslint --fix ${targetPaths.indexer}`,
    },
  },
};
