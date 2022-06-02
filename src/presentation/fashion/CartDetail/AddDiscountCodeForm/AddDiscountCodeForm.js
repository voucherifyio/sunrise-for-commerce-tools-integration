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
      applyVoucherifyDiscount,
      returnVoucherifyCodes,
    } = useCartTools();

    const { form, v } = useDiscountCode();

    const applyDiscount = () => {
      const codes = returnVoucherifyCodes(props.cart)
        .map(code => JSON.parse(code))
        .filter(code => ['APPLIED', 'NEW'].includes(code.status));

      return applyVoucherifyDiscount([...codes, { code: form.value.code, status: 'NEW' }])
    };

    const getErrorMessage = ({ code }) => {
      if (code === 'DiscountCodeNonApplicable') {
        return t('nonApplicable');
      }
      return t('unknownError');
    };

    let codesInfo = ref('')
    watch(props, props => {
      const codes = returnVoucherifyCodes(props.cart).map(code => JSON.parse(code))
      const lastAppliedCode = codes.find(code => code.code === form.value.code)
      codesInfo.value = lastAppliedCode ? `${lastAppliedCode.status}${lastAppliedCode.status !== 'APPLIED' && lastAppliedCode.errMsg ? ' - ' + lastAppliedCode.errMsg : ''}` : ''
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
