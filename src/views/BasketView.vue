<template>
  <main>
    <header>
      <h1 class="sky-dark">
        <i class="fa-solid fa-basket-shopping fa-lg"></i>
        {{ val.BASKET_VIEW }}
      </h1>
    </header>

    <CardElt v-if="basket[0] !== undefined">
      <template #header>
        <h2>{{ val.BASKET_SUB }}</h2>
        <b>{{ val.INTRO_BASKET }}</b>
      </template>

      <template #body>
        <form>
          <TableElt :items="order">
            <template #head>{{ val.TOTAL }}</template>

            <template #cell-id="slotProps">
              <a :href="`/product/${order[slotProps.index].id}`">
                #{{ slotProps.index + 1 }} ({{ slotProps.item.id }})
              </a>
            </template>

            <template #cell-name="slotProps">
              <a :href="`/product/${order[slotProps.index].id}`">
                <strong>{{ slotProps.item.name }}</strong>
              </a>
            </template>

            <template #cell-image="slotProps">
              <a :href="`/product/${order[slotProps.index].id}`">
                <MediaElt
                  :src="'img/thumbnails/products/' + slotProps.item.image"
                  :alt="slotProps.item.name"
                  :title="slotProps.item.name"
                />
              </a>
            </template>

            <template #cell-option="slotProps">
              <a :href="`/product/${order[slotProps.index].id}`">
                <b>{{ slotProps.item.option }}</b>
              </a>
            </template>

            <template #cell-quantity="slotProps">
              <FieldElt
                :id="`quantity-${slotProps.index}`"
                type="number"
                v-model:value="slotProps.item.quantity"
                @change="updateProductQuantity(`${slotProps.item.id}`, `${slotProps.item.option}`)"
                :info="val.INFO_UP_QUANTITY"
                :min="1"
                :max="100"
              >
              </FieldElt>
            </template>

            <template #cell-price="slotProps">
              <b>{{ slotProps.item.price }} €</b>
            </template>

            <template #body="slotProps">
              <b>{{ slotProps.item.price * slotProps.item.quantity }} €</b>
              <br />

              <BtnElt
                type="button"
                @click="deleteProduct(slotProps.item.id, slotProps.item.option)"
                class="btn-orange"
                :content="val.TITLE_DELETE"
                :title="val.TITLE_DELETE + slotProps.item.name"
              >
                <template #btn>
                  <i class="fa-solid fa-trash fa-lg"></i>
                </template>
              </BtnElt>
            </template>
          </TableElt>

          <p class="deco">
            {{ val.BASKET_TOTAL }}
            <b class="black">{{ total }} {{ val.CURRENCY_SYMBOL }}</b>
          </p>
          <br />

          <BtnElt
            href="/legal"
            :content="val.PAYPAL_TERMS_BTN"
            class="btn-blue"
            target="_blank"
            rel="noopener noreferrer"
          />

          <FieldElt id="checkTerms" type="checkbox" v-model="isTermsAccepted" @click="toggleTerms()">
            <template #legend>{{ val.PAYPAL_TERMS_LEGEND }}</template>
            <template #label>{{ val.PAYPAL_TERMS_LABEL }}</template>
          </FieldElt>

          <div v-if="checkSession('user')" id="paypal"></div>

          <BtnElt v-else href="/login" class="btn-green width-sm" :content="val.CONTENT_ORDER" :title="val.TITLE_ORDER">
            <template #btn>
              <i class="fa-solid fa-cash-register fa-lg"></i>
            </template>
          </BtnElt>

          <BtnElt
            type="button"
            @click="deleteBasket()"
            class="btn-red width-sm"
            :content="val.CONTENT_CLEAR"
            :title="val.TITLE_CLEAR"
          >
            <template #btn>
              <i class="fa-solid fa-trash-can fa-lg"></i>
            </template>
          </BtnElt>
        </form>
      </template>
    </CardElt>

    <b v-else-if="!checkSession('admin')">{{ val.BASKET_EMPTY }}</b>

    <OrderSet v-if="checkSession('admin') && orders.length !== 0" :orders="orders" :token="token" :val="val" />

    <CardElt v-else-if="checkSession('user') && orders.length !== 0">
      <template #header>
        <h2>
          <i class="fa-solid fa-gift fa-lg"></i>
          {{ val.ORDERS_SUB }}
        </h2>
      </template>

      <template #body>
        <TableElt :items="orders">
          <template #cell-id="slotProps">
            <b>#{{ orders[slotProps.index].id }}</b>
          </template>

          <template #cell-products="slotProps">
            <ul>
              <li v-for="(item, index) in orders[slotProps.index].products" :key="index">
                <a :href="`/product/${item.id}`">
                  <ul :title="val.TITLE_GO + item.name">
                    <li>
                      <b>{{ item.name }}</b>
                    </li>
                    <li>
                      <i>({{ item.option }})</i>
                    </li>
                    <li class="black">{{ item.quantity }}x {{ item.price }}€</li>
                  </ul>
                </a>
              </li>
            </ul>
          </template>

          <template #cell-total="slotProps">
            <b>{{ orders[slotProps.index].total }} €</b>
          </template>

          <template #cell-createdAt="slotProps">
            {{ new Date(orders[slotProps.index].createdAt).toLocaleString() }}
          </template>

          <template #cell-updatedAt="slotProps">
            {{ new Date(orders[slotProps.index].updatedAt).toLocaleString() }}
          </template>
        </TableElt>
      </template>
    </CardElt>
  </main>
