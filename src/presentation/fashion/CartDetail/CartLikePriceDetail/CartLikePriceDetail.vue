<style src="./style.css" scoped></style>
<i18n src="./CartLikePriceDetail.txt" lang="yaml"></i18n>
<script src="./CartLikePriceDetail.js"></script>
<template>
  <div v-if="cart" class="grand-total-wrap">
    <h4>{{ t('cartTotals') }}</h4>
    <div class="grand-total-content">
      <div class="single-grand-total">
        <div class="single-grand-total-left col-sm-6">
          <span>{{ t('subtotal') }}</span>
        </div>
        <div
          class="single-grand-total-right col-sm-6"
          data-test="cart-subtotal-price"
        >
          <span>
            <BasePrice :price="subTotal(cart)" />
          </span>
        </div>
      </div>

      <div class="single-grand-total">
        <div class="single-grand-total-left col-sm-6">
          <span>{{ t('salesTax') }}</span>
        </div>
        <div
          class="single-grand-total-right col-sm-6"
          data-test="cart-taxes-amount"
        >
          <span>
            <BasePrice :price="taxes(cart)" />
          </span>
        </div>
      </div>

      <Promotions v-if="!couponsLimitExceeded"
        :cart="cart"
        :editable="editable"
      />
      <div v-else>
        <span class="voucher-error">
          {{t('couponsLimitExceeded')}} {{couponsLimit}}
        </span>
      </div>

      <div class="mb-20"></div>
      <DiscountCodes
        v-if="discountVoucherifyCodesExist(cart)"
        :cart="cart"
        :editable="editable"
      />

    </div>
    <div class="cart-total-wrap">
      <div class="row" v-if="discountValue.centAmount != 0">
        <div class="single-cart-total-left col-sm-6">
          <b>{{ t('discount') }}</b>
        </div>
        <div
          class="single-cart-total-right col-sm-6"
          data-test="cart-total-price"
        >
          <b>
            <BasePrice :price="{ value: discountValue }" />
          </b>
        </div>
      </div>
      <div class="row">
        <div class="single-cart-total-left col-sm-6">
          <b>{{ t('total') }}</b>
        </div>
        <div
          class="single-cart-total-right col-sm-6"
          data-test="cart-total-price"
        >
          <b>
            <BasePrice :price="{ value: cart.totalPrice }" />
          </b>
        </div>
      </div>
    </div>
    <div class="grand-btn">
      <router-link
        :to="{ name: 'checkout' }"
        data-test="checkout-button"
        >{{ t('checkout') }}</router-link
      >
    </div>
  </div>
</template>
