import { useI18n } from 'vue-i18n';
import RemoveDiscountCodeForm from './RemoveDiscountCodeForm/RemoveDiscountCodeForm.vue';
import BasePrice from 'presentation/components/BasePrice/BasePrice.vue';
import DiscountCode from "presentation/components/DiscountCode/DiscountCode.vue";
import { AVAILABLE_CODES_NAMES, CODES_STATUSES } from "../../../../../constants";

export default {
  components: { RemoveDiscountCodeForm, BasePrice, DiscountCode },
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
        .filter(field => field.name === AVAILABLE_CODES_NAMES.DISCOUNT_CODES)
        .reduce(customField => customField)
        .value
        .map(code => JSON.parse(code))
        .filter(code => code.status === CODES_STATUSES.APPLIED)
      
      return appliedCodes.length ? appliedCodes : false
    }
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
};
