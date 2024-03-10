# Grocery Booking API

## API Endpoints

### Admin Endpoints

1. **Add New Grocery Item**
   - Method: POST
   - Endpoint: `/add-product`
   - Description: Add a new product.

## Request Body

```json
{
  "name": "name",
  "categories": "1,2",
  "brand": "1",
  "hsn": "",
  "barcode": "",
  "tax": "",
  "description": "",
  "unit": "",
  "sku": "",
  "increment": 1,
  "cover_file": "",
  "files": [],
  "weight": 0,
  "min_quantity": 1,
  "max_quantity": 5,
  "discount": 10,
  "purchase_price": 10,
  "mrp": 10,
  "sale_price": 10,
  "stock": 10
}
```

2. **View All Products**
   - Method: GET
   - Endpoint: `get-all-product?search=&pageSize=10&page=1`
   - Description: View a list of existing products.

3. **Remove Product**
   - Method: DELETE
   - Endpoint: `delete-product?id=1&delete=hard||soft`
   - Description: Remove a product item from the system.

4. **Update Product Details**
   - Method: PUT
   - Endpoint: `/update-product`
   - Description: Update Products details.

5. **Manage Inventory**
   - Method: PUT
   - Endpoint: `/manage-inventory`
   - Description: Manage inventory.

### User Endpoints

1. **List Available Grocery Items**
   - Method: GET
   - Endpoint: `/list-products?search=test&category=1&brand=&lastId=10&sort=ASC`
   - Description: View a list of available grocery items for booking.

2. **Add Product to Cart**
   - Method: POST
   - Endpoint: `/add-to-cart`
   - Description: Add, Increment, Decrement a grocery item to the user's cart.

3. **Place Order**
   - Method: POST
   - Endpoint: `/place-order`
   - Description: Place an order for the items in the user's cart.

### Docker

docker build -t qp-assessment-grocery .
sudo docker build -t qp-assessment-grocery .

## Database

Mysql

## Getting Started

To set up and run project:

1. Clone the repository: `git clone https://github.com/pradeep463/qp-assessment.git`
2. Install dependencies: `npm install`
3. Set up your database and configure the connection in the application.
4. Run the application: `npm run dev`
