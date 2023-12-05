# Ticketing Manager

The project is a modern web application employing microservices architecture with TypeScript, Node.js, React, and Next.js. Docker and Kubernetes facilitate efficient containerization and orchestration, ensuring scalability. Core functionalities encompass user authentication, ticket management, order processing, and secure payment transactions via PayPal APIs. The Expiration Service handles background tasks, utilizing Bull and Redis for job queue management. A responsive Next.js-based Client Service provides an intuitive front-end experience. MongoDB serves as a NoSQL database for multiple microservices, fostering data consistency. NATS Streaming Server enables seamless event-driven communication between microservices. The project's modular structure enhances maintainability, flexibility, and easy expansion. Overall, the combination of cutting-edge technologies and a microservices approach empowers a robust and adaptable web application.

![ticketBG](https://github.com/MhmoudYahia/ticketing/assets/94763036/acdcb972-6252-433b-98ed-87049129c842)


&nbsp;
## 🧰 &nbsp; Tech Stack 🛠 

### Backend
 - ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
 - ![Microservices](https://img.shields.io/badge/Microservices-007D8A?style=flat&logo=microsoft-azure&logoColor=white)
 - ![Nodejs](https://img.shields.io/badge/-Nodejs-339933?style=flat&logo=Node.js&logoColor=white)
 - ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=flat&logo=express&logoColor=%2361DAFB)
- ![Docker](https://img.shields.io/badge/-Docker-black?style=flat&logo=docker)
-  ![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=flat&logo=kubernetes&logoColor=white)
- ![NGINX](http://img.shields.io/badge/-NGINX-269539?style=flat&logo=nginx&logoColor=white)
- ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat&logo=mongodb&logoColor=white)
- ![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=flate&logo=redis&logoColor=white)
- ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=flat&logo=jest&logoColor=white)
- ![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=JSON%20web%20tokens)
- ![Npm](https://img.shields.io/badge/-npm-CB3837?style=flat&logo=npm)
- ![NATS Streaming Server](https://img.shields.io/badge/NATS%20Streaming%20Server-222222?style=flat&logo=nats&logoColor=76D0C1)
- ![PayPal API](https://img.shields.io/badge/PayPal%20API-00457C?style=flat&logo=paypal&logoColor=white)
- ![Event-Driven Programming](https://img.shields.io/badge/Event--Driven%20Programming-FF69B4?style=flat&logo=eventbrite&logoColor=white)
- ![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat&logo=github-actions&logoColor=white)
- ![REST APIs](https://img.shields.io/badge/REST%20APIs-61DAFB?style=flat&logo=rest&logoColor=white)
- ![OAuth](https://img.shields.io/badge/OAuth-2.0-4A90E2?style=flat&logo=oauth&logoColor=white)
- ![Cloudinary](https://img.shields.io/badge/Cloudinary-4285F4?style=flat&logoColor=white)
- ![Google reCAPTCHA](https://img.shields.io/badge/Google%20reCAPTCHA-4285F4?style=flat&logoColor=white)


### Frontend
 - ![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)
 - ![Next JS](https://img.shields.io/badge/Next-black?style=flat&logo=next.js&logoColor=white)
- ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=flat&logo=redux&logoColor=white)
- ![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=flat&logo=mui&logoColor=white)
- ![HTML](https://img.shields.io/badge/-HTML-%23E44D27?style=flat&logo=html&logoColor=white)
- ![CSS](https://img.shields.io/badge/-CSS-%231572B6?style=flat&logo=css3)
- ![JavaScript](https://img.shields.io/badge/-JavaScript-%23F7DF1C?style=flat&logo=javascript&logoColor=000000&labelColor=%23F7DF1C&color=%23FFCE5A)

<hr>

## Development

To manage all the Docker containers inside the Kubernetes cluster and simplify development workflow the project uses Skaffold.

To run the app in development environment, make sure Docker, Kubernetes and Skaffold are installed on your local machine.

Before running the app environment variables inside the Kubernetes cluster must be set. Execute commands below to set these environment variables:

```bash
# kubectl create secret generic paypal-secret --from-literal=PAYPAL_CLIENT_ID=<your_paypal_key>

# kubectl create secret generic paypal-secret2 --from-literal=PAYPAL_CLIENT_SECRET=<your_paypal_secret_key>

# kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<your_jwt_key>

```

Be sure to expose the ingress-nginx-controller with:

```bash
# kubectl expose deployment ingress-nginx-contoller --target-port=80 --type=NodePort -n kube-system
```

Start the app with `skaffold dev`.

### Set up mock host name (local dev)

  - To redirect requests coming to: ticketing.dev => localhost      
  - only for local development purposes

  - MacOS/Linux:  
  modify `/etc/hosts` file to include `127.0.0.1 ticketing.dev`

  - Windows:  
  modify `C:\Windows\System32\Drivers\etc\hosts` file to include `127.0.0.1 ticketing.dev`

  - To skip the unskippable HTTPS warning in Chrome:    
  try type **thisisunsafe**

<hr>

# Microservices
![image](https://github.com/MhmoudYahia/ticketHub/assets/94763036/0d41fc3c-97b4-426c-bbb5-c5dceda5d85b)

### 1️⃣⚙️ Common NPM Module

All the commonly used classes, interfaces and middlewares, etc. are extracted into a published NPM Module.    

- `@m-ticketing/common`: [See the code](https://www.npmjs.com/package/@m-ticketing/common?activeTab=code)

  Contains commonly used Middlewares and Error Classes for ticketing microservices   

<hr>

### 2️⃣⚙️ Client Service

The Client Service is a front-end microservice developed using Next.js, a React framework for building web applications. This service focuses on providing a user-friendly and interactive interface for the application. It communicates with the back-end microservices to fetch and display data, handle user authentication, and facilitate seamless interactions. 
- Ensure that the `NEXT_PUBLIC_PAYPAL_CLIENT_ID` and `ReCAPTCHA_SITEKEY` environment variables are defined.

<hr>

### Kubernetes Infrastructure

The Kubernetes infrastructure for the application consists of various deployment files (YAML) that define the configuration for deploying microservices, databases, and other components. This setup enables the orchestration and management of containers in a Kubernetes cluster.

### Deployment Files

#### 1. `auth-depl.yaml`

- Deployment configuration for the authentication service.

#### 2. `auth-mongo-depl.yaml`

- Deployment configuration for the MongoDB database used by the authentication service.

#### 3. `client-depl.yaml`

- Deployment configuration for the Next.js-based client service.

#### 4. `expiration-depl.yaml`

- Deployment configuration for the expiration service.

#### 5. `expiration-redis-depl.yaml`

- Deployment configuration for the Redis instance used by the expiration service.

#### 6. `ingress-srv.yaml`

- Configuration for the Ingress service, enabling external access to the deployed microservices.

#### 7. `nats-depl.yaml`

- Deployment configuration for the NATS Streaming Server, used for event-driven communication between microservices.

#### 8. `orders-depl.yaml`

- Deployment configuration for the orders service.

#### 9. `orders-mongo-depl.yaml`

- Deployment configuration for the MongoDB database used by the orders service.

#### 10. `payments-depl.yaml`

- Deployment configuration for the payments service.

#### 11. `payments-mongo-depl.yaml`

- Deployment configuration for the MongoDB database used by the payments service.

#### 12. `tickets-depl.yaml`

- Deployment configuration for the tickets service.

#### 13. `tickets-mongo-depl.yaml`

- Deployment configuration for the MongoDB database used by the tickets service.

### Usage

1. Apply the Kubernetes deployment files using the `kubectl apply` command. For example:

   ```bash
   kubectl apply -f auth-depl.yaml

  
### 3️⃣⚙️ Auth Servive
The Auth Service is a microservice within the larger application responsible for handling user authentication-related functionalities. It employs TypeScript for strong typing, Node.js with Express.js for building the server and MongoDB for storing user data. The service utilizes JSON Web Tokens `(JWT)` for secure and stateless authentication, providing a scalable solution in a microservices architecture. It includes various routes for user sign-up, sign-in, sign-out, and other authentication-related operations. 

#### Project Structure

- **src**: The source code directory containing the main application logic.
  - **models**: Defines the TypeScript data model for user entities (`user.ts`).
  - **routes**: Houses the route handlers for different authentication operations.
    - **__test__**: Contains test files for route handlers.
      - `current-user.test.ts`: Tests for the current user route.
      - `signin.test.ts`: Tests for the sign-in route.
      - `signout.test.ts`: Tests for the sign-out route.
      - `signup.test.ts`: Tests for the sign-up route.
    - `change-password.ts`: Route handler for changing user passwords.
    - `current-user.ts`: Route handler for retrieving current user information.
    - `googleOauth.ts`: Route handler for Google OAuth authentication.
    - `signin.ts`: Route handler for user sign-in.
    - `signout.ts`: Route handler for user sign-out.
    - `signup.ts`: Route handler for user sign-up.
    - `update.ts`: Route handler for updating user information.
  - **services**: Contains service logic for password-related operations.
    - `passwords.ts`: Service for managing password-related functionality.
  - **test**: Houses common test setup configurations (`setup.ts`).
  - `app.ts`: Entry point for the Express.js application.
  - `index.ts`: Main file to start the server.

- **.dockerignore**: Specifies files and directories to be excluded from Docker builds.

- **Dockerfile**: Defines instructions for building a Docker image for the Auth Service.

- **package-lock.json**: Auto-generated file for package version tracking.

- **package.json**: Configuration file that includes project metadata, dependencies, and scripts.

### Routes

#### 1. Sign-up

- **Path**: `/api/users/signup`
- **Method**: `POST`
- **Description**: Allows users to create a new account. It handles `google-recaptcha`.

#### 2. Sign-in

- **Path**: `/api/users/signin`
- **Method**: `POST`
- **Description**: Allows users to sign in to their accounts.

#### 3. Sign-out

- **Path**: `/api/users/signout`
- **Method**: `POST`
- **Description**: Allows users to sign out of their accounts.

#### 4. Current User

- **Path**: `/api/users/currentUser`
- **Method**: `GET`
- **Description**: Retrieves information about the currently authenticated user.

#### 5. Change Password

- **Path**: `/api/users/changePassword`
- **Method**: `POST`
- **Description**: Allows users to change their account password.

#### 6. Google OAuth

- **Path**: `/api/users/requestOauth-google`
- **Method**: `POST`
- **Description**: Handles Google OAuth authentication.

#### 7. Update User

- **Path**: `/api/users/update`
- **Method**: `PATCH`
- **Description**: Updates user information including uploading a photo to the cloud.

The Auth Service provides a comprehensive set of routes to manage user authentication and authorization. These routes cover user registration, sign-in, sign-out, profile retrieval, password change, Google OAuth integration, and user information updates. The service is structured to be modular, making it easy to maintain and extend its functionality.

<hr>

### 4️⃣⚙️Orders Service

The Orders Service is a microservice designed to manage the lifecycle of orders within the larger application. It is implemented using TypeScript and Node.js with Express.js. The service incorporates event-driven programming with the help of NATS Streaming Server for handling events related to order creation, cancellation, and payment processing. Below is a detailed overview of the project structure, key files, and the exposed routes.

#### Project Structure

- **src**: The source code directory containing the main application logic.
  - **__mocks__**: Mock files for testing purposes.
    - `nats-wrapper.ts`: Mock implementation for NATS Streaming Server wrapper.
  - **events**: Contains event-related logic.
    - **listeners**: Event listeners for different events.
      - **__test__**: Test files for event listeners.
        - `expiration-completed-listener.ts`: Tests for the expiration completed event listener.
        - `payment-created-listener.ts`: Tests for the payment created event listener.
        - `ticket-created-listener.ts`: Tests for the ticket created event listener.
        - `ticket-updated-listener.ts`: Tests for the ticket updated event listener.
      - `queue-group-name.ts`: Defines the queue group name for event listeners.
      - `expiration-completed-listener.ts`: Event listener for the expiration completed event.
      - `payment-created-listener.ts`: Event listener for the payment created event.
      - `ticket-created-listener.ts`: Event listener for the ticket created event.
      - `ticket-updated-listener.ts`: Event listener for the ticket updated event.
    - **publishers**: Event publishers for different events.
      - `order-cancelled-publisher.ts`: Event publisher for the order cancelled event.
      - `order-created-publisher.ts`: Event publisher for the order created event.
  - **models**: Defines TypeScript data models for orders and tickets.
    - `order.ts`: Model for order entities.
    - `ticket.ts`: Model for ticket entities.
  - **routes**: Houses the route handlers for order-related operations.
    - **__test__**: Contains test files for route handlers.
      - `delete.test.ts`: Tests for the delete order route.
      - `index.test.ts`: Tests for the index route.
      - `new.test.ts`: Tests for the new order route.
      - `show.test.ts`: Tests for the show order route.
    - `delete.ts`: Route handler for deleting an order.
    - `index.ts`: Route handler for retrieving all orders.
    - `new.ts`: Route handler for creating a new order.
    - `show.ts`: Route handler for retrieving a specific order.
  - **test**: Houses common test setup configurations (`setup.ts`).
  - `app.ts`: Entry point for the Express.js application.
  - `index.ts`: Main file to start the server.
  - `nats-wrapper.ts`: Wrapper for connecting to NATS Streaming Server.

- **.dockerignore**: Specifies files and directories to be excluded from Docker builds.

- **Dockerfile**: Defines instructions for building a Docker image for the Orders Service.

- **package-lock.json**: Auto-generated file for package version tracking.

- **package.json**: Configuration file that includes project metadata, dependencies, and scripts.

- **tsconfig.json**: TypeScript configuration file.

### Routes

#### 1. New Order

- **Path**: `/api/orders`
- **Method**: `POST`
- **Description**: Creates a new order for purchasing a specified ticket.

#### 2. Show Order

- **Path**: `/api/orders/:orderId`
- **Method**: `GET`
- **Description**: Retrieves details about a specific order.

#### 3. Delete Order

- **Path**: `/api/orders/:orderId`
- **Method**: `DELETE`
- **Description**: Cancels a specific order.

#### 4. Index (All Orders)

- **Path**: `/api/orders`
- **Method**: `GET`
- **Description**: Retrieves all active orders for the given user making the request.

### Event Publishers

#### 1. Order Cancelled Publisher

- **File**: `order-cancelled-publisher.ts`
- **Description**: Publishes an event when an order is cancelled.

#### 2. Order Created Publisher

- **File**: `order-created-publisher.ts`
- **Description**: Publishes an event when a new order is created.

### Event Listeners

#### 1. Expiration Completed Listener

- **File**: `expiration-completed-listener.ts`
- **Description**: Listens for the expiration completed event.

#### 2. Payment Created Listener

- **File**: `payment-created-listener.ts`
- **Description**: Listens for the payment created event.

#### 3. Ticket Created Listener

- **File**: `ticket-created-listener.ts`
- **Description**: Listens for the ticket created event.

#### 4. Ticket Updated Listener

- **File**: `ticket-updated-listener.ts`
- **Description**: Listens for the ticket updated event.

The Orders Service provides routes to manage the lifecycle of orders, including creating new orders, retrieving order details, canceling orders, and fetching all active orders for a user. The service is structured to handle events related to order creation, cancellation, and payment processing in an event-driven architecture.

### 5️⃣⚙️ Tickets Service

The Tickets Service is a microservice responsible for managing ticket-related operations within the larger application. It utilizes TypeScript and Node.js with Express.js for server-side logic and NATS Streaming Server for event-driven communication. The service includes routes for creating, updating, and retrieving ticket information. Additionally, it implements event publishers and listeners to communicate with other microservices.

#### Project Structure

- **src**: The source code directory containing the main application logic.
  - **__mocks__**: Mock files for testing purposes.
    - `nats-wrapper.ts`: Mock implementation for NATS Streaming Server wrapper.
  - **events**: Contains event-related logic.
    - **listeners**: Event listeners for different events.
      - **__test__**: Test files for event listeners.
        - `order-cancelled-listener.test.ts`: Tests for the order cancelled event listener.
        - `order-created-listener.test.ts`: Tests for the order created event listener.
      - `order-cancelled-listener.ts`: Event listener for the order cancelled event.
      - `order-created-listener.ts`: Event listener for the order created event.
      - `queue-group-name.ts`: Defines the queue group name for event listeners.
    - **publishers**: Event publishers for different events.
      - `ticket-created-publisher.ts`: Event publisher for the ticket created event.
      - `ticket-updated-publisher.ts`: Event publisher for the ticket updated event.
  - **models**: Defines TypeScript data models for tickets.
    - **__test__**: Test files for the ticket model.
      - `ticket.test.ts`: Tests for the ticket model.
    - `ticket.ts`: Model for ticket entities.
  - **routes**: Houses the route handlers for ticket-related operations.
    - **__test__**: Contains test files for route handlers.
      - `index.test.ts`: Tests for the index route.
      - `new.test.ts`: Tests for the new ticket route.
      - `show.test.ts`: Tests for the show ticket route.
      - `update.test.ts`: Tests for the update ticket route.
    - `index.ts`: Route handler for retrieving all tickets.
    - `new.ts`: Route handler for creating a new ticket.
    - `show.ts`: Route handler for retrieving a specific ticket.
    - `update.ts`: Route handler for updating a ticket.
  - **test**: Houses common test setup configurations (`setup.ts`).
  - `app.ts`: Entry point for the Express.js application.
  - `index.ts`: Main file to start the server.
  - `nats-wrapper.ts`: Wrapper for connecting to NATS Streaming Server.

- **.dockerignore**: Specifies files and directories to be excluded from Docker builds.

- **Dockerfile**: Defines instructions for building a Docker image for the Tickets Service.

- **package-lock.json**: Auto-generated file for package version tracking.

- **package.json**: Configuration file that includes project metadata, dependencies, and scripts.

- **tsconfig.json**: TypeScript configuration file.

### Routes

#### 1. New Ticket

- **Path**: `/api/tickets/new`
- **Method**: `POST`
- **Description**: Creates a new ticket.
- **Request Body**: `{ "title": "Ticket Title", "price": "Ticket Price" }`

#### 2. Show Ticket

- **Path**: `/api/tickets/:id`
- **Method**: `GET`
- **Description**: Retrieves details about a specific ticket.

#### 3. Update Ticket

- **Path**: `/api/tickets/:id`
- **Method**: `PUT`
- **Description**: Updates information about a specific ticket.
- **Request Body**: `{ "title": "New Title", "price": "New Price" }`

#### 4. Index (All Tickets)

- **Path**: `/api/tickets`
- **Method**: `GET`
- **Description**: Retrieves all tickets.

### Event Publishers

#### 1. Ticket Created Publisher

- **File**: `ticket-created-publisher.ts`
- **Description**: Publishes an event when a new ticket is created.

#### 2. Ticket Updated Publisher

- **File**: `ticket-updated-publisher.ts`
- **Description**: Publishes an event when a ticket is updated.

### Event Listeners

#### 1. Order Cancelled Listener

- **File**: `order-cancelled-listener.ts`
- **Description**: Listens for the order cancelled event.

#### 2. Order Created Listener

- **File**: `order-created-listener.ts`
- **Description**: Listens for the order created event.

The Tickets Service provides routes to manage the creation, updating, and retrieval of tickets. It also implements event publishers and listeners to communicate with other microservices, ensuring a seamless flow of information within the application.

<hr>

### 6️⃣⚙️ Payments Service

The Payments Service is a microservice responsible for handling payment-related operations within the larger application. It utilizes TypeScript and Node.js with Express.js for server-side logic, and it integrates with PayPal for processing payments. The service includes routes for creating and capturing orders, and it implements event publishers and listeners for seamless communication with other microservices.

#### Project Structure

- **src**: The source code directory containing the main application logic.
  - **__mocks__**: Mock files for testing purposes.
    - `nats-wrapper.ts`: Mock implementation for NATS Streaming Server wrapper.
  - **events**: Contains event-related logic.
    - **listeners**: Event listeners for different events.
      - `order-cancelled-event.ts`: Listener for the order cancelled event.
      - `order-created-listener.ts`: Listener for the order created event.
      - `queue-group-name.ts`: Defines the queue group name for event listeners.
    - **publishers**: Event publishers for different events.
      - `payment-created-publisher.ts`: Publisher for the payment created event.
  - **models**: Defines TypeScript data models for orders and payments.
    - `order.ts`: Model for order entities.
    - `payment.ts`: Model for payment entities.
  - **routes**: Houses the route handlers for payment-related operations.
    - **__test__**: Contains test files for route handlers.
      - `new.test.ts`: Tests for the new payment route.
      - `paypal.test.ts`: Tests for the PayPal route.
    - `new.ts`: Route handler for creating a new payment.
    - `paypal.ts`: Route handler for interacting with PayPal.
  - **test**: Houses common test setup configurations (`setup.ts`).
  - **utils**: Contains utility functions for working with PayPal.
    - `paypal.ts`: Utility functions for PayPal integration.
  - `app.ts`: Entry point for the Express.js application.
  - `index.ts`: Main file to start the server.
  - `nats-wrapper.ts`: Wrapper for connecting to NATS Streaming Server.

- **.dockerignore**: Specifies files and directories to be excluded from Docker builds.

- **Dockerfile**: Defines instructions for building a Docker image for the Payments Service.

- **package-lock.json**: Auto-generated file for package version tracking.

- **package.json**: Configuration file that includes project metadata, dependencies, and scripts.

- **tsconfig.json**: TypeScript configuration file.

### 💰💲💵 PayPal Integration

The Payments Service integrates with PayPal to process payments securely. Below is a detailed explanation of the PayPal integration workflow, functions, and routes:

### Routes

#### 1. Create Order

- **Path**: `/api/payments/create-order`
- **Method**: `POST`
- **Description**: Creates a new order for payment.
- **Request Body**: `{ "price": "Amount" }`

    - **Workflow**:
        1. The client sends a POST request with the desired `price` to create a new payment order.
        2. The server validates the request, ensuring the `price` is not empty.
        3. The server generates an access token by calling `generateAccessToken` utility function.
        4. Using the access token, the server makes a request to the PayPal API (`/v2/checkout/orders`) to create a new order.
        5. The PayPal API responds with the order details.
        6. The server returns the order details to the client.

#### 2. Capture Order

- **Path**: `/api/payments/:paypalId/capture`
- **Method**: `POST`
- **Description**: Captures the payment for a specific order.
- **Params**: `paypalId` - The PayPal Order ID.

    - **Workflow**:
        1. The client sends a POST request with the `paypalId` to capture the payment for a specific order.
        2. The server makes a request to the PayPal API (`/v2/checkout/orders/:paypalId/capture`) to capture the payment.
        3. The PayPal API responds with the captured payment details.
        4. The server returns the captured payment details to the client.

#### 3. Create new payment

- **Path**: `/api/payments`
- **Method**: `POST`
- **Description**: Create new payment.

### Functions in `paypal.ts`

#### 1. `generateAccessToken`

- **Description**: Generates an access token for making requests to the PayPal API.

    - **Workflow**:
        1. The function constructs the basic authorization header using PayPal client credentials.
        2. The function makes a request to the PayPal API (`/v1/oauth2/token`) to obtain an access token.
        3. The function returns the access token.

#### 2. `createOrder`

- **Description**: Creates a new order with the specified price using the PayPal API.

    - **Workflow**:
        1. The function generates an access token by calling `generateAccessToken`.
        2. The function constructs the payload for creating a new order.
        3. The function makes a request to the PayPal API (`/v2/checkout/orders`) to create a new order.
        4. The function returns the order details.

#### 3. `captureOrder`

- **Description**: Captures the payment for a specific order using the PayPal API.

    - **Workflow**:
        1. The function generates an access token by calling `generateAccessToken`.
        2. The function makes a request to the PayPal API (`/v2/checkout/orders/:paypalId/capture`) to capture the payment.
        3. The function returns the captured payment details.
           
#### Event Listeners

#### 1. Order Cancelled Listener

- **File**: `order-cancelled-event.ts`
- **Description**: Listens for the order cancelled event.


#### 2. Order Created Listener

- **File**: `order-created-listener.ts`
- **Description**: Listens for the order created event.


#### Event Publishers

#### 1. Payment Created Publisher

- **File**: `payment-created-publisher.ts`
- **Description**: Publishes an event when a payment is created.

#### Important Notes

- The event listeners and publishers enable seamless communication between the Payments Service and other microservices, ensuring a coordinated flow of information.

- Ensure that NATS Streaming Server is properly configured and accessible for effective event handling.

The Payments Service facilitates payment processing by integrating with PayPal. It includes routes for creating and capturing orders, event listeners for handling order-related events, and event publishers for notifying other microservices about payment creation.

<hr>

### 7️⃣⚙️ Expiration Service

The Expiration Service is a microservice dedicated to handling the expiration of orders within the larger application. It utilizes TypeScript and Node.js with Bull for queue management and integrates with NATS Streaming Server for event-driven communication. The service includes event listeners, publishers, and a dedicated expiration queue to process background tasks efficiently.

### Project Structure

- **src**: The source code directory containing the main application logic.
  - **__mocks__**: Mock files for testing purposes.
    - `nats-wrapper.ts`: Mock implementation for NATS Streaming Server wrapper.
  - **events**: Contains event-related logic.
    - **listeners**: Event listeners for different events.
      - `order-created-listener.ts`: Listener for the order created event.
      - `queue-group-name.ts`: Defines the queue group name for event listeners.
    - **publishers**: Event publishers for different events.
      - `expiration-completed-publisher.ts`: Publisher for the expiration completed event.
  - **queues**: Manages background job processing.
    - `expiration-queue.ts`: Handles tasks related to order expiration using Bull.
  - `index.ts`: Main file to start the Expiration Service.
  - `nats-wrapper.ts`: Wrapper for connecting to NATS Streaming Server.

- **.dockerignore**: Specifies files and directories to be excluded from Docker builds.

- **Dockerfile**: Defines instructions for building a Docker image for the Expiration Service.

- **package-lock.json**: Auto-generated file for package version tracking.

- **package.json**: Configuration file that includes project metadata, dependencies, and scripts.

- **tsconfig.json**: TypeScript configuration file.

#### Event Listeners

#### 1. Order Created Listener

- **File**: `order-created-listener.ts`
- **Description**: Listens for the order created event.

#### 2. Queue Group Name

- **File**: `queue-group-name.ts`
- **Description**: Defines the queue group name for event listeners.
- 
#### Event Publishers

#### 1. Expiration Completed Publisher

- **File**: `expiration-completed-publisher.ts`
- **Description**: Publishes an event when the order expiration process is completed.

#### Queues

#### 1. Expiration Queue

- **File**: `expiration-queue.ts`
- **Description**: Manages background job processing related to order expiration using Bull.

    - **Initialization**:
        1. The queue is created using the `Queue` class from Bull.
        2. It is named `'order:expiration'` to identify and process expiration-related tasks.
        3. Configuration includes connecting to a `Redis` instance specified by `REDIS_HOST` environment variable.

    - **Task Processing**:
        1. The queue is set to process tasks asynchronously.
        2. Tasks are added to the queue when an order is created.
        3. The processing logic handles the completion of the order expiration process and triggers the `Expiration Completed Publisher` to notify other microservices.

### Important Notes

- The Expiration Service plays a crucial role in managing the expiration of orders within the application.

- Event listeners and publishers contribute to the event-driven architecture, ensuring seamless communication between microservices.

- The expiration queue efficiently handles background tasks asynchronously, improving overall system responsiveness.

- Redis is utilized as the storage backend for Bull queues, providing durability and reliability for managing tasks.

- Ensure that the `REDIS_HOST` environment variable is correctly configured to connect to the Redis instance.

The Expiration Service enhances the application's architecture by handling order expiration through event-driven processing and efficient background task management.

<hr>

## Author

- Mahmoud Yahia [![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/mahmoud-yahia-882144219/)
