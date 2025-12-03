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
let adminToken = null;
let sellerToken = null;

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

    // user Admin 
    const adminResult = await api.post("/api/users/signup").send({
        name: "Admin User",
        email: "admin@example.com",
        password: "AdminPass123!",
        role: "Admin",
        address: "Admin Street"
    });
    adminToken = adminResult.body.token;

    // user Seller 
    const sellerResult = await api.post("/api/users/signup").send({
        name: "Seller User",
        email: "seller@example.com",
        password: "SellerPass123!",
        role: "Seller",
        address: "Seller Street"
    });
    sellerToken = sellerResult.body.token;
});

describe("Public Product Routes", () => {
    beforeEach(async () => {
        await Product.deleteMany({});
        await Promise.all([
            api.post("/api/products").set("Authorization", "Bearer " + adminToken).send(products[0]),
            api.post("/api/products").set("Authorization", "Bearer " + adminToken).send(products[1]),
        ]);
    });

    // ---------------- UNAUTHENTICATED ----------------
    it("should return all products GET /api/products without token", async () => {
        await api
            .get("/api/products")
            .expect(200);
    });

    it("should return one product by ID", async () => {
        const product = await Product.findOne();
        const response = await api
            .get(`/api/products/${product.id}`)
            .expect(200)
            .expect("Content-Type", /application\/json/);

        expect(response.body.title).toBe(product.title);
    });
});

describe("Protected Product Routes - ADMIN ROLE", () => {
    beforeEach(async () => {
        await Product.deleteMany({});
        await Promise.all([
            api.post("/api/products").set("Authorization", "Bearer " + adminToken).send(products[0]),
            api.post("/api/products").set("Authorization", "Bearer " + adminToken).send(products[1]),
        ]);
    });

    // ---------------- POST ----------------
    it("should create one product when POST /api/products is called by ADMIN", async () => {
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
            .set("Authorization", "Bearer " + adminToken)
            .send(newProduct)
            .expect(201);

        expect(response.body.title).toBe(newProduct.title);
    });

    // ---------------- PUT ----------------
    it("should update one product by ID", async () => {
        const product = await Product.findOne();
        const updatedProduct = { title: "Updated product information." };

        const response = await api
            .put(`/api/products/${product.id}`)
            .set("Authorization", "Bearer " + adminToken)
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
            .set("Authorization", "Bearer " + adminToken)
            .expect(204);

        const productCheck = await Product.findById(product.id);
        expect(productCheck).toBeNull();
    });
});

describe("Protected Product Routes - SELLER ROLE", () => {
    beforeEach(async () => {
        await Product.deleteMany({});
        await Promise.all([
            api.post("/api/products").set("Authorization", "Bearer " + adminToken).send(products[0]),
            api.post("/api/products").set("Authorization", "Bearer " + adminToken).send(products[1]),
        ]);
    });

    // ---------------- POST ----------------
    it("should create one product when POST /api/products is called by SELLER", async () => {
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
            .set("Authorization", "Bearer " + sellerToken)
            .send(newProduct)
            .expect(201);

        expect(response.body.title).toBe(newProduct.title);
    });

    // ---------------- PUT ----------------
    it("should update one product by ID", async () => {
        const product = await Product.findOne();
        const updatedProduct = { title: "Updated product information." };

        const response = await api
            .put(`/api/products/${product.id}`)
            .set("Authorization", "Bearer " + sellerToken)
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
            .set("Authorization", "Bearer " + sellerToken)
            .expect(204);

        const productCheck = await Product.findById(product.id);
        expect(productCheck).toBeNull();
    });
});

describe("Protected Product Routes - BUYER ROLE", () => {
    beforeEach(async () => {
        await Product.deleteMany({});
        await Promise.all([
            api.post("/api/products").set("Authorization", "Bearer " + adminToken).send(products[0]),
            api.post("/api/products").set("Authorization", "Bearer " + adminToken).send(products[1]),
        ]);
    });

    // ---------------- POST ----------------
    it("should not create one product when POST /api/products is called by BUYER", async () => {
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
        await api
            .post("/api/products")
            .set("Authorization", "Bearer " + token)
            .send(newProduct)
            .expect(403);
    });

    // ---------------- PUT ----------------
    it("should not update one product by ID", async () => {
        const product = await Product.findOne();
        const updatedProduct = { title: "Updated product information." };

        await api
            .put(`/api/products/${product.id}`)
            .set("Authorization", "Bearer " + token)
            .send(updatedProduct)
            .expect(403);
    });

    // ---------------- DELETE ----------------
    it("should not delete one product by ID", async () => {
        const product = await Product.findOne();
        await api
            .delete(`/api/products/${product.id}`)
            .set("Authorization", "Bearer " + token)
            .expect(403);
    });
});

describe("Protected Product Routes - NOT LOGGIN OR INVALID TOKEN", () => {
    beforeEach(async () => {
        await Product.deleteMany({});
        await Promise.all([
            api.post("/api/products").set("Authorization", "Bearer " + adminToken).send(products[0]),
            api.post("/api/products").set("Authorization", "Bearer " + adminToken).send(products[1]),
        ]);
    });

    // ---------------- POST ----------------
    it("should not create one product when POST /api/products is called without Token", async () => {
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
        await api
            .post("/api/products")
            .send(newProduct)
            .expect(401);
    });

    it("should not create one product when POST /api/products is called with invalid token", async () => {
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
        await api
            .post("/api/products")
            .set("Authorization", "Bearer 414109715")
            .send(newProduct)
            .expect(401);
    });

    // ---------------- PUT ----------------
    it("should not update one product by ID without token", async () => {
        const product = await Product.findOne();
        const updatedProduct = { title: "Updated product information." };
        console.log(product);

        await api
            .put(`/api/products/${product.id}`)
            .send(updatedProduct)
            .expect(401);
    });

    it("should not update one product by ID with invalid token", async () => {
        const product = await Product.findOne();
        const updatedProduct = { title: "Updated product information." };

        await api
            .put(`/api/products/${product.id}`)
            .set("Authorization", "Bearer 414109715")
            .send(updatedProduct)
            .expect(401);
    });

    // ---------------- DELETE ----------------
    it("should not delete one product by ID without token", async () => {
        const product = await Product.findOne();
        await api
            .delete(`/api/products/${product.id}`)
            .expect(401);
    });

    it("should not delete one product by ID with invalid token", async () => {
        const product = await Product.findOne();
        await api
            .delete(`/api/products/${product.id}`)
            .set("Authorization", "Bearer 414109715")
            .expect(401);
    });
});

// Close DB connection once after all tests
afterAll(async () => {
    await mongoose.connection.close();
});