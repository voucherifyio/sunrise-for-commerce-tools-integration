import ServerError from 'presentation/components/ServerError/ServerError.vue';
import BaseForm from 'presentation/components/BaseForm/BaseForm.vue';
import BaseInput from 'presentation/components/BaseInput/BaseInput.vue';

import { useI18n } from 'vue-i18n';
import useCartTools from 'hooks/useCartTools';
import useDiscountCode from 'hooks/useDiscountCode';
import { ref, watch } from 'vue';

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
      const codes = rvc(props.cart).filter(code => JSON.parse(code).status === 'APPLIED' );
      
      return ad([...codes, {code: form.value.code, status: 'NEW'}])
    };

    const getErrorMessage = ({ code }) => {
      if (code === 'DiscountCodeNonApplicable') {
        return t('nonApplicable');
      }
      return t('unknownError');
    };

    let codesInfo = ref('')
    watch(props, props => {
      const codes = rvc(props.cart).map(code => JSON.parse(code))
      codesInfo.value = codes.map(code => `${code.code} - ${code.status}`) //now there is whole array, should be only one object related to the last coupon
    })



    return {
      t,
      applyDiscount,
      form,
      codesInfo,
      getErrorMessage,
      v,
    };
  },
};
