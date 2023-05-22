import Vue from 'vue'
import Vuex from 'vuex'
import config from './modules/config'

Vue.use(Vuex)

export default new Vuex.Store({
  getters: {
    url() {
      return process.env.NODE_ENV == 'development' ? 'http://127.0.0.1:12000' : ''
    }
  },
  mutations: {
  },
  actions: {
    async api_request(ctx, options) {
      let url = `${options.method}`

      options.options['headers'] = { 'content-type': 'application/json' }

      if (options.options.params) {
        let query = Object.keys(options.options.params)
          .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(options.options.params[k]))
          .join('&');
        url += '?' + query
      }
      console.log(url)

      let r = await fetch(url, options.options || {})
      const response = await r.json()
      if (response.error)
        throw response.error_message
      else 
        return response
      

    }
  },
  modules: {
    config,
  }
})
