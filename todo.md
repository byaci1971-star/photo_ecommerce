# Photo E-Commerce Platform - TODO

## Core Features
- [x] Product catalog with categories (photo books, calendars, photos, wall decorations, greeting cards, gifts)
- [x] Product detail page with images and descriptions
- [x] Shopping cart functionality
- [ ] Checkout process
- [ ] Order management system
- [ ] Payment integration (Stripe)
- [ ] User account and order history
- [ ] Product search and filtering
- [x] Responsive design for mobile and desktop

## Design & Layout
- [x] Homepage with hero section and featured products
- [x] Navigation menu with product categories
- [x] Product listing page with grid layout
- [x] Shopping cart page
- [ ] Checkout page
- [ ] User account dashboard
- [ ] Order confirmation page

## Database Schema
- [x] Products table
- [x] Categories table
- [x] Cart items table
- [x] Orders table
- [x] Order items table

## Backend APIs (tRPC procedures)
- [x] Get all products
- [x] Get product by ID
- [x] Get products by category
- [ ] Search products
- [x] Add to cart
- [x] Remove from cart
- [x] Get cart items
- [ ] Create order
- [ ] Get user orders
- [ ] Get order details

## Frontend Pages
- [x] Home page
- [x] Product listing page
- [x] Product detail page
- [x] Shopping cart page
- [ ] Checkout page
- [ ] Order confirmation page
- [ ] User account page
- [ ] Order history page

## Testing
- [x] Unit tests for tRPC procedures
- [ ] Integration tests for checkout flow
- [ ] Component tests for UI elements

## Deployment
- [ ] Create checkpoint before publishing
- [ ] Publish to production


## Multilingual Support
- [x] Create i18n configuration with French, German, English, and Arabic
- [x] Implement language switcher component
- [x] Translate all UI text to 4 languages
- [x] Add RTL support for Arabic
- [x] Store user language preference in database

## Checkout & Payment
- [x] Create checkout page with form validation
- [x] Add shipping address form
- [x] Implement payment method selection
- [ ] Integrate Stripe payment processing
- [ ] Create order confirmation page
- [ ] Send confirmation email

## User Account & Orders
- [x] Create user account dashboard
- [x] Implement order history page
- [ ] Add order detail view
- [x] Create user profile page
- [ ] Add address management
- [ ] Implement order tracking
- [ ] Add wishlist functionality


## Navigation & Subcategories
- [x] Add subcategories table to database schema
- [x] Create subcategory seed data (photos, books, calendars, gifts with their sizes)
- [x] Update Category page to show subcategories
- [x] Create dropdown navigation menu with categories and subcategories
- [x] Add subcategory filtering to product listing
- [x] Update product database to link to subcategories


## Mobile Menu & Responsive Navigation
- [x] Create mobile hamburger menu component
- [x] Implement responsive sidebar navigation
- [x] Add mobile menu toggle functionality
- [x] Test responsive design on mobile devices

## Product Filtering
- [x] Add product attributes table (size, color, material)
- [x] Create filter UI component
- [x] Implement price range filter
- [x] Implement size/format filter
- [x] Implement color filter
- [x] Add filter state management
- [x] Update product listing to apply filters

## Stripe Payment Integration
- [x] Add Stripe API keys to environment
- [x] Create Stripe payment intent procedure
- [x] Implement Stripe Elements on checkout page
- [x] Add payment form validation
- [ ] Handle payment success/failure responses
- [ ] Update order status after successful payment
- [ ] Add payment confirmation email


## Product Search
- [x] Implement search procedure in tRPC
- [x] Create search component for header
- [x] Add search results page
- [x] Implement real-time search with debouncing
- [ ] Add search history (optional)


## Product Configurators & Customization
- [x] Create photo print configurator page with image upload
- [x] Create photo book configurator page
- [ ] Create calendar configurator page
- [ ] Create gift item configurator page
- [ ] Implement image upload to S3 storage
- [x] Add customization options (size, format, finish, pages, cover type)
- [ ] Update shopping cart to support custom products
- [ ] Implement product preview functionality
- [ ] Create custom product database procedures
