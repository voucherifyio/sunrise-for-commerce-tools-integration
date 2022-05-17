import ServerError from 'presentation/components/ServerError/ServerError.vue';
import BaseForm from 'presentation/components/BaseForm/BaseForm.vue';
import BaseInput from 'presentation/components/BaseInput/BaseInput.vue';

import { useI18n } from 'vue-i18n';
import useCartTools from 'hooks/useCartTools';
import useDiscountCode from 'hooks/useDiscountCode';

export default {
  components: {
    BaseForm,
    BaseInput,
    ServerError,
  },
  props: {
    cart: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n();
    const { 
      applyVoucherifyDiscount: ad,
      returnVoucherifyCodes: rvc,
    } = useCartTools();

    const { form, v } = useDiscountCode();

    const applyDiscount = () => {
      const codes = rvc(props.cart);
      return ad([...codes, form.value.code])
    };

    const getErrorMessage = ({ code }) => {
      if (code === 'DiscountCodeNonApplicable') {
        return t('nonApplicable');
      }
      return t('unknownError');
    };

    return {
      t,
      applyDiscount,
      form,
      getErrorMessage,
      v,
    };
  },
};
