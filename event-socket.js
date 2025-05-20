import { adapt } from "cometd-nodejs-client";
import { CometD } from "cometd"
import Salesforce from "./salesforceApi.js";
import Keycloak from "./kcApi.js";
import Config from "./config.js";
import logger from "./logger.js";

// Adapt CometD for use in node.js instead browser
adapt();

const subscribe = async () => {
    const cometd = new CometD();

    cometd.configure({
        url: `${Config.salesforce.apiBaseUrl}cometd/64.0/`,
        requestHeaders: {
            Authorization: `Bearer ${await Salesforce.auth()}`
        },
        appendMessageTypeToURL: false
    });

    cometd.handshake(async (handshakeReply) => {
        if (handshakeReply.successful) {
            logger.info("✅ CometD handshake succeeded");
            cometd.subscribe(`/event/${Config.salesforce.platformEventName}`, async (message) => {
                if (message.data.payload[Config.salesforce.platformEventFields.eventType] == Config.salesforce.platformEventTypeValues.stateChange) {
                    if (message.data.payload[Config.salesforce.platformEventFields.accountStatus] == Config.salesforce.accountActiveStatusValue) {
                        await Keycloak.user.activate(message.data.payload[Config.salesforce.platformEventFields.accountIdentification])
                    } else {
                        await Keycloak.user.deactivate(message.data.payload[Config.salesforce.platformEventFields.accountIdentification])
                    }
                } else if (message.data.payload[Config.salesforce.platformEventFields.eventType] == Config.salesforce.platformEventTypeValues.passwordReset) {
                    await Keycloak.user.resetpassword(
                        message.data.payload[Config.salesforce.platformEventFields.accountIdentification],
                        message.data.payload[Config.salesforce.platformEventFields.passwordResetLinkRecipient],
                    )
                } else {
                    logger.info(`Unhandled event type: ${message.data.payload[Config.salesforce.platformEventFields.accountStatus]}`)
                }
            })
        } else {
            logger.error("❌ CometD handshake failed")
        }
    });
}

subscribe().catch(error => {
    logger.error("Error while setting up CommetD event socket", error)
})
