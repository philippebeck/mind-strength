<template>
  <main>
    <NavElt :items="getCats"
      class="sidebar">
      <template #hide>
        <i class="fa-solid fa-eye fa-fw" 
        :title="constants.TITLE_TOGGLE"></i>
      </template>

      <template #first>
        <a href="/basket"
          :title="constants.TITLE_BASKET">
          <i class="fa-solid fa-basket-shopping fa-fw"></i>
        </a>
      </template>

      <template #last v-if="checkRole('editor')">
        <a href="#create-product"
          :title="constants.PRODUCT_CREATOR">
          <i class="fa-regular fa-lightbulb fa-fw"></i>
        </a>
      </template>

      <template #top>
        <i class="fa-solid fa-chevron-circle-up fa-fw" 
          :title="constants.TITLE_TOP"></i>
      </template>
    </NavElt>

    <CardElt id="top"
      :isArticle="true"
      class="container-90md-80lg-70wd">
      <template #header>
        <h1 class="sky-dark">
          <i class="fa-solid fa-store fa-lg"
            aria-hidden="true">
          </i>
          {{ constants.SHOP_VIEW }}
        </h1>
        <b>{{ constants.INTRO_PRODUCT }}</b>
      </template>

      <template #body>
        <ListElt :items="getItemsByCat(products)"
          :dynamic="true">

          <template #items="slotProps">
            <h2 :id="slotProps.item[0].cat"
              class="sky-dark ani-turn3D-loop-altrev-into">
              {{ slotProps.item[0].cat }}
            </h2>
          </template>

          <template #nested="slotProps">

            <CardElt itemscope
              itemtype="https://schema.org/Product">
              <template #header>
                  <h3 itemprop="name"
                    class="sky-dark">
                    {{ slotProps.value.name }}
                  </h3>
              </template>

              <template #body>
                <BtnElt v-if="getAverage(slotProps.value._id) !== undefined"
                  :href="`product/${slotProps.value._id}#reviews`"
                  itemprop="aggregateRating"
                  itemscope
                  itemtype="https://schema.org/AggregateRating"
                  class="btn-violet"
                  :title="constants.TITLE_REVIEW_READ + slotProps.value.name">

                  <template #btn>
                    <b itemprop="ratingValue">
                      {{ getAverage(slotProps.value._id) }}
                    </b> <i class="fa-solid fa-star"></i>
                  </template>
                </BtnElt>

                <BtnElt v-else-if="checkRole('user')" 
                  :href="`product/${slotProps.value._id}#review`"
                  class="btn-violet"
                  :content="constants.CONTENT_REVIEW_WRITE"
                  :title="constants.TITLE_REVIEW_FIRST + slotProps.value.name" />

                <BtnElt v-else 
                  href="/login"
                  class="btn-violet"
                  :content="constants.CONTENT_REVIEW_LOGIN"
                  :title="constants.TITLE_REVIEW_FIRST + slotProps.value.name" />

                <a :href="`product/${slotProps.value._id}`"
                  itemprop="url"
                  :title="constants.TITLE_WATCH + slotProps.value.name">

                  <MediaElt :id="`${slotProps.value.name.toLowerCase()}-${slotProps.value.cat.toLowerCase()}`"
                    :src="`img/thumbnails/products/${slotProps.value.image}`" 
                    :alt="`${slotProps.value.alt}`" 
                    :width="constants.THUMB_WIDTH"
                    :height="constants.THUMB_HEIGHT"
                    itemprop="image">

                    <template #figcaption>
                      <p v-html="slotProps.value.description.split(':')[0]"
                        class="monospace figcaption">
                      </p>

                      <p itemprop="offers"
                        itemscope
                        itemtype="https://schema.org/Offer">
                        <b itemprop="price">
                          {{ slotProps.value.price }}
                        </b> <b itemprop="priceCurrency">
                          {{ this.priceCurrency }}
                        </b>
                      </p>
                    </template>

                  </MediaElt>
                </a>
              </template>
            </CardElt>
          </template>
        </ListElt>
      </template>

      <template #aside v-if="checkRole('editor')">
        <ProductCreator :constants="constants"/>
      </template>
    </CardElt>
  </main>
</template>

<script>
import { mapState, mapActions } from "vuex"

import BtnElt from "@/assets/BtnElt"
import CardElt from "@/assets/CardElt"
import ListElt from "@/assets/ListElt"
import MediaElt from "@/assets/MediaElt"
import NavElt from "@/assets/NavElt"

import ProductCreator from "@/components/creators/ProductCreator"

export default {
  name: "ShopView",
  components: {
    BtnElt,
    CardElt,
    ListElt,
    MediaElt,
    NavElt,
    ProductCreator
  },
  props: ["constants", "user"],

  data() {
    return {
      scores: [],
      priceCurrency: ""
    }
  },

  created() {
    this.$store.dispatch("listProducts");
    this.$store.dispatch("listReviews");

    this.$serve.setMeta(
      this.constants.HEAD_SHOP, 
      this.constants.META_SHOP,
      this.constants.UI_URL + "/shop",
      this.constants.UI_URL + this.constants.LOGO_SRC
    );

    this.priceCurrency = this.constants.CURRENCY_ISO;
  },

  updated() {
    const descriptionArray = document.getElementsByClassName("figcaption");

    for (let descriptionElt of descriptionArray) {
      descriptionElt.firstChild.setAttribute("itemprop", "description");
    }
  },

  computed: {
    ...mapState(["products", "reviews"]),

    /**
     * SET CATEGORIES
     * @returns
     */
    getCats() {
      return this.$serve.getCats(this.products);
    }
  },

  methods: {
    ...mapActions(["listProducts", "listReviews"]),

    /**
     * CHECK ROLE
     * @param {string} role
     * @returns
     */
    checkRole(role) {
      return this.$serve.checkRole(this.user.role, role);
    },

    /**
     * SORT ITEMS BY CATEGORY
     * @param {array} items 
     */
    getItemsByCat(items) {
      return this.$serve.getItemsByCat(items);
    },

    /** 
     * GET SCORES AVERAGE
     * @returns
     */
    getAverage(productId) {
      return this.$serve.getAverage(productId, this.reviews);
    }
  }
}
</script>
