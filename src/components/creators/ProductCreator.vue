<template>
  <CardElt>
    <template #header>
      <h2 id="create-product">
        <i class="fa-regular fa-lightbulb fa-lg"
          aria-hidden="true">
        </i>
        {{ constants.PRODUCT_CREATOR }}
      </h2>
    </template>

    <template #body>
      <form method="post"
        enctype="multipart/form-data">
        <ListElt :items="constants.PRODUCT_FORM">

          <template #item-1>
            <FieldElt v-model:value="name"
              @keyup.enter="createProduct()"
              :info="constants.INFO_NAME">

              <template #legend>
                {{ constants.LEGEND_NAME }}
              </template>
              <template #label>
                {{ constants.LABEL_NAME }}
              </template>
            </FieldElt>
          </template>

          <template #item-2>
            <label for="description">
              {{ constants.LEGEND_DESCRIPTION }}
            </label>

            <Editor id="description"
              :api-key="constants.TINY_KEY"
              v-model="description"
              @keyup.enter="createProduct()"
              :init="{
                toolbar:
                  'undo redo outdent indent align lineheight | \
                  bold italic underline strikethrough backcolor | \
                  blocks fontfamily fontsize'
              }"/>
          </template>

          <template #item-3>
            <FieldElt id="image"
              type="file"
              v-model:value="image"
              :info="constants.INFO_IMAGE">

              <template #legend>
                {{ constants.LEGEND_IMAGE }}
              </template>
              <template #label>
                {{ constants.LABEL_IMAGE }}
              </template>
            </FieldElt>
          </template>

          <template #item-4>
            <FieldElt type="textarea"
              v-model:value="alt"
              :info="constants.INFO_ALT">

              <template #legend>
                {{ constants.LEGEND_ALT }}
              </template>
              <template #label>
                {{ constants.LABEL_ALT }}
              </template>
            </FieldElt>
          </template>

          <template #item-5>
            <FieldElt type="number"
              v-model:value="price"
              @keyup.enter="createProduct()"
              :info="constants.INFO_PRICE"
              :min="constants.PRICE_MIN"
              :max="constants.PRICE_MAX">

              <template #legend>
                {{ constants.LEGEND_PRICE }}
              </template>
              <template #label>
                {{ constants.LABEL_PRICE }}
              </template>
            </FieldElt>
          </template>

          <template #item-6>
            <FieldElt type="textarea"
              v-model:value="options"
              @keyup.enter="createProduct()"
              :info="constants.INFO_OPTIONS"
              :max="100">

              <template #legend>
                {{ constants.LEGEND_OPTIONS }}
              </template>
              <template #label>
                {{ constants.LABEL_OPTIONS }}
              </template>
            </FieldElt>
          </template>

          <template #item-7>
            <FieldElt type="select"
              :list="constants.CATS_PRODUCT"
              v-model:value="cat"
              @keyup.enter="createProduct()"
              :info="constants.INFO_CATEGORY">

              <template #legend>
                {{ constants.LEGEND_CATEGORY }}
              </template>
              <template #label>
                {{ constants.LABEL_CATEGORY }}
              </template>
            </FieldElt>
          </template>
        </ListElt>

        <BtnElt type="button"
          @click="createProduct()" 
          class="btn-green"
          :content="constants.CONTENT_CREATE"
          :title="constants.PRODUCT_CREATOR">

          <template #btn>
            <i class="fa-solid fa-square-plus fa-lg"></i>
          </template>
        </BtnElt>
      </form>
    </template>
  </CardElt>
</template>

<script>
import BtnElt from "@/assets/BtnElt"
import CardElt from "@/assets/CardElt"
import FieldElt from "@/assets/FieldElt"
import ListElt from "@/assets/ListElt"

import Editor from "@tinymce/tinymce-vue"

export default {
  name: "ProductCreator",
  components: {
    BtnElt,
    CardElt,
    FieldElt,
    ListElt,
    Editor
  },

  props: ["constants"],
  data() {
    return {
      name: "",
      description:"",
      image: "",
      alt: "",
      price: null,
      options: "",
      cat: ""
    }
  },

  methods: {
    /**
     * CREATE PRODUCT
     */
    createProduct() {
      if (this.$serve.checkString(this.name) && 
        this.$serve.checkString(this.description, this.constants.TEXT_MIN, this.constants.TEXT_MAX) && 
        this.$serve.checkString(this.alt)) {

        if (this.cat === "") { this.cat = this.constants.CAT_PRODUCT }
        let image = document.getElementById("image").files[0];

        if (image !== undefined) {
          let product = new FormData();

          product.append("name", this.name);
          product.append("description", this.description);
          product.append("image", image);
          product.append("alt", this.alt);
          product.append("price", this.price);
          product.append("options", this.options);
          product.append("cat", this.cat);
          product.append("created", Date.now());
          product.append("updated", Date.now());

          this.$serve.postData("/products", product)
            .then(() => {
              alert(this.name + this.constants.ALERT_CREATED);
              this.$router.go();
            })
            .catch(err => { this.$serve.checkError(err) });

        } else {
          alert(this.constants.ALERT_IMG);
        }
      }
    }
  }
}
</script>