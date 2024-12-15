process.env.NODE_ENV = "test";

const request = require('supertest');
const app = require('./app');
let list = require('./fakeDb');

let milk = { name: 'milk', price: 3.50 };

beforeEach(() => {
    list.push(milk);
});

afterEach(() => {
    list.length = 0;
});

describe('GET /', () => {
    test('Get full list of items', async () => {
        let res = await request(app).get('/items');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ items: [milk] })
    })
})

describe('GET /:name', () => {
    test('Get single item', async () => {
        let res = await request(app).get('/items/milk');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ item: milk })
    })
    test('404 if item not found', async () => {
        let res = await request(app).get('/items/eggs');
        expect(res.statusCode).toBe(404);
    })
})

describe('POST /', () => {
    test('adds new item', async () => {
        let newItem = { name: 'cereal', price: 5 }
        let res = await request(app).post('/items').send(newItem);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ added: newItem });
    })
    test('400 if name is missing', async () => {
        let res = await request(app).post('/items').send({ price: 5 });
        expect(res.statusCode).toBe(400);
    })
    test('400 if price missing', async () => {
        let res = await request(app).post('/items').send({ name: 'cereal' });
        expect(res.statusCode).toBe(400);
    })
})

describe('PATCH /:name', () => {
    test('edit existing item price', async () => {
        let res = await request(app).patch(`/items/${milk.name}`).send({ price: 4 })
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ updated: milk })
    })
    test('edit existing item name', async () => {
        let res = await request(app).patch(`/items/${milk.name}`).send({ name: 'wholeMilk' })
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ updated: milk })
    })
    test('404 if name is missing', async () => {
        let res = await request(app).patch('/items');
        expect(res.statusCode).toBe(404);
    })

    test('404 if item not found', async () => {
        let res = await request(app).patch('/items/eggs');
        expect(res.statusCode).toBe(404);
    })
})

describe('DELETE /:name', () => {
    test('Delete an item', async () => {
        let res = await request(app).delete(`/items/${milk.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'Deleted' });
    })
    test('404 if name is missing', async () => {
        let res = await request(app).delete('/items/');
        expect(res.statusCode).toBe(404);
    })
    test('404 if item not found', async () => {
        let res = await request(app).delete('/items/eggs');
        expect(res.statusCode).toBe(404);
    })
})