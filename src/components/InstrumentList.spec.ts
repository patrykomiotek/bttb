import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";
import { flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import InstrumentList from "@/components/InstrumentList.vue";

// w pliku InstrumenList.vue zmieniamy jedną linijkę związaną ze store na
// if (store.items.length === 0) {
// void store.load()
// }

beforeEach(() => setActivePinia(createPinia()));

describe("InstrumentList - happy path", () => {
  it("pokazuje loading podczas fetcha", () => {
    render(InstrumentList);
    expect(screen.queryByTestId("instruments-loading")).toBeInTheDocument(); // .not.toBeNull()
  });

  it("renderuje wiersze po odpowiedzi", async () => {
    render(InstrumentList);
    await flushPromises();
    expect(screen.queryByTestId("instrument-row-EURUSD")).toBeInTheDocument();
  });

  it("wiersz zawiera sformatowaną cenę", async () => {
    render(InstrumentList);
    await flushPromises();
    const row = screen.getByTestId("instrument-row-EURUSD");
    expect(row.textContent).toMatch(/1[,.]09/); // /[a-zA-Z-]{36}/
  });

  it("klik Odśwież wywołuje fetch ponownie", async () => {
    let calls = 0;
    server.use(
      http.get("*/api/instruments", () => {
        calls++;
        return HttpResponse.json([]);
      }),
    );

    render(InstrumentList);
    await flushPromises();
    expect(calls).toBe(1);

    await fireEvent.click(screen.getByTestId("instruments-reload"));
    await flushPromises();
    expect(calls).toBe(2);
  });
});

describe("InstrumentList — błąd", () => {
  it("pokazuje błąd po 500", async () => {
    server.use(
      http.get("*/api/instruments", () =>
        HttpResponse.json({}, { status: 500 }),
      ),
    );

    render(InstrumentList);
    await flushPromises();
    expect(screen.queryByTestId("instruments-error")).toBeInTheDocument();
  });
});
