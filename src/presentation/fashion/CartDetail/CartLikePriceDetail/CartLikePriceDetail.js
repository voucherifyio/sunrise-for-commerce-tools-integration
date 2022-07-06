import { useI18n } from 'vue-i18n';
import BasePrice from 'presentation/components/BasePrice/BasePrice.vue';
import DiscountCodes from './DiscountCodes/DiscountCodes.vue';
import useCartTools from 'hooks/useCartTools';
import {CUSTOM_LINE_ITEM_VOUCHER_NAME} from '../../../../constants'

export default {
  components: {
    DiscountCodes,
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
      const customLineItemWithDiscount = props.cart.customLineItems.find(item => item.name.startsWith(CUSTOM_LINE_ITEM_VOUCHER_NAME))
      if(customLineItemWithDiscount) {
        return customLineItemWithDiscount.totalPrice
      }
      return 0
    }
  }
};
