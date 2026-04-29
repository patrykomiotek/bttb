import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";
import { flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import OrderForm from "@/components/OrderForm.vue";

const baseProps = { defaultSymbol: "EURUSD", defaultPrice: 1.09 };

beforeEach(() => setActivePinia(createPinia()));

describe("OrderForm — render", () => {
  it("renderuje pola formularza", () => {
    render(OrderForm, { props: baseProps });
    expect(screen.getByTestId("order-symbol")).toBeTruthy();
    expect(screen.getByTestId("order-side")).toBeTruthy();
    expect(screen.getByTestId("order-volume")).toBeTruthy();
    expect(screen.getByTestId("order-stoploss")).toBeTruthy();
  });

  it("defaultSymbol jest wpisany w polu symbol", () => {
    render(OrderForm, {
      props: { defaultSymbol: "AAPL.US", defaultPrice: 228 },
    });
    const input = screen.getByTestId("order-symbol") as HTMLInputElement;
    expect(input.value).toBe("AAPL.US");
  });

  it("przycisk submit aktywny gdy walidacja przechodzi", () => {
    render(OrderForm, { props: baseProps });
    const btn = screen.getByTestId("order-submit") as HTMLButtonElement;
    expect(btn.disabled).toBe(false);
  });
});

describe("OrderForm — walidacja touched-first", () => {
  it("błąd symbolu pojawia się dopiero po blur", async () => {
    render(OrderForm, { props: baseProps });
    const symbolInput = screen.getByTestId("order-symbol");

    await fireEvent.update(symbolInput, "abc");
    expect(screen.queryByTestId("order-symbol-error")).toBeNull();

    await fireEvent.blur(symbolInput);
    expect(screen.queryByTestId("order-symbol-error")).not.toBeNull();
  });

  it("błąd wolumenu po wpisaniu ujemnej wartości", async () => {
    render(OrderForm, { props: baseProps });
    const volumeInput = screen.getByTestId("order-volume");

    await fireEvent.update(volumeInput, "-1");
    await fireEvent.blur(volumeInput);
    expect(screen.getByTestId("order-volume-error").textContent).toContain(
      "dodatni",
    );
  });

  it("submit z niepoprawnym formularzem zaznacza wszystkie pola", async () => {
    render(OrderForm, { props: baseProps });
    await fireEvent.update(screen.getByTestId("order-volume"), "-1");
    await fireEvent.submit(screen.getByTestId("order-form"));
    expect(screen.queryByTestId("order-volume-error")).not.toBeNull();
  });
});

describe("OrderForm — submit", () => {
  it("emituje placed po sukcesie", async () => {
    const { emitted } = render(OrderForm, { props: baseProps });
    await fireEvent.update(screen.getByTestId("order-volume"), "0.1");
    await fireEvent.submit(screen.getByTestId("order-form"));
    await flushPromises();

    const placed = emitted().placed;
    expect(placed).toHaveLength(1);
    expect((placed as unknown[][])[0][0]).toMatchObject({
      symbol: "EURUSD",
      side: "BUY",
    });
  });

  it("wyświetla błąd po 400 z API", async () => {
    server.use(
      http.post("*/api/orders", () =>
        HttpResponse.json({ message: "Limit dzienny" }, { status: 400 }),
      ),
    );

    render(OrderForm, { props: baseProps });
    await fireEvent.update(screen.getByTestId("order-volume"), "0.1");
    await fireEvent.submit(screen.getByTestId("order-form"));
    await flushPromises();

    expect(screen.getByTestId("order-submit-error").textContent).toContain(
      "Limit dzienny",
    );
  });

  it('podczas submit pokazuje "Wysyłam…" i blokuje przycisk', async () => {
    let resolveRequest: () => void;
    const blocker = new Promise<void>((r) => (resolveRequest = r));

    server.use(
      http.post("*/api/orders", async () => {
        await blocker;
        return HttpResponse.json(
          {
            id: "ORD-1",
            symbol: "EURUSD",
            side: "BUY",
            volume: 0.1,
            openPrice: 1.09,
            createdAt: "2026-04-22T10:00:00Z",
            status: "OPEN",
          },
          { status: 201 },
        );
      }),
    );

    render(OrderForm, { props: baseProps });
    await fireEvent.update(screen.getByTestId("order-volume"), "0.1");
    fireEvent.submit(screen.getByTestId("order-form"));
    await flushPromises();

    const btn = screen.getByTestId("order-submit") as HTMLButtonElement;
    expect(btn.textContent).toContain("Wysyłam");
    expect(btn.disabled).toBe(true);

    resolveRequest!();
    await flushPromises();
  });
});
