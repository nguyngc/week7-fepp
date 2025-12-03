const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); // Express app (already connects to DB)
const api = supertest(app);
const Product = require("../models/productModel");
const User = require("../models/userModel");

// Seed data
const products = [
    {
        title: "Product 1",
        category: "Electronic",
        description: "Product 1 Description",
        price: 1223,
        stockQuantity: 1,
        supplier: {
            name: "Company 1",
            contactEmail: "email@outlook.com",
            contactPhone: "01234566",
            rating: 1
        }
    },
    {
        title: "Product 2",
        category: "Clothing",
        description: "Product 2 Description",
        price: 1223,
        stockQuantity: 10,
        supplier: {
            name: "Company 2",
            contactEmail: "email@outlook.com",
            contactPhone: "01234566",
            rating: 3
        }
    },
];

let token = null;

// Create a user and get a token before all tests
beforeAll(async () => {
    await User.deleteMany({});
    const result = await api.post("/api/users/signup").send({
        name: "John Doe",
        email: "john@example.com",
        password: "R3g5T7#gh",
        role: "Buyer",
        address: "12345hoa"
    });
    token = result.body.token;
});

describe("Protected Product Routes", () => {
    beforeEach(async () => {
        await Product.deleteMany({});
        await Promise.all([
            api.post("/api/products").set("Authorization", "Bearer " + token).send(products[0]),
            api.post("/api/products").set("Authorization", "Bearer " + token).send(products[1]),
        ]);
    });

    // ---------------- GET ----------------
    it("should return all products as JSON when GET /api/products is called", async () => {
        const response = await api
            .get("/api/products")
            .set("Authorization", "Bearer " + token)
            .expect(200)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toHaveLength(products.length);
    });


    // ---------------- POST ----------------
    it("should create one product when POST /api/products is called", async () => {
        const newProduct = {
            title: "Product 2",
            category: "Clothing",
            description: "Product 2 Description",
            price: 1223,
            stockQuantity: 10,
            supplier: {
                name: "Company 2",
                contactEmail: "email@outlook.com",
                contactPhone: "01234566",
                rating: 3
            }
        };
        const response = await api
            .post("/api/products")
            .set("Authorization", "Bearer " + token)
            .send(newProduct)
            .expect(201);

        expect(response.body.title).toBe(newProduct.title);
    });

    // ---------------- GET by ID ----------------
    it("should return one product by ID", async () => {
        const product = await Product.findOne();
        const response = await api
            .get(`/api/products/${product.id}`)
            .set("Authorization", "Bearer " + token)
            .expect(200)
            .expect("Content-Type", /application\/json/);

        expect(response.body.title).toBe(product.title);
    });

    // ---------------- PUT ----------------
    it("should update one product by ID", async () => {
        const product = await Product.findOne();
        const updatedProduct = { title: "Updated product information." };

        const response = await api
            .put(`/api/products/${product.id}`)
            .set("Authorization", "Bearer " + token)
            .send(updatedProduct)
            .expect(200)
            .expect("Content-Type", /application\/json/);

        expect(response.body.title).toBe(updatedProduct.title);

        const updatedProductCheck = await Product.findById(product.id);
        expect(updatedProductCheck.title).toBe(updatedProduct.title);
    });

    // ---------------- DELETE ----------------
    it("should delete one product by ID", async () => {
        const product = await Product.findOne();
        await api
            .delete(`/api/products/${product.id}`)
            .set("Authorization", "Bearer " + token)
            .expect(204);

        const productCheck = await Product.findById(product.id);
        expect(productCheck).toBeNull();
    });
});

// ---------------- UNAUTHENTICATED ----------------
it("should return all products GET /api/products without token", async () => {
    await api
        .get("/api/products")
        .expect(200); 
});

it("should fail POST /api/products without token", async () => {
    await api
        .post("/api/products")
        .send(products[0])
        .expect(401);
});


// ---------------- ROLE-BASED ----------------
it("should prevent Buyer from deleting a product", async () => {
    const product = await Product.findOne({});
    await api
        .delete(`/api/products/${product.id}`)
        .set("Authorization", "Bearer " + token) 
        .expect(403); 
});

// test role Admin:
it("should allow Admin to delete a product", async () => {
    // user Admin 
    const adminResult = await api.post("/api/users/signup").send({
        name: "Admin User",
        email: "admin@example.com",
        password: "AdminPass123!",
        role: "Admin",
        address: "Admin Street"
    });
    const adminToken = adminResult.body.token;

    const product = await Product.findOne({});
    await api
        .delete(`/api/products/${product.id}`)
        .set("Authorization", "Bearer " + adminToken)
        .expect(204);
});

// Close DB connection once after all tests
afterAll(async () => {
    await mongoose.connection.close();
});