import ServerError from 'presentation/components/ServerError/ServerError.vue';
import BaseForm from 'presentation/components/BaseForm/BaseForm.vue';
import BaseInput from 'presentation/components/BaseInput/BaseInput.vue';

import { useI18n } from 'vue-i18n';
import useCartTools from 'hooks/useCartTools';
// import useDiscountCode from 'hooks/useDiscountCode';
import { ref, watch } from 'vue';
import useVuelidate from '@vuelidate/core';
import {CODES_STATUSES} from '../../../../constants'
import useCouponsLimitExceeded from "hooks/useCouponsLimitExceeded";

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
    const enteredCode = ref('')
    const { t } = useI18n();
    const {
      applyVoucherifyDiscount,
      returnVoucherifyCodes,
    } = useCartTools();

    const form = ref({});

    const v = useVuelidate({
      code: {}
    }, form)

    const applyDiscount = () => {
      enteredCode.value = form.value.code;

      const codes = returnVoucherifyCodes(props.cart)
          .map(code => JSON.parse(code))
          .filter(code => Object.values(CODES_STATUSES).includes(code.status));

      form.value.code = ''

      if(enteredCode.value){
        return applyVoucherifyDiscount([...codes, { code: enteredCode.value, status: CODES_STATUSES.NEW }])
      }else{
        return applyVoucherifyDiscount([...codes])
      }
    };

    applyDiscount();

    const getErrorMessage = ({ code }) => {
      if (code === 'DiscountCodeNonApplicable') {
        return t('nonApplicable');
      }
      return t('unknownError');
    };

    watch(props, props => {
      const codes = returnVoucherifyCodes(props.cart).map(code => JSON.parse(code))
      const lastAppliedCode = codes.find(code => code.code === enteredCode.value)
      if(lastAppliedCode) {
        codesInfo.value = {
          message: lastAppliedCode ? `${lastAppliedCode.status !== CODES_STATUSES.APPLIED && lastAppliedCode.errMsg ? lastAppliedCode.errMsg : lastAppliedCode.status}` : '',
          status: lastAppliedCode.status === CODES_STATUSES.APPLIED ? true : false,
        }
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

  computed: {
    couponsLimitExceeded(props) {
      return useCouponsLimitExceeded(props);
    }
  }
};
