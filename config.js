const Config = {
    debug: false,
    salesforce: {
        authBaseUrl: process.env["SF_AUTHBASEURL"],
        apiBaseUrl: process.env["SF_APIBASEURL"],
        clientId: process.env["SF_CLIENTID"],
        clientSecret: process.env["SF_CLIENTSECRET"],
        username: process.env["SF_USERNAME"],
        password: process.env["SF_PASSWORD"],
        securityToken: process.env["SF_SECURITYTOKEN"],
        platformEventName: process.env["SF_PLATFORMEVENTNAME"],
        platformEventFields: {
            eventType: process.env["SF_FIELD_EVENTTYPE"],
            accountIdentification: process.env["SF_FIELD_ACCOUNTIDENTIFICATION"],
            accountStatus: process.env["SF_FIELD_ACCOUNTSTATUS"],
            passwordResetLinkRecipient: process.env["SF_FIELD_PASSWORDRESETLINKRECIEVER"]
        },
        platformEventTypeValues: {
            stateChange: process.env["SF_EVENTTYPE_STATECHANGE"],
            passwordReset: process.env["SF_EVENTTYPE_PASSWORDRESET"]
        },
        accountActiveStatusValue: process.env["SF_ACCOUNTACTIVESTATUSVALUE"]
    },
    keycloak: {
        authBaseUrl: process.env["KC_AUTHBASEURL"],
        clientId: process.env["KC_CLIENTID"],
        clientSecret: process.env["KC_CLIENTSECRET"],
        apiBaseUrl: process.env["KC_APIBASEURL"],
    }
}

export default Config