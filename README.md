To make lambda calls asynchronous, we have implemented a two-lambda system where one lambda invokes a second lambda to perform the required action. The first lambda returns a 200_OK status immediately, making the call asynchronous.

However, we encountered an issue when running the modelbuilder-lambda server in Docker as the 'invoke' method from boto3 could not invoke a new lambda. To solve this issue, we have implemented a new 'cb-invoker' server that acts as the first lambda server and invokes the already running lambda by making a POST request to it.

To use the 'cb-invoker' server as the first lambda, update your local .env file by changing the MODEL_BUILDER_SERVICE_URL to point to this server:
MODEL_BUILDER_SERVICE_URL=<private_ip>:9001

Now every call to the MODEL_BUILDER_SERVICE_URL will go through the 'cb-invoker' server, making the calls asynchronous. This server works asynchronously, so when making a request to it, the response will be automatic. This is the same behavior that the new lambda implementation has in Dev/Prod, where we can invoke new lambdas under a lambda server.



Support for new actions:
Line 34 defines the actions that the server could receive and returns the transformed action to call the modelbuilder-lambda. If you need to test new actions, you should add them there.