import type { State, Article, Avatar, Gallery, Image, Link, Order, Product, Project, User } from '../assets/types'

export default {
  // ! ********** ARTICLES **********

  /**
   * ? SET ARTICLE
   * * Sets the article in the state by parsing the likes property of the article object & assigning it to the state.
   *
   * @param {State} state - The current state object.
   * @param {Article} article - The article object with the likes property to be parsed.
   * @returns {void}
   */
  setArticle: (state: State, article: Article): void => {
    article.likes = JSON.parse(article.likes)
    state.article = article
  },

  /**
   * ? SET ARTICLES
   * * Sets the articles in the state.
   *
   * @param {State} state - The state object, strongly typed.
   * @param {Article[]} articles - The articles to be set, strongly typed.
   * @returns {void}
   */
  setArticles: (state: State, articles: Article[]): void => {
    for (const article of articles) article.likes = JSON.parse(article.likes)

    state.articles = articles
  },

  // ! ********** AUTH **********

  /**
   * ? SET AVATAR
   * * Set the avatar for the state.
   *
   * @param {State} state - the state object
   * @param {Avatar} avatar - the avatar to set
   * @return {void}
   */
  setAvatar: (state: State, avatar: Avatar): void => {
    state.avatar = avatar
  },

  /**
   * ? SET ID
   * * Sets the ID of the state.
   *
   * @param {State} state - The state object.
   * @return {void} This function does not return a value.
   */
  setId: (state: State): void => {
    const userId = localStorage.getItem('userId')

    if (userId !== null) state.id = JSON.parse(userId)
  },

  /**
   * ? SET TOKEN
   * * A description of the entire function.
   *
   * @param {State} state - parameter to store state
   * @return {void} no return value
   */
  setToken: (state: State): void => {
    const userToken = localStorage.getItem('userToken')

    if (userToken !== null) state.token = JSON.parse(userToken)
  },

  // ! ********** GALLERIES **********

  /**
   * ? SET GALLERIES
   * * Sets the galleries in the state.
   *
   * @param {State} state - The current state object.
   * @param {Gallery[]} galleries - An array of Gallery objects to be set in the state.
   * @return {void} This function does not return anything.
   */
  setGalleries: (state: State, galleries: Gallery[]): void => {
    state.galleries = galleries
  },

  // ! ********** IMAGES **********

  /**
   * ? SET IMAGES
   * * Sets the images in the state.
   *
   * @param {State} state - the state object
   * @param {Image[]} images - an array of images
   * @return {void}
   */
  setImages: (state: State, images: Image[]): void => {
    state.images = images
  },

  // ! ********** LINKS **********

  /**
   * ? SET LINKS
   * * A description of the entire function.
   *
   * @param {State} state - description of parameter
   * @param {Link[]} links - description of parameter
   * @return {void} description of return value
   */
  setLinks: (state: State, links: Link[]): void => {
    state.links = links
  },

  // ! ********** ORDERS **********

  /**
   * ? SET ORDERS
   * * Sets the orders in the state by parsing the products in each order & assigning them to the state.
   *
   * @param {State} state - The current state object.
   * @param {Order[]} orders - An array of Order objects to be set in the state.
   * @return {void} This function does not return anything.
   */
  setOrders: (state: State, orders: Order[]): void => {
    for (const order of orders) order.products = JSON.parse(order.products)

    state.orders = orders
  },

  /**
   * ? SET USER ORDERS
   * * Sets the user orders in the state.
   *
   * @param {State} state - The state object.
   * @param {Order[]} orders - An array of Order objects representing the user orders.
   * @return {void} This function does not return anything.
   */
  setUserOrders: (state: State, orders: Order[]): void => {
    for (const order of orders) {
      delete order.userId
      order.products = JSON.parse(order.products)
    }

    state.orders = orders
  },

  // ! ********** PRODUCTS **********

  /**
   * ? SET PRODUCT
   * * Updates the product options & sets the product in the state.
   *
   * @param {State} state - The current state
   * @param {Product} product - The product to be set
   * @return {void}
   */
  setProduct: (state: State, product: Product): void => {
    product.options = product.options.split(',')
    state.product = product
  },

  /**
   * ? SET PRODUCTS
   * * Sets the products in the state by splitting the options of each product & assigning the result to the state.
   *
   * @param {State} state - The current state object.
   * @param {Product[]} products - An array of products.
   * @return {void} This function does not return anything.
   */
  setProducts: (state: State, products: Product[]): void => {
    for (const product of products) product.options = product.options.split(',')

    state.products = products
  },

  // ! ********** PROJECTS **********

  /**
   * ? SET PROJECTS
   * * Set the projects in the state.
   *
   * @param {State} state - the state object
   * @param {Project[]} projects - the array of projects to set
   * @return {void}
   */
  setProjects: (state: State, projects: Project[]): void => {
    state.projects = projects
  },

  // ! ********** USERS **********

  /**
   * ? SET USER
   * * Sets the user in the state.
   *
   * @param {State} state - the state to update
   * @param {User} user - the user to set
   * @return {void}
   */
  setUser: (state: State, user: User): void => {
    state.user = user
  },

  /**
   * ? SET USERS
   * * Sets the users in the state with the provided array of users.
   *
   * @param {State} state - The current state object.
   * @param {User[]} users - The array of users to be set in the state.
   * @return {void} This function does not return a value.
   */
  setUsers: (state: State, users: User[]): void => {
    state.users = users
  }
}
