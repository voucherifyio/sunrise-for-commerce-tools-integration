import RemoveDiscountCodeForm
    from "presentation/CartDetail/CartLikePriceDetail/DiscountCodes/RemoveDiscountCodeForm/RemoveDiscountCodeForm.vue";
import BasePrice from 'presentation/components/BasePrice/BasePrice.vue';

export default {
    props: {
        cart: {
            type: Object,
            required: true,
        },
        editable: {
            type: Boolean,
            default: false,
        },
        code: {
            type: Object,
            required: true,
        }
    },
    components: {
        RemoveDiscountCodeForm,
        BasePrice,
    },
    setup(props) {
        console.log(props.code);
        console.log(props.cart)
    },

};
