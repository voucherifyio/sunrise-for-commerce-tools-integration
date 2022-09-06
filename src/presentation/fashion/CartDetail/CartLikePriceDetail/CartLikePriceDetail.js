import { useI18n } from 'vue-i18n';
import BasePrice from 'presentation/components/BasePrice/BasePrice.vue';
import DiscountCodes from './DiscountCodes/DiscountCodes.vue';
import Promotions from './Promotions/Promotions.vue';
import useCartTools from 'hooks/useCartTools';
import {CUSTOM_LINE_ITEM_VOUCHER_SLUG} from '../../../../constants'
import useCouponsLimitExceeded from "hooks/useCouponsLimitExceeded";

export default {
  components: {
    DiscountCodes,
    Promotions,
    BasePrice,
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
    return { t, ...useCartTools() };
  },

  computed: {
    discountValue(props) {
      const customLineItemWithDiscount = props.cart.customLineItems.find(item => item.slug.startsWith(CUSTOM_LINE_ITEM_VOUCHER_SLUG))
      if(customLineItemWithDiscount) {
        return customLineItemWithDiscount.totalPrice
      }
      return 0
    },

    isValidationFailed(props){
      const isValidationFailed = props.cart.custom.customFieldsRaw.find(field => field.name === 'isValidationFailed')

      return isValidationFailed?.value ?? false;
    },

    couponsLimitExceeded(props){
      return useCouponsLimitExceeded(props);
    },

    couponsLimit(props){
      const couponLimit = props.cart.custom.customFieldsRaw.find(field => field.name === 'couponsLimit')

      return couponLimit?.value ?? 5;
    },
  }
};
