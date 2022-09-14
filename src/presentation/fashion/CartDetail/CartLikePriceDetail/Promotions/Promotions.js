import { useI18n } from 'vue-i18n';
import useCartTools from 'hooks/useCartTools';
import { AVAILABLE_CODES_NAMES } from '../../../../../constants';
import BasePrice from 'presentation/components/BasePrice/BasePrice.vue';
import BaseForm from 'presentation/components/BaseForm/BaseForm.vue';
import { CODES_STATUSES } from '../../../../../constants';

export default {
    components: {
        BasePrice,
        BaseForm
    },
  props: {
    cart: {
      type: Object,
      required: true,
    },
    editable: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { t } = useI18n();
    const { applyVoucherifyDiscount, returnVoucherifyCodes } = useCartTools()

    const handlePromotion = (promo) => {
        const codes = returnVoucherifyCodes(props.cart)
          .map(code => JSON.parse(code))
          .filter(code => Object.values(CODES_STATUSES).includes(code.status));
        const tmp = codes.map(code => {
          if(code.code === promo.code) {
            return {
              ...code,
              status: 'NEW'
            }
          }
          return code
        })
        return applyVoucherifyDiscount(tmp)
    }
    return { t, ...useCartTools(), handlePromotion };
  },

  computed: {
    availablePromotions(props) {
      if(!props.cart.custom?.customFieldsRaw.length) {
        return false
      }
      const availablePromos = props.cart.custom?.customFieldsRaw
        .filter(field => field.name === AVAILABLE_CODES_NAMES.DISCOUNT_CODES)
        .reduce(customField => customField)
        .value
        .map(code => JSON.parse(code))
        .filter(code => code.status === 'AVAILABLE')
      
      return availablePromos.length ? availablePromos : false
    }
  }
};
