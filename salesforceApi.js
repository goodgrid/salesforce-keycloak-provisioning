import axios from 'axios'
import Config from './config.js'

const sfAuth = axios.create({
    baseURL: Config.salesforce.authBaseUrl
})

const sfApi = axios.create({
    baseURL: Config.salesforce.apiBaseUrl
})


const Salesforce = {
    auth: async () => {
        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('client_id', Config.salesforce.clientId);
        params.append('client_secret', Config.salesforce.clientSecret);
        params.append('username', Config.salesforce.username);
        params.append('password', `${Config.salesforce.password}${Config.salesforce.securityToken}`);

        const response = await sfAuth.post("token", params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return response.data.access_token
    }
}

export default Salesforce