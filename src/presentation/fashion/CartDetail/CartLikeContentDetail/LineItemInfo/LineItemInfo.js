import BasePrice from 'presentation/components/BasePrice/BasePrice.vue';
import {computed, shallowRef, watch} from 'vue';
import LineItemQuantityForm from 'presentation/components/LineItemQuantityForm/LineItemQuantityForm.vue';
import Remove from 'presentation/components/LineItemQuantityForm/Remove/Remove.vue';
import useCartTools from 'hooks/useCartTools';
import {AVAILABLE_CODES_NAMES, CODES_TYPES} from '../../../../../constants'
import {useI18n} from 'vue-i18n';
import {getPrice, getTotalPrice} from "hooks/useFixedPrice";

export default {
  components: {
    LineItemQuantityForm,
    Remove,
    BasePrice,
  },
  props: {
    lineItem: {
      type: Object,
      required: true,
    },
    extended: {
      type: Boolean,
      default: () => true,
    },
    editable: {
      type: Boolean,
      default: () => true,
    },
    selectable: {
      type: Boolean,
      default: () => false,
    },
  },
  setup(props, { emit }) {
    const selected = shallowRef(false);
    const item = computed(() =>
      props.selectable
        ? {
            lineItemId: props.lineItem.lineId,
            quantity: props.lineItem.quantity,
          }
        : null
    );
    watch(selected, (selected) => {
      if (selected === true) {
        emit('select-return-item', item.value);
      }
      if (selected === false) {
        emit('unselect-return-item', item.value);
      }
    });

    const { t } = useI18n();

    return {
      t,
      selected,
      item,
      ...useCartTools(),
      getPrice,
      getTotalPrice
    };
  },

  computed: {
    quantityFromCode(props){
      const codeWithFreeItem = props.lineItem.custom?.customFieldsRaw
        .find(code => code.name === AVAILABLE_CODES_NAMES.APPLIED_CODES)

      if(codeWithFreeItem) {
        return codeWithFreeItem
          .value
          .map(code => JSON.parse(code))
          .find(code => code.type === CODES_TYPES.UNIT)
          ?.totalDiscountQuantity
      }

      return 0
    }
  }
};
