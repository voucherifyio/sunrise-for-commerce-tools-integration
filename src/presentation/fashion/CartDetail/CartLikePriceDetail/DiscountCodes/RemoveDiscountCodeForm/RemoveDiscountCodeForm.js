import useCartTools from 'hooks/useCartTools';

//removeDiscountCode
export default {
  props: {
    cart: {
      type: Object,
      reqired: true,
    },
    code : {
      type: String,
      reqired: true,
    },
  },
  setup(props) {
    const {
      returnVoucherifyCodes,
      applyVoucherifyDiscount,
    } = useCartTools();

    const removeDiscount = () => {
      const codes = returnVoucherifyCodes(props.cart)
        .map(code => JSON.parse(code))
        .filter(code => code.code != props.code)
        
      applyVoucherifyDiscount(codes)
    };
    return { removeDiscount };
  },
};
