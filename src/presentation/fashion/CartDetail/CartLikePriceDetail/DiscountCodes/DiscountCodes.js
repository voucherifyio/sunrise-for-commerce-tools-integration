import { useI18n } from 'vue-i18n';
import RemoveDiscountCodeForm from './RemoveDiscountCodeForm/RemoveDiscountCodeForm.vue';

export default {
  components: { RemoveDiscountCodeForm },
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
  computed: {
    appliedCodes() {
      const appliedCodes = this.cart.custom?.customFieldsRaw
        .filter(field => field.name === 'discount_codes')
        .reduce(customField => customField)
        .value
        .map(code => JSON.parse(code))
        .filter(code => code.status === 'APPLIED')

      return appliedCodes.length ? appliedCodes : false
    }
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
};
