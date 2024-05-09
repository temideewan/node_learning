# node_learning

This is a combination of projects that display my exploration into node js and understanding how to build node applications, culminating in a theoretical application for managing tourism and tourist attractions. Fully featured to include:

+ Authentication via Json webtokens stored in sessions
+ Database integration using MongoDB
+ Payment integration using paystack for booking tours
+ Frontend powered by pug templates

## Features in the "4-natours" Subfolder

The "4-natours" subfolder contains a Node.js application designed for managing tours and tourist activities. Here are some of the key features implemented in this subfolder:

- **Tour Management**: Allows users to create, update, and delete tours. Each tour includes details such as tour description, duration, max group size, and pricing.
- **User Authentication and Authorization**: Secure user authentication with JSON Web Tokens (JWT). This includes signup, login, and roles-based access control functionalities to differentiate between regular users and administrators.
- **Booking System**: Integration with Paystack for processing payments, enabling users to book tours directly through the application.
- **Review System**: Users can post reviews for tours they have participated in, which helps other users make informed decisions.
- **Database Integration**: Utilizes MongoDB for storing and managing data related to tours, bookings, users, and reviews.
- **API Features**: Comprehensive RESTful API allowing for interaction with the tour data programmatically.
- **Frontend Implementation**: Uses Pug templates to render dynamic content on the client side, providing a seamless user experience.

This subfolder represents a complete application scenario, demonstrating advanced features and integration of various technologies in a Node.js environment.
