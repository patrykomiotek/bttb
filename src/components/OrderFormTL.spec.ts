import { render, screen, fireEvent } from "@testing-library/vue";
// import userEvent from '@testing-library/user-event'
import OrderForm from "@/components/OrderForm.vue";

describe("OrderForm", () => {
  it("renderuje pola formularza", () => {
    render(OrderForm, {
      props: { defaultSymbol: "EURUSD", defaultPrice: 1.09 },
    });
    // render(<OrderForm :default-symbol="EURUSD" :default-price="1.09" />);

    expect(screen.getByTestId("order-symbol")).toBeInTheDocument();
    expect(screen.getByTestId("order-side")).toBeInTheDocument();
  });

  it("walidacja symbolu", async () => {
    render(OrderForm, {
      props: { defaultSymbol: "EURUSD", defaultPrice: 1.09 },
    });

    const symbolInput = screen.getByTestId("order-symbol");
    // await userEvent.type(symbolInput, 'XTB');
    await fireEvent.update(symbolInput, "XTB");

    const submitBtn = screen.getByRole("button");
    await fireEvent.click(submitBtn);

    // Nieznany symbol: XTB
    // TODO: dodać toBeInTheDocument
    // expect(screen.getByText("Nieznany symbol: XTB")).toBeTruthy();
    expect(await screen.findByText("Nieznany symbol: XTB")).toBeVisible();
    // expect(await screen.findByText(/nieznany symbol: xtb/i)).toBeInTheDocument();
  });
});
