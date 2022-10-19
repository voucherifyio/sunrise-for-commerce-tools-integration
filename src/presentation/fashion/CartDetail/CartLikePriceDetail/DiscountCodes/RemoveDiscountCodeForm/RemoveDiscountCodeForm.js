import useCartTools from 'hooks/useCartTools';
import { CODES_STATUSES } from '../../../../../../constants';

//removeDiscountCode
export default {
  props: {
    cart: {
      type: Object,
      reqired: true,
    },
    code: {
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
        .map((code) => JSON.parse(code))
        .map((code) => {
          if (code.code === props.code) {
            return {
              code: code.code,
              value: code.value,
              status: CODES_STATUSES.DELETED,
              type: code?.type,
            };
          }
          return code;
        });

      applyVoucherifyDiscount(codes);
    };
    return { removeDiscount };
  },
};
