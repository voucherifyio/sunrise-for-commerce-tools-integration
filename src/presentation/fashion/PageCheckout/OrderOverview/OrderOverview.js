// @todo: add scrollbar
// import VuePerfectScrollbar from "vue-perfect-scrollbar";
import PaymentMethod from './PaymentMethod/PaymentMethod.vue';
import BasePrice from 'presentation/components/BasePrice/BasePrice.vue';
import { useI18n } from 'vue-i18n';
import ShippingMethod from './ShippingMethod/ShippingMethod.vue';
import { ref } from 'vue';
import useCartTools from 'hooks/useCartTools';
import {AVAILABLE_CODES_NAMES, CODES_STATUSES, CUSTOM_LINE_ITEM_VOUCHER_SLUG} from "@/constants";
import DiscountCode from "presentation/components/DiscountCode/DiscountCode.vue";
import {getSubTotal, getPrice} from "hooks/useFixedPrice";

export default {
  components: {
    ShippingMethod,
    BasePrice,
    PaymentMethod,
    DiscountCode,
    // VuePerfectScrollbar,
  },
  props: {
    showError: {
      type: Boolean,
      required: false,
    },
    cart: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const paid = ref(false);
    const paymentId = ref(null);
    const cardPaid = (paymentId) => {
      if (paymentId) {
        paymentId.value = paymentId;
      }
      paid.value = true;
    };
    const updateShippingMethod = (shippingId) => {
      emit('update-shipping', shippingId);
    };
    const placeOrder = () => {
      emit('complete-order', paymentId);
    };
    return {
      ...useCartTools(),
      t,
      cardPaid,
      updateShippingMethod,
      paymentId,
      paid,
      placeOrder,
      getSubTotal,
      getPrice
    };
  },

  computed: {
    discountValue(props) {
      const customLineItemWithDiscount = props.cart.customLineItems.find(item => item.slug.startsWith(CUSTOM_LINE_ITEM_VOUCHER_SLUG))
      if(customLineItemWithDiscount) {
        return customLineItemWithDiscount.totalPrice
      }
      return 0
    },

    appliedCodes() {
      const appliedCodes = this.cart.custom?.customFieldsRaw
          .filter(field => field.name === AVAILABLE_CODES_NAMES.DISCOUNT_CODES)
          .reduce(customField => customField)
          .value
          .map(code => JSON.parse(code))
          .filter(code => code.status === CODES_STATUSES.APPLIED)

      return appliedCodes.length ? appliedCodes : false
    }
  }
};
