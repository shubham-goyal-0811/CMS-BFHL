# 📦 CMS Backend

A **Node.js + NestJS** based backend server for managing a simple **CMS (Content Management System)** — handles users, products, carts, and orders.

---

## ⚙️ Tech Stack

- **Node.js** (Runtime)
- **NestJS** (Backend Framework)
- **MongoDB** (Database)
- **Mongoose** (ORM for MongoDB)
- **TypeScript** (Language)

Make sure you have **MongoDB** running locally or provide your **MongoDB URI** inside `.env`.

---

## 🗂️ Project Structure

```
src/
├── cart/
│   └── cart.module.ts, cart.service.ts, cart.schema.ts
├── order/
│   └── order.module.ts, order.service.ts, order.schema.ts
├── product/
│   └── product.module.ts, product.service.ts, product.schema.ts
├── user/
│   └── user.module.ts, user.service.ts, user.schema.ts
├── app.module.ts
└── main.ts
```

Each folder (cart, order, product, user) contains its:
- Module
- Service
- Controller (if needed)
- Mongoose Schema

---

## 🔥 Core Features

### 1. **Users**
- Register and store user data.
- After placing an order, the **user document** is updated with the placed **order ID**.

### 2. **Products**
- Products can be listed, created, updated, and deleted.
- Each product has properties like `title`, `description`, `price`, etc.

### 3. **Cart**
- Users can add multiple products to their cart.
- A cart is linked to a user and contains an array of product references.

### 4. **Orders**
- Orders are created from the cart contents.
- Order has:
  - **userId** reference (who placed the order)
  - **products** array
  - **status** (example: `PENDING`, `SHIPPED`, `DELIVERED`)
- Order Status can be updated.

---

## 📜 Important Modules Explained

### 🛒 Cart Module
- Cart schema references multiple **Product** IDs.
- **CartService** has methods to create and manage cart items.

### 🛍️ Order Module
- Order schema has a **status** enum (example: `PENDING`, `CANCELLED`, etc).
- **OrderService** creates an order from a user's cart.
- Order status can be updated (only to valid statuses).

---
## 📌 How Dependency Injection Works (NestJS Specific)

- All **Models** (User, Product, Cart, Order) are injected using `@InjectModel`.
- `MongooseModule.forFeature([...])` is used inside each module.
- When **cross-module model access** is needed (e.g., Order module needs User model),  
  ➔ **Import that module** (`UserModule`) inside your target module (`OrderModule`).

Example:

```typescript
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  exports: [
    MongooseModule
  ]
})
export class UserModule {}
```

And in `OrderModule`:

```typescript
@Module({
  imports: [
    UserModule
  ],
})
export class OrderModule {}
```

---

## 🛠️ Common Errors & Solutions

| Error | Cause | Solution |
|:---|:---|:---|
| `Property 'status' does not exist on type 'Query'` | `.findById()` needs `await` | Add `await this.model.findById(id)` |
| `UnknownDependenciesException` | Missing Module import | Import the module that exports the required Model |
| `Type 'string' is not assignable to type 'Status'` | Enum mismatch | Validate incoming status properly and cast if necessary |

---

## 📈 Key Flows

### ➡️ Place an Order

1. Cart is fetched for the user.
2. New Order document is created with products from cart.
3. Order status set to `PENDING`.
4. Order ID is **pushed** into the User's `orders` array.
5. Cart is cleared.

---

### ➡️ Update Order Status

- Validate incoming status is part of `Status` enum.
- Update Order's `status` field.
- Save changes to MongoDB.

---

## 🌐 API Routes (Sample)

| Method | Route | Description |
|:---|:---|:---|
| POST | `/cart/add` | Add a product to cart |
| POST | `/order/place` | Place an order from cart |
| PATCH | `/order/:id` | Update status of an order |
| GET | `/product/list` | List all products |

---

## 📢 Notes

- Always validate inputs (DTOs recommended).
- Status changes are limited to pre-defined enum values only.
- Proper MongoDB indexes (like userId, productId) can improve query speed.

---

# 🚀 Happy Coding!  
*Made with ❤️ by Shubham using NestJS.*
