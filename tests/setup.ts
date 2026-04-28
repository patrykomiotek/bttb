import { afterAll, afterEach, beforeAll } from "vitest";
import "@testing-library/jest-dom";
import { server } from "../src/mocks/server";

// Globalny setup MSW — przechwytuje żądania w testach jednostkowych
// i integracyjnych. W ćwiczeniu 3 overridujemy handlery per-test.
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
