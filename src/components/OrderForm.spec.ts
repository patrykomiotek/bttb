import { mount } from "@vue/test-utils";
import OrderForm from "@/components/OrderForm.vue";

describe("OrderForm", () => {
  it("renderuje pola formularza", () => {
    const wrapper = mount(OrderForm, {
      props: { defaultSymbol: "EURUSD", defaultPrice: 1.09 },
    });

    expect(wrapper.find('[data-testid="order-symbol"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="order-side"]').exists()).toBe(true);
  });
});
