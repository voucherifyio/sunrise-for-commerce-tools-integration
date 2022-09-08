import { useI18n } from 'vue-i18n';
import RemoveDiscountCodeForm from './RemoveDiscountCodeForm/RemoveDiscountCodeForm.vue';
import BasePrice from 'presentation/components/BasePrice/BasePrice.vue';
import DiscountCode from "presentation/components/DiscountCode/DiscountCode.vue";
import useAppliedCodes from "hooks/useAppliedCodes";

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
      const appliedCodes = useAppliedCodes(this);
      
      return appliedCodes.length ? appliedCodes : false
    }
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
};
