import axios from 'axios'
import logger from './logger.js'
import Config from './config.js'

let accesstoken = ""

const kcAuth = axios.create({
    baseURL: Config.keycloak.authBaseUrl
})

const kcApi = axios.create({
    baseURL: Config.keycloak.apiBaseUrl
})


kcApi.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${accesstoken}`
    return config
})

kcApi.interceptors.response.use(response => response, async (error) => {
    const request = error.config;

    if (error.response && error.response.status === 401 && !request._retry) {
        request._retry = true
        await Keycloak.auth()
        return kcApi.request(request);
    }
    return Promise.reject(error);
})


const Keycloak = {
    auth: async () => {
        try {
            const params = new URLSearchParams();
            params.append('grant_type', 'client_credentials');
            params.append('client_id', Config.keycloak.clientId);
            params.append('client_secret', Config.keycloak.clientSecret);
    
            const response = await kcAuth.post(`token`, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            
            accesstoken = response.data.access_token
        } catch(error) {
            logger.error(`Error getting token`, error)
            if (Config.debug) console.error(error)
        }
    },
    user: {
        get: async (username) => {
            try {
                const { data : users } = await kcApi.get(`/users?username=${username}`)
                return users[0].id    
            } catch(error) {
                logger.error(`Error getting user ${username}`, error)
                if (Config.debug) console.error(error)
            }
        },
        create: async (username) => {
            logger.info(`Creating user ${username}`)
            try {
                const creationResponse = await kcApi.post("/users", {
                    username: username,
                    enabled: false
                })
                return await Keycloak.user.get(username)
    
            } catch(error) {
                logger.error(`Error creating user ${username}`, error)
                if (Config.debug) console.error(error)
            }
        },
        activate: async (username) => {
            logger.info(`Activating user ${username}`)
            try {
                let userId = await Keycloak.user.get(username)
                if (!userId) {
                    userId = await Keycloak.user.create(username)
                }

                const response = await kcApi.put(`/users/${userId}`, {
                    enabled: true,
                })
                return response.data
            } catch(error) {
                logger.error(`Error activating user ${username}.`, error)                
                if (Config.debug) console.error(error)
            }    
        },
        deactivate: async (username) => {
            logger.info(`Deactivating user ${username}`)
            let userId = await Keycloak.user.get(username)
            if (!userId) {
                userId = await Keycloak.user.create(username)
            }

            try {
                const response = await kcApi.put(`/users/${userId}`, {
                    enabled: false,
                })
                return response.data
            } catch(error) {
                logger.error(`Error deactivating user ${username} (${userId}).`, error)
                if (Config.debug) console.error(error)
            }
        },
        resetpassword: async (username, receiverEmail) => {
            logger.info(`Starting reset-password flow for user ${username}`)
            let userId = await Keycloak.user.get(username)
            if (!userId) {
                userId = await Keycloak.user.create(username)
            }

            try {
                const response = await kcApi.put(`/users/${userId}`, {
                    email: receiverEmail,
                    emailVerified: true,
                    enabled: true
                })
                
                await kcApi.put(`/users/${userId}/execute-actions-email`, ["UPDATE_PASSWORD"]);
            } catch(error) {
                logger.error(`Error starting reset-password flow for user ${username} (${userId}).`, error)                
                if (Config.debug) console.error(error)
            }    
        }
    }
}


export default Keycloak