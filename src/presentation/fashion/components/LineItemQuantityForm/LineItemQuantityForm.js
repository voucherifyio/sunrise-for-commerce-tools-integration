import useCartTools from 'hooks/useCartTools';

export default {
  name: 'LineItemQuantityForm',
  components: {
    // BaseForm,
    // BaseInput,
  },
  props: {
    lineItemId: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: false,
    },
  },

  computed: {
    quantity_: (props) => props.quantity
  },

  setup(props) {
    const { changeLine, removeLineItem } = useCartTools();

    const increment = function() {
      changeLine(props.lineItemId, props.quantity + 1)
    }

    const decrement = function() {
      const decrementQuantity = props.quantity - 1

      decrementQuantity <= 0 
        ? removeLineItem(props.lineItemId)
        : changeLine(props.lineItemId, decrementQuantity)
    }

    return {increment, decrement}
  }
};
