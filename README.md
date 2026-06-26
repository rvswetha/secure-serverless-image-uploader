### Secure Serverless Image Uploader



A secure, cost-optimized full-stack web application that allows authenticated users to stream image uploads directly to a private Amazon S3 bucket using short-lived pre-signed URLs.



###### **🏗️ Architecture Overview**



The application utilizes a completely serverless backend architecture on AWS:

1. **Frontend**: Single Page Application (SPA) utilizing the Amazon Cognito Identity SDK.
2. **Authentication**: AWS Cognito User Pool manages secure user registration and login.
3. **API Gateway:** An HTTP API routes requests. It uses a native JWT Authorizer attached to the `POST /get-url` route to validate Cognito ID tokens, while leaving the `OPTIONS /get-url` route open to handle browser CORS preflights seamlessly.
4. **Compute (Lambda)**: A Node.js 20.x Lambda function verifies user context, suppresses default SDK checksum headers to prevent signature mismatches, and requests a 5-minute pre-signed upload URL from S3.
5. **Storage**: A private Amazon S3 Bucket protected by strict IAM policies and CORS rules to accept binary `PUT` requests.



###### **🛠️ Tech Stack**



**Frontend**: HTML5, Vanilla JavaScript, CSS3, Amazon Cognito Identity SDK

**Backend**: Node.js 20.x, AWS SDK v3 (@aws-sdk/client-s3)

**Cloud Infrastructure:** AWS (S3, Lambda, API Gateway, Cognito, IAM)



###### **🚀 How to Deploy \& Run Locally**



**Backend Setup**

1\. Create an S3 Bucket with public access blocked and configure CORS to allow `PUT` methods.

2\. Create a Cognito User Pool and an App Client.

3\. Deploy the Node.js code found in `/backend/index.mjs` to an AWS Lambda function. Attach an IAM execution role with `s3:PutObject` permissions.

4\. Build an AWS API Gateway HTTP API with a `POST /get-url` route protected by a Cognito JWT Authorizer, and an open `OPTIONS /get-url` route.



**Frontend Setup**

1\. Clone this repository.

2\. Open `frontend/index.html` and populate the configuration block with your specific AWS resource IDs:


Run the frontend using a local web server (such as VS Code Live Server or python -m http.server).
&#x20;  *const API\_INVOKE\_URL = "YOUR\_API\_GATEWAY\_URL";*

&#x20;  *const USER\_POOL\_ID = "YOUR\_USER\_POOL\_ID";*

&#x20;  *const CLIENT\_ID = "YOUR\_CLIENT\_ID";*

