<style src="./AddDiscountCodeForm.scss" lang="scss"></style>
<i18n src="./AddDiscountCodeForm.txt" lang="yaml"></i18n>
<script src="./AddDiscountCodeForm.js"></script>

<template>
  <BaseForm
    :vuelidate="v"
    :onSubmit="applyDiscount"
  >
    <div class="discount-code">
      <BaseInput
        v-model="v.code.$model"
        :vuelidate="v.code"
        :placeholder="t('code')"
        type="text"
        id="promo-code"
        data-test="discount-code-input"
        :disabled="couponsLimitExceeded"
      />
      <button
        class="coupon-btn"
        type="submit"
        data-test="apply-discount-code-button"
        :disabled="couponsLimitExceeded"
      >
        {{ t('apply') }}
      </button>
    </div>
    <p class="message" :class="{ 'voucher-error': !codesInfo.status }">
      {{codesInfo.message}}
    </p>
  </BaseForm>
</template>
