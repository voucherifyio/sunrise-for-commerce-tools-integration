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
    const codesInfo = ref({})
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

      const newCode = form.value.code//{...form.value.code};
      // form.value.code = ''
      // $v.$reset()
      return applyVoucherifyDiscount([...codes, { code: newCode, status: 'NEW' }])
    };

    const getErrorMessage = ({ code }) => {
      if (code === 'DiscountCodeNonApplicable') {
        return t('nonApplicable');
      }
      return t('unknownError');
    };

    watch(props, props => {
      const codes = returnVoucherifyCodes(props.cart).map(code => JSON.parse(code))
      const lastAppliedCode = codes.find(code => code.code === form.value.code)
      codesInfo.value = {
        message: lastAppliedCode ? `${lastAppliedCode.status !== 'APPLIED' && lastAppliedCode.errMsg ? lastAppliedCode.errMsg : lastAppliedCode.status}` : '',
        status: lastAppliedCode.status === 'APPLIED' ? true : false,
      }
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
