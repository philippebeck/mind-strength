<template>
  <main>
    <CardElt>
      <template #header>
        <h1 class="sky-dark">
          <i class="fa-regular fa-image fa-lg"
            aria-hidden="true">
          </i>
          {{ gallery.name }}
        </h1>
        <b>{{ gallery.author }}</b>
      </template>

      <template #body>
        <SliderElt :slides="images">
          <template #slide="slotProps">
            <a :href="`/img/galleries/${slotProps.slide.name}`"
              :title="constants.TITLE_WATCH + slotProps.slide.name">
              <MediaElt :src="`/img/galleries/${slotProps.slide.name}`"
                :alt="slotProps.slide.description"
                :width="constants.MEDIA_WIDTH">

                <template #figcaption>
                  {{ slotProps.slide.description }}
                </template>
              </MediaElt>
            </a>
          </template>
        </SliderElt>

        <ListElt :items="images"
          :dynamic="true"
          class="grid-2md-3lg-4wd content-center">

          <template #items="slotProps">
            <a :href="`/img/galleries/${slotProps.item.name}`"
              :title="constants.TITLE_WATCH + slotProps.item.name">

              <MediaElt :id="`${slotProps.item.name.toLowerCase()}`"
                :src="`/img/thumbnails/galleries/${slotProps.item.name}`" 
                :alt="`${slotProps.item.description}`" 
                :width="constants.THUMB_WIDTH"
                :height="constants.THUMB_HEIGHT">

                <template #figcaption>
                  <p class="monospace figcaption">
                    {{ slotProps.item.description }}
                  </p>
                </template>

              </MediaElt>
            </a>
          </template>
        </ListElt>
      </template>

      <template #aside v-if="checkRole('admin')">
        <ImageCreator :constants="constants"/>
      </template>
    </CardElt>
  </main>
</template>

<script>
import { mapState, mapActions } from "vuex"

import CardElt from "@/assets/CardElt"
import ListElt from "@/assets/ListElt"
import MediaElt from "@/assets/MediaElt"
import SliderElt from "@/assets/SliderElt"

import ImageCreator from "@/components/creators/ImageCreator"

export default {
  name: "ImageView",
  components: {
    CardElt,
    ListElt,
    MediaElt,
    SliderElt,
    ImageCreator
  },

  props: ["constants", "user"],
  data() {
    return {
      gallery: {}
    }
  },

  created() {
    this.$serve.getData("/galleries/" + this.$route.params.id)
      .then((gallery) => {
        this.gallery = gallery;

        this.$serve.setMeta(
          gallery.name + this.constants.HEAD, 
          this.constants.META_IMAGE + gallery.author,
          this.constants.UI_URL + "/gallery/" + gallery._id,
          this.constants.UI_URL + "/img/thumbnails/galleries/" + gallery.cover
        );
      })
      .catch(err => { 
        this.$serve.checkError(err);
        this.$router.push("/galleries");
      });

    this.$store.dispatch("listGalleryImages", this.$route.params.id);
  },

  computed: {
    ...mapState(["images"])
  },

  methods: {
    ...mapActions(["listGalleryImages"]),

    /**
     * CHECK ROLE
     * @param {string} role
     * @returns
     */
    checkRole(role) {
      return this.$serve.checkRole(this.user.role, role);
    }
  }
}
</script>
