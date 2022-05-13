import useCartTools from 'hooks/useCartTools';

//removeDiscountCode
export default {
  setup() {
    const { applyRemoveVoucherifyDiscountCode: rd } = useCartTools();
    const removeDiscount = () => rd();
    return { removeDiscount };
  },
};
