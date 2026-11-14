import { afterEach, expect, it, vi } from "vitest";

import { getEnvConfig } from "../src/common/_config/env";

vi.mock("../src/common/_config/production.env-config", () => ({
  envConfig: { platformName: "Production" },
}));

vi.mock("../src/common/_config/staging.env-config", () => ({
  envConfig: { platformName: "Staging" },
}));

vi.mock("../src/common/_config/test.env-config", () => ({ envConfig: { platformName: "Test" } }));

afterEach(() => vi.unstubAllEnvs());

it.each([
  [undefined, "test"],
  ["unknown", "test"],
  ["PRODUCTION", "production"],
  ["staging", "staging"],
])("selects a valid environment for %s", (value, expected) => {
  vi.stubEnv("NEXT_PUBLIC_ENV", value);
  expect(getEnvConfig().envTag).toBe(expected);
});