</template>

<script lang="ts">
import type { Basket, Product } from '../assets/types'

import { defineComponent } from 'vue'
import { mapState, mapActions } from 'vuex'
import { loadScript } from '@paypal/paypal-js'
import { checkRole, getData, postData, setError, setMeta } from '../assets/services'

import BtnElt from '../components/BtnElt.vue'
import CardElt from '../components/CardElt.vue'
import FieldElt from '../components/FieldElt.vue'
import MediaElt from '../components/MediaElt.vue'
import OrderSet from '../components/OrderSet.vue'
import TableElt from '../components/TableElt.vue'

interface Order {
  id: number
  name: string
  image: string
  option: string
  quantity: number
  price: number
}

interface Val {
  ALERT_ORDER_CREATED: string
  API_URL: string
  CONFIRM_BASKET: string
  CURRENCY_ISO: string
  HEAD_BASKET: string
  LOGO_SRC: string
  META_BASKET: string
  ORDER_STATUS: string
  PAYPAL_BTN: string
  PAYPAL_CANCEL: string
  PAYPAL_ERROR: string
  PAYPAL_COLOR: string
  PAYPAL_ID: string
  PAYPAL_LABEL: string
  PAYPAL_NAMESPACE: string
  PAYPAL_SDK: string
  PAYPAL_SHAPE: string
  PAYPAL_STATUS: string
  PAYPAL_TERMS_ERROR: string
  UI_URL: string
}

