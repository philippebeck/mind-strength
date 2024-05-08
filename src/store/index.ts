import type { State } from '../assets/types'
import { createStore } from 'vuex'

import actions from './actions'
import mutations from './mutations'

export default createStore<State>({
  namespaced: true,

  state: {
    id: null,
    token: null,

    article: {},
    avatar: {},
    product: {},
    user: {},

    articles: [],
    galleries: [],
    images: [],
    links: [],
    orders: [],
    products: [],
    projects: [],
    users: []
  },

  getters: {
    getArticle: (state: State) => state.article,
    getArticles: (state: State) => state.articles,
    getAvatar: (state: State) => state.avatar,
    getGalleries: (state: State) => state.galleries,
    getId: (state: State) => state.id,
    getImages: (state: State) => state.images,
    getLinks: (state: State) => state.links,
    getOrders: (state: State) => state.orders,
    getProduct: (state: State) => state.product,
    getProducts: (state: State) => state.products,
    getProjects: (state: State) => state.projects,
    getToken: (state: State) => state.token,
    getUser: (state: State) => state.user,
    getUsers: (state: State) => state.users
  },

  mutations: mutations,
  actions: actions
})
