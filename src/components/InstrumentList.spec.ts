import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";
import { flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import InstrumentList from "@/components/InstrumentList.vue";

beforeEach(() => setActivePinia(createPinia()));

describe("InstrumentList — happy path", () => {
  it("pokazuje loading podczas fetcha", () => {
    // TODO: render, expect screen.queryByTestId('instruments-loading') !== null
  });

  it("renderuje wiersze po odpowiedzi", async () => {
    // TODO: render, flushPromises, expect screen.queryByTestId('instrument-row-EURUSD')
  });

  it("wiersz zawiera sformatowaną cenę", async () => {
    // TODO
  });

  it("klik Odśwież wywołuje fetch ponownie", async () => {
    let calls = 0;
    server.use(
      http.get("*/api/instruments", () => {
        calls++;
        return HttpResponse.json([]);
      }),
    );
    // TODO: render, fireEvent.click(reloadBtn), expect calls === 2
  });
});

describe("InstrumentList — błąd", () => {
  it("pokazuje błąd po 500", async () => {
    server.use(
      http.get("*/api/instruments", () =>
        HttpResponse.json({}, { status: 500 }),
      ),
    );
    // TODO
  });
});
