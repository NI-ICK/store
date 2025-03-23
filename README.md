**See it live: [Visit Ecommerce store demo](https://ecommercestoreapp.vercel.app)** 

# Ecommerce store

## Overview
This project is an web application developed using **Next.js** and **TypeScript**, designed to allow users to browse and order products. It also features an admin dashboard that provides a comprehensive overview of users, orders and products. The application fetches product data through the **[DummyJSON API](https://dummyjson.com/)** to display products and their details. Additionally, it integrates with a **MySQL** database to store user and order data. For processing payments, the app integrates **Stripe**, providing a secure and seamless payment experience for users during checkout.

### Admin User
**E-mail:** admin@gmail.com

**Password:** admin

## Features
- **User Account:** Allows for seamless account creation and authentication. Additionally users can update their account information and request order refounds on their profile. 
- **Adaptive Design:** This website is fully responsive, providing an optimal user experience on both desktop and mobile devices.
- **Cart:** Users can add, view, and manage items in their shopping cart with ease, ensuring a smooth checkout process.
- **Wishlist:** Users can save products to their wishlist for future purchase, making it easy to keep track of favorite items.
- **Admin Dashboard:** Provides administrators with a comprehensive overview of users, orders and products.
- **Ordering:** A simple and secure process for users to place orders, with integrated Stripe payment handling for smooth and reliable transactions. It also includes a Stripe webhook endpoint to handle real-time payment events, ensuring accurate order status updates and seamless transaction processing.
- **Product List:** Displays a list of products with filtering options, allowing users to easily browse and find what they're looking for.

## Tech Stack
- Next.js
- TypeScript
- SASS
- Zustand 
- Stripe 

**Database:** MySQL

**Authentication:** JWT

**Testing:** Vitest