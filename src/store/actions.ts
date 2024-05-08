import { getData, setError } from '../assets/services'
import type { Article, Avatar, Gallery, Image, Link, Order, Product, Project, User } from '../assets/types'
import val from '../assets/values'

export default {
  // ! ********** ARTICLES **********

  /**
   * ? LIST ARTICLES
   * * Asynchronously lists articles & updates the context with the retrieved articles, or sets an error if the data retrieval fails.
   *
   * @param {{ commit: (arg0: string, arg1: Article[]) => void }} context - The context object with a commit function to update the state
   * @param {Function} context.commit - The commit function used to update the store.
   * @return {Promise<void>} A Promise that resolves when the function completes
   */
  listArticles: async (context: { commit: (arg0: string, arg1: Article[]) => void }): Promise<void> => {
    try {
      const articles: Article[] = await getData(`${val.API_URL}/articles`)
      context.commit('setArticles', articles)
    } catch (err) {
      setError(err)
    }
  },

  /**
   * ? READ ARTICLE
   * * Asynchronously reads an article & commits it to the context.
   *
   * @param {{ commit: (arg0: string, arg1: Article) => void }} context - The context object with a commit function.
   * @param {Function} context.commit - The commit function used to update the store.
   * @param {number} id - The ID of the article to read.
   * @return {Promise<void>} A promise that resolves when the article is read & committed.
   */
  readArticle: async (context: { commit: (arg0: string, arg1: Article) => void }, id: number): Promise<void> => {
    try {
      const article: Article = await getData(`${val.API_URL}/articles/${id}`)
      context.commit('setArticle', article)
    } catch (err) {
      setError(err)
    }
  },

  // ! ********** AUTH **********

  /**
   * ? READ AVATAR
   * * A function that asynchronously reads an avatar from the API & sets it using the provided context.
   *
   * @param {{ commit: (arg0: string, arg1: Avatar) => void }} context - The context object with a commit function to set the avatar
   * @param {Function} context.commit - The commit function used to update the store.
   * @param {number} id - The id of the avatar to read
   * @return {Promise<void>} a Promise that resolves when the avatar is successfully read & set
   */
  readAvatar: async (context: { commit: (arg0: string, arg1: Avatar) => void }, id: number): Promise<void> => {
    try {
      const avatar: Avatar = await getData(`${val.API_URL}/auth/${id}`)
      context.commit('setAvatar', avatar)
    } catch (err) {
      setError(err)
    }
  },

  // ! ********** GALLERIES **********

  /**
   * ? LIST GALLERIES
   * * Asynchronously lists galleries & sets them using the provided context.
   *
   * @param {{ commit: (arg0: string, arg1: Gallery[]) => void }} context - An object with a commit function to set the galleries.
   * @param {Function} context.commit - The commit function used to update the store.
   * @return {Promise<void>} A Promise that resolves when the function completes.
   */
  listGalleries: async (context: { commit: (arg0: string, arg1: Gallery[]) => void }): Promise<void> => {
    try {
      const galleries: Gallery[] = await getData(`${val.API_URL}/galleries`)
      context.commit('setGalleries', galleries)
    } catch (err) {
      setError(err)
    }
  },

  // ! ********** IMAGES **********

  /**
   * ? LIST GALLERY IMAGES
   * * Asynchronously lists images & sets them using the provided context.
   *
   * @param {{ commit: (arg0: string, arg1: Image[]) => void }} context - The context object containing the commit function.
   * @param {Function} context.commit - The commit function used to update the store.
   * @param {number} id - The id of the gallery.
   * @return {Promise<void>} A promise that resolves with void.
   */
  listGalleryImages: async (context: { commit: (arg0: string, arg1: Image[]) => void }, id: number): Promise<void> => {
    try {
      const images: Image[] = await getData(`${val.API_URL}/images/${id}`)
      context.commit('setImages', images)
    } catch (err) {
      setError(err)
    }
  },

  /**
   * ? LIST IMAGES
   * * Retrieves a list of images & commits them to the store.
   *
   * @param {{ commit: (arg0: string, arg1: Image[]) => void }} context - The context object containing the commit function.
   * @param {Function} context.commit - The commit function to update the store.
   * @return {Promise<void>} A promise that resolves when the images are retrieved & committed to the store.
   */
  listImages: async (context: { commit: (arg0: string, arg1: Image[]) => void }): Promise<void> => {
    try {
      const images: Image[] = await getData(`${val.API_URL}/images`)
      context.commit('setImages', images)
    } catch (err) {
      setError(err)
    }
  },

  // ! ********** LINKS **********

  /**
   * ? LIST LINKS
   * * Retrieves a list of links & commits them to the store.
   *
   * @param {{ commit: (arg0: string, arg1: Link[]) => void }} context - The context object containing the commit function.
   * @param {Function} context.commit - The commit function used to update the store.
   * @return {Promise<void>} A promise that resolves when the list of links has been retrieved & committed to the store.
   */
  listLinks: async (context: { commit: (arg0: string, arg1: Link[]) => void }): Promise<void> => {
    try {
      const links: Link[] = await getData(`${val.API_URL}/links`)
      context.commit('setLinks', links)
    } catch (err) {
      setError(err)
    }
  },

  // ! ********** ORDERS **********

  /**
   * ? LIST ORDERS
   * * A function that lists orders.
   *
   * @param {{ commit: (arg0: string, arg1: Order[]) => void }} context - an object with commit function & rootState token
   * @param {Function} context.commit - The commit function used to update the store.
   * @param {{ rootState: { token: string }}} context.rootState - The root state object containing the token property.
   * @param {string} context.rootState.token - The token used for authentication.
   * @return {Promise<void>} a Promise that resolves to void
   */
  listOrders: async (context: {
    commit: (arg0: string, arg1: Order[]) => void
    rootState: { token: string }
  }): Promise<void> => {
    try {
      const orders: Order[] = await getData(`${val.API_URL}/orders`, context.rootState.token)
      context.commit('setOrders', orders)
    } catch (err) {
      setError(err)
    }
  },

  /**
   * ? LIST USER ORDERS
   * * Retrieves a list of orders for a specific user & updates the state with the retrieved orders.
   *
   * @param {{ commit: (arg0: string, arg1: Order[]) => void }} context - The context object containing commit function & rootState token
   * @param {Function} context.commit - The commit function used to update the store.
   * @param {{ rootState: { token: string }}} context.rootState - The root state object containing the token property.
   * @param {string} context.rootState.token - The token used for authentication.
   * @param {number} id - The ID of the user
   * @return {Promise<void>} A promise that resolves when the function completes
   */
  listUserOrders: async (
    context: { commit: (arg0: string, arg1: Order[]) => void; rootState: { token: string } },
    id: number
  ): Promise<void> => {
    try {
      const orders: Order[] = await getData(`${val.API_URL}/orders/${id}`, context.rootState.token)
      context.commit('setUserOrders', orders)
    } catch (err) {
      setError(err)
    }
  },

  // ! ********** PRODUCTS **********

  /**
   * ? LIST PRODUCTS
   * * Asynchronously lists products & commits them to the context.
   *
   * @param {{ commit: (arg0: string, arg1: Product[]) => void }} context - An object with a commit function to store the products.
   * @param {Function} context.commit - The commit function used to update the store.
   * @return {Promise<void>} A promise that resolves with no value.
   */
  listProducts: async (context: { commit: (arg0: string, arg1: Product[]) => void }): Promise<void> => {
    try {
      const products: Product[] = await getData(`${val.API_URL}/products`)
      context.commit('setProducts', products)
    } catch (err) {
      setError(err)
    }
  },

  /**
   * ? READ PRODUCT
   * * A function to read a product asynchronously using the given context & id.
   *
   * @param {{ commit: (arg0: string, arg1: Product) => void }} context - the context object with a commit function
   * @param {Function} context.commit - The commit function used to update the store.
   * @param {number} id - the id of the product to be read
   * @return {Promise<void>} a promise that resolves when the product is read
   */
  readProduct: async (context: { commit: (arg0: string, arg1: Product) => void }, id: number): Promise<void> => {
    try {
      const product: Product = await getData(`${val.API_URL}/products/${id}`)
      context.commit('setProduct', product)
    } catch (err) {
      setError(err)
    }
  },

  // ! ********** PROJECTS **********

  /**
   * ? LIST PROJECTS
   * * Asynchronously lists projects & commits the result to the context.
   *
   * @param {{ commit: (arg0: string, arg1: Project[]) => void }} context - An object containing the commit function to update the state
   * @return {Promise<void>} A promise that resolves when the function completes
   */
  listProjects: async (context: { commit: (arg0: string, arg1: Project[]) => void }): Promise<void> => {
    try {
      const projects: Project[] = await getData(`${val.API_URL}/projects`)
      context.commit('setProjects', projects)
    } catch (err) {
      setError(err)
    }
  },

  // ! ********** USERS **********

  /**
   * ? LIST USERS
   * * A description of the entire function.
   *
   * @param {{ commit: (arg0: string, arg1: User[]) => void }} context - an object containing commit function & rootState token
   * @param {Function} context.commit - The commit function used to update the store.
   * @param {{ rootState: { token: string }}} context.rootState - The root state object containing the token property.
   * @param {string} context.rootState.token - The token used for authentication.
   * @return {Promise<void>} a Promise that resolves to void
   */
  listUsers: async (context: {
    commit: (arg0: string, arg1: User[]) => void
    rootState: { token: string }
  }): Promise<void> => {
    try {
      const users: User[] = await getData(`${val.API_URL}/users`, context.rootState.token)
      context.commit('setUsers', users)
    } catch (err) {
      setError(err)
    }
  },

  /**
   * ? READ USER
   * * Reads a user from the API & updates the store with the retrieved user data.
   *
   * @param {{ commit: (arg0: string, arg1: User) => void }} context - The context object containing the commit & rootState properties.
   * @param {Function} context.commit - The commit function used to update the store.
   * @param {{ rootState: { token: string }}} context.rootState - The root state object containing the token property.
   * @param {string} context.rootState.token - The token used for authentication.
   * @param {number} id - The ID of the user to retrieve.
   * @return {Promise<void>} A promise that resolves when the user data has been updated in the store.
   */
  readUser: async (
    context: { commit: (arg0: string, arg1: User) => void; rootState: { token: string } },
    id: number
  ): Promise<void> => {
    try {
      const user: User = await getData(`${val.API_URL}/users/${id}`, context.rootState.token)
      context.commit('setUser', user)
    } catch (err) {
      setError(err)
    }
  }
}
