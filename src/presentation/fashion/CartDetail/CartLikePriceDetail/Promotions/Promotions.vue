<style src="./Promotions.scss" lang="scss"></style>
<script src="./Promotions.js"></script>

<template>
<span class="promo-title">Available promotions</span>
<div class="code-container" v-for="code in availablePromotions" :key="code">
  <b>{{code.banner}}</b>
  <a href="#" class="add-promo" @click.prevent="() => handlePromotion(code)">ADD</a>
</div>
</template>