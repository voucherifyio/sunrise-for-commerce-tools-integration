import { useI18n } from 'vue-i18n';
import useCartTools from 'hooks/useCartTools';
import { AVAILABLE_CODES_NAMES } from '../../../../../constants';
import BasePrice from 'presentation/components/BasePrice/BasePrice.vue';
import BaseForm from 'presentation/components/BaseForm/BaseForm.vue';

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
  setup() {
    const { t } = useI18n();
    const applyPromotion = () => {
        console.log('dddddd')
    }
    return { t, ...useCartTools(), applyPromotion };
  },

  computed: {
    availablePromotions(props) {
      console.log(props.cart.cartId)
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
