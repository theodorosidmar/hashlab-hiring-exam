> Service responsible for reading and listing products (with discounts or not).

### RESTful Web API with one endpoint:
```
GET /product
```

After reading products from database, this service comunicates to `Discount service` to apply
discounts on each product based on user date of birth. User can be provided in `X-USER-ID` header. If not provided, this service does not request `Discount service`.

### Expected output
When no `X-USER-ID`:
```
{
  products: [
    {
      "price_in_cents": 500,
      "title": "Product 1",
      "description": "Description 1"
    },
    ...
  ]
}
```
When a user is found by header value `X-USER-ID`:
```
{
  products: [
    {
      "price_in_cents": 500,
      "title": "Product 1",
      "description": "Description 1"
      "discount": {
        "pct": 0.1, // Discount percentage
        "value_in_cents": 50 // Discount value in cents
      }
    },
    ...
  ]
}
```