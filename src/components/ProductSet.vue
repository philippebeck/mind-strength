<template>
  <CardElt id="product-set">
    <template #header>
      <h2>
        <i class="fa-regular fa-lightbulb fa-lg"></i>
        {{ val.PRODUCT_MANAGER }}
      </h2>
    </template>

    <template #body>
      <form enctype="multipart/form-data">
        <ListElt :items="val.PRODUCT_FORM">
          <template #item-1>
            <FieldElt id="name" v-model:value="name" @keyup.enter="createProduct()" :info="val.INFO_NAME">
              <template #legend>{{ val.LEGEND_NAME }}</template>
              <template #label>{{ val.LABEL_NAME }}</template>
            </FieldElt>
          </template>

          <template #item-2>
            <label for="description">{{ val.LEGEND_DESCRIPTION }}</label>
            <Editor
              id="description"
              :api-key="val.TINY_KEY"
              v-model="description"
              @keyup.enter="createProduct()"
              :init="val.TINY_INIT"
            />
          </template>

          <template #item-3>
            <FieldElt id="image" type="file" v-model:value="image" :info="val.INFO_IMAGE">
              <template #legend>{{ val.LEGEND_IMAGE }}</template>
              <template #label>{{ val.LABEL_IMAGE }}</template>
            </FieldElt>
          </template>

          <template #item-4>
            <FieldElt id="alt" type="textarea" v-model:value="alt" :info="val.INFO_ALT">
              <template #legend>{{ val.LEGEND_ALT }}</template>
              <template #label>{{ val.LABEL_ALT }}</template>
            </FieldElt>
          </template>

          <template #item-5>
            <FieldElt
              id="price"
              type="number"
              v-model:value="price"
              @keyup.enter="createProduct()"
              :info="val.INFO_PRICE"
              :min="val.PRICE_MIN"
              :max="val.PRICE_MAX"
            >
              <template #legend>{{ val.LEGEND_PRICE }}</template>
              <template #label>{{ val.LABEL_PRICE }}</template>
            </FieldElt>
          </template>

          <template #item-6>
            <FieldElt
              id="options"
              type="textarea"
              v-model:value="options"
              @keyup.enter="createProduct()"
              :info="val.INFO_OPTIONS"
              :max="100"
            >
              <template #legend>{{ val.LEGEND_OPTIONS }}</template>
              <template #label>{{ val.LABEL_OPTIONS }}</template>
            </FieldElt>
          </template>

          <template #item-7>
            <FieldElt
              id="cat"
              type="select"
              :list="val.CATS_PRODUCT"
              v-model:value="cat"
              @keyup.enter="createProduct()"
              :info="val.INFO_CAT"
            >
              <template #legend>{{ val.LEGEND_CAT }}</template>
              <template #label>{{ val.LABEL_CAT }}</template>
            </FieldElt>
          </template>
        </ListElt>

        <BtnElt
          type="button"
          @click="createProduct()"
          class="btn-green"
          :content="val.CONTENT_CREATE"
          :title="val.TITLE_PRODUCT"
        >
          <template #btn>
            <i class="fa-solid fa-square-plus fa-lg"></i>
          </template>
        </BtnElt>
      </form>
    </template>
  </CardElt>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { checkRange, postData, setError } from '../assets/services'
import type { Product } from '../assets/types'

import BtnElt from './BtnElt.vue'
import CardElt from './CardElt.vue'
import FieldElt from './FieldElt.vue'
import ListElt from './ListElt.vue'
import Editor from '@tinymce/tinymce-vue'

interface Val {
  ALERT_CREATED: string
  ALERT_IMG: string
  API_URL: string
  CAT_PRODUCT: string
  CHECK_STRING: string
  TEXT_MAX: number
  TEXT_MIN: number
}

export default defineComponent({
  name: 'ProductSet',
  components: { BtnElt, CardElt, FieldElt, ListElt, Editor },

  props: ['token', 'val'],
  data() {
    return {
      name: '',
      description: '',
      image: '',
      alt: '',
      price: 0,
      options: [],
      cat: ''
    } as Product
  },

  methods: {
    /**
     * ? CREATE PRODUCT
     * * Create a product by sending a POST request to the server.
     *
     * @returns {Promise<void>} A promise that resolves when the product is created.
     */
    async createProduct(): Promise<void> {
      const { ALERT_CREATED, ALERT_IMG, API_URL, CAT_PRODUCT, CHECK_STRING, TEXT_MAX, TEXT_MIN }: Val = this.val

      this.price = this.price ?? 1
      if (this.cat === '') this.cat = CAT_PRODUCT

      const IS_NAME_CHECKED: boolean = checkRange(this.name, CHECK_STRING)
      const IS_DESC_CHECKED: boolean = checkRange(this.description, CHECK_STRING, TEXT_MIN, TEXT_MAX)
      const IS_ALT_CHECKED: boolean = checkRange(this.alt, CHECK_STRING)

      if (IS_NAME_CHECKED && IS_DESC_CHECKED && IS_ALT_CHECKED) {
        const img: File | undefined = (document.getElementById('image') as HTMLInputElement)?.files?.[0]

        if (img !== undefined) {
          const URL: string = `${API_URL}/products`
          const data: FormData = new FormData()

          data.append('name', this.name)
          data.append('description', this.description)
          data.append('image', img)
          data.append('alt', this.alt)
          data.append('price', this.price.toString())
          data.append('options', JSON.stringify(this.options))
          data.append('cat', this.cat)

          try {
            await postData(URL, data, this.token)
            alert(this.name + ALERT_CREATED)
          } catch (err) {
            setError(err)
          } finally {
            this.$router.go(0)
          }
        } else {
          alert(ALERT_IMG)
        }
      }
    }
  }
})
</script>