export default defineComponent({
  name: 'BasketView',
  components: { BtnElt, CardElt, FieldElt, MediaElt, TableElt, OrderSet },
  props: ['avatar', 'val'],

  data() {
    return {
      products: [
        {
          id: 0,
          name: '',
          description: '',
          image: '',
          alt: '',
          price: 0,
          options: '',
          cat: ''
        } as Product
      ],
      basket: [
        {
          id: 0,
          option: '',
          quantity: 0
        } as Basket
      ],
      order: [
        {
          id: 0,
          name: '',
          image: '',
          option: '',
          quantity: 0,
          price: 0
        } as Order
      ],
      total: 0,
      isTermsAccepted: false
    }
  },

  /**
   * ? CREATED
   * * Sets the order by matching the products in the basket with the products in the store
   * * Checks if the user is logged in & with which role
   *
   * @return {Promise<void>} A promise that gets "products"
   */
  async created(): Promise<void> {
    const { API_URL, HEAD_BASKET, META_BASKET, LOGO_SRC, UI_URL }: Val = this.val
    setMeta(HEAD_BASKET, META_BASKET, `${UI_URL}/basket`, UI_URL + LOGO_SRC)

    try {
      this.products = await getData(`${API_URL}/products`)
      this.setBasket()

      if (this.basket[0] !== undefined) {
        this.setOrder()
        this.setTotal()

        if (this.token) this.setPaypal(this.val, this.getTotal, this.createOrder)
      }
    } catch (err) {
      setError(err)
    }

    if (this.checkSession('admin')) {
      await this.$store.dispatch('listOrders', this.id)
    } else if (this.checkSession('user')) {
      await this.$store.dispatch('listUserOrders', this.id)
    }
  },

  computed: {
    ...mapState(['id', 'orders', 'token'])
  },

  methods: {
    ...mapActions(['listOrders', 'listUserOrders']),

    /**
     * ? CHECK SESSION
     * * Checks the session for the specified role.
     *
     * @param {string} role - The role to check.
     * @return {boolean} Returns true if the user has the specified role, otherwise false.
     */
    checkSession(role: string): boolean {
      return checkRole(this.avatar.role, role)
    },

    /**
     * ? TOGGLE TERMS
     * * Toggles the value of the isTermsAccepted property.
     */
    toggleTerms(): void {
      this.isTermsAccepted = !this.isTermsAccepted
    },

    /**
     * ? GET TOTAL
     * * Get the total value.
     *
     * @return {number} The total value.
     */
    getTotal(): number {
      return this.total
    },

    /**
     * ? SET BASKET
     * * Sets the value of the "basket" property by retrieving it from local storage.
     *
     * @return {void} None
     */
    setBasket(): void {
      const basketItem = localStorage.getItem('basket')

      if (basketItem !== null) this.basket = JSON.parse(basketItem)
    },

    /**
     * ? SET ORDER
     * * Sets the order by matching the products in the basket with the products in the store.
     *
     * @return {void} None
     */
    setOrder(): void {
      for (let i = 0; i < this.products.length; i++) {
        const product: Product = this.products[i]

        for (let j = 0; j < this.basket.length; j++) {
          const item: Basket = this.basket[j]

          if (product.id === item.id) {
            let order: Order = {
              id: item.id,
              name: product.name,
              image: product.image,
              option: item.option,
              quantity: Number(item.quantity),
              price: Number(product.price)
            }

            this.order.push(order)
          }
        }
      }
    },

    /**
     * ? SET PAYPAL
     * * Sets up the Paypal payment option and renders the Paypal button on the page.
     *
     * @param {Val} val - The object containing Paypal configuration values.
     * @param {Function} getTotal - The function to get the total value for the Paypal payment.
     * @param {Function} createOrder - The function to create an order with Paypal.
     * @returns {void}
     */
    setPaypal(val: Val, getTotal: Function, createOrder: Function): void {
      const {
        CURRENCY_ISO,
        PAYPAL_BTN,
        PAYPAL_CANCEL,
        PAYPAL_COLOR,
        PAYPAL_ERROR,
        PAYPAL_ID,
        PAYPAL_NAMESPACE,
        PAYPAL_LABEL,
        PAYPAL_SDK,
        PAYPAL_SHAPE,
        PAYPAL_STATUS,
        PAYPAL_TERMS_ERROR
      }: Val = val

      loadScript({
        'client-id': PAYPAL_ID,
        'data-namespace': PAYPAL_NAMESPACE,
        currency: CURRENCY_ISO
      })
        .then((paypal: any) => {
          paypal
            .Buttons({
              style: {
                color: PAYPAL_COLOR,
                shape: PAYPAL_SHAPE,
                label: PAYPAL_LABEL
              },
              onInit: function (data: any, actions: any): void {
                actions.disable()
                const checkTerms = document.querySelector('#checkTerms')

                checkTerms?.addEventListener('change', function (event: Event): void {
                  if ((event.target as HTMLInputElement).checked) {
                    actions.enable()
                  } else {
                    actions.disable()
                  }
                })
              },
              onClick: function (): void {
                if (!(document.querySelector('#checkTerms') as HTMLInputElement).checked) {
                  alert(PAYPAL_TERMS_ERROR)
                }
              },
              createOrder: function (data: any, actions: any): any {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        currency_code: CURRENCY_ISO,
                        value: getTotal()
                      }
                    }
                  ]
                })
              },
              onApprove: function (data: any, actions: any): any {
                return actions.order.capture().then((orderData: any) => {
                  alert(PAYPAL_STATUS + orderData.id + ' : ' + orderData.status)
                  createOrder(orderData.id)
                })
              },
              onCancel: function (): void {
                alert(PAYPAL_CANCEL)
              },
              onError: function (err: any): void {
                alert(PAYPAL_ERROR)
                throw new Error(err)
              }
            })
            .render('#paypal')
            .catch((error: any) => console.error(PAYPAL_BTN, error))
        })
        .catch((error: any) => console.error(PAYPAL_SDK, error))
    },

    /**
     * ? SET TOTAL
     * * Sets the total value based on the prices and quantities of the items in the order.
     *
     * @returns The total value calculated from the order items.
     */
    setTotal(): number {
      let total: number = 0

      for (let i = 0; i < this.order.length; i++) {
        const productTotal: number = this.order[i].price * this.order[i].quantity
        total += productTotal
      }

      return total
    },

    /**
     * ? CREATE ORDER
     * * Creates an order with the given orderId.
     *
     * @param {number} orderId - The ID of the order.
     * @return {Promise<void>} A promise that resolves when the order is created.
     */
    async createOrder(orderId: number): Promise<void> {
      const { ALERT_ORDER_CREATED, API_URL, ORDER_STATUS }: Val = this.val
      const URL: string = `${API_URL}/orders/`

      const order: FormData = new FormData()
      const products: Product[] = []

      for (const product of this.order) {
        delete product.image
        products.push(product)
      }

      order.append('products', JSON.stringify(products))
      order.append('total', this.total.toString())
      order.append('paymentId', orderId.toString())
      order.append('status', ORDER_STATUS)
      order.append('userId', this.id.toString())

      try {
        await postData(URL, order, this.token)
        alert(ALERT_ORDER_CREATED)
        localStorage.removeItem('basket')
      } catch (err) {
        setError(err)
      } finally {
        this.$router.go(0)
      }
    },

    /**
     * ? UPDATE PRODUCT QUANTITY
     * * Updates the quantity of a product in the basket based on the provided ID and option.
     *
     * @param {number} id - The ID of the product.
     * @param {string} option - The option of the product.
     * @returns {void}
     */
    updateProductQuantity(id: number, option: string): void {
      for (let i = 0; i < this.order.length; i++) {
        const element = this.order[i]

        if (element.id === id && element.option === option) {
          for (let j = 0; j < this.basket.length; j++) {
            const item = this.basket[j]

            if (item.id === element.id && item.option === element.option) {
              this.basket[j].quantity = Number(element.quantity)
            }
          }
        }
      }
      this.setTotal()
      localStorage.setItem('basket', JSON.stringify(this.basket))
    },

    /**
     * ? DELETE PRODUCT
     * * Deletes a product from the order and basket arrays based on the given id and option.
     *
     * @param {number} id - The id of the product to be deleted.
     * @param {string} option - The option of the product to be deleted.
     * @returns {void}
     */
    deleteProduct(id: number, option: string): void {
      for (let i = 0; i < this.order.length; i++) {
        const element = this.order[i]

        if (element.id === id && element.option === option) this.order.splice(i, 1)
      }

      for (let i = 0; i < this.basket.length; i++) {
        const item = this.basket[i]

        if (item.id === id && item.option === option) this.basket.splice(i, 1)
      }

      this.setTotal()
      localStorage.setItem('basket', JSON.stringify(this.basket))
    },

    /**
     * ? DELETE BASKET
     * * Deletes the basket.
     */
    deleteBasket(): void {
      const { CONFIRM_BASKET }: Val = this.val

      if (confirm(CONFIRM_BASKET)) {
        localStorage.removeItem('basket')
        this.$router.go(0)
      }
    }
  }
})
</script>

<style>
[id='paypal'] {
  margin: auto;
  max-width: 300px;
}
</style>
../types
