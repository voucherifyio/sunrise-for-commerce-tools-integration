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
      returnVoucherifyCodes: rvc,
      applyVoucherifyDiscount: avd,
    } = useCartTools();

    const removeDiscount = () => {
      const codes = rvc(props.cart);
      avd(codes.filter(elem => elem != props.code))
    };
    return { removeDiscount };
  },
};
