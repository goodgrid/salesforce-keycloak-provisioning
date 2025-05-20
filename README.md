# Salesforce Keycloak Provisioning
Salesforce Platform Event Listener with Keycloak Integration

This Node.js module subscribes to Salesforce Platform Events using the CometD protocol and triggers corresponding actions in Keycloak based on the event type and payload.

## 🔧 Features
	•	Uses cometd-nodejs-client to listen to Salesforce Platform Events
	•	Authenticates with Salesforce and Keycloak
	•	Reacts to specific event types:
	•	State Change: Activates or deactivates users in Keycloak
	•	Password Reset: Triggers a password reset flow in Keycloak
	•	Logs success and error states

## 📦 Dependencies
	•	cometd
	•	cometd-nodejs-client
	•	Custom modules:
	•	salesforceApi.js: Handles Salesforce authentication
	•	kcApi.js: Interfaces with Keycloak API
	•	config.js: Centralized configuration
	•	logger.js: Logging utility

## 🚀 How It Works
	1.	The CometD client is adapted for Node.js using cometd-nodejs-client.
	2.	Authenticates with Salesforce to get a bearer token.
	3.	Establishes a CometD handshake with the Salesforce event endpoint.
	4.	Subscribes to a specified Platform Event channel.
	5.	Handles events:
	•	If the event type is stateChange:
	•	Activates or deactivates a Keycloak user.
	•	If the event type is passwordReset:
	•	Sends a password reset link via Keycloak.
	•	Logs unhandled event types.

## 📁 Usage
	1.	Make sure your config.js is properly set with:
	•	salesforce.apiBaseUrl
	•	salesforce.platformEventName
	•	salesforce.platformEventFields
	•	salesforce.platformEventTypeValues
	•	salesforce.accountActiveStatusValue
	2.	Run the listener:

`node event-socket.js`


## 📝 Notes
	•	Ensure your Salesforce org is publishing the relevant Platform Events.
	•	Keycloak API endpoints must be accessible and properly configured.
	•	Proper error handling and logging are included for debugging.

