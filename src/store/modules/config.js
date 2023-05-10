export default {
    state: {
        config: {},
        metaConfig: {}
    },

    getters: {
        config: state => state.config,
        metaConfig: state => state.metaConfig
    },

    actions: {
        async getConfig({ commit, dispatch }) {
            let r = await dispatch('api_request', {
                method: '/config',
                options: {
                    method: 'get',
                }
            })
            commit('setConfig', r)

        },
        async getMetaConfig({ commit, dispatch }) {
            let r = await dispatch('api_request', {
                method: '/config-meta',
                options: {
                    method: 'get',
                }
            })
            commit('setMetaConfig', r)

        },
        async updateConfig({ dispatch }, local_config) {
            await dispatch('api_request', {
                method: '/config',
                options: {
                    method: 'put',
                    body: JSON.stringify(local_config)
                }
            })
            await dispatch('getConfig')
        },
        
    },

    mutations: {
        setConfig(state, config) {
            state.config = { ...config }
        },
        setMetaConfig(state, metaConfig) {
            state.metaConfig = { ...metaConfig }
        },
    }
}