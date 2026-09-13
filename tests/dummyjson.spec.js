// @ts-check
import { test, expect } from '@playwright/test';

const baseURL = 'https://dummyjson.com';

test.describe('DummyJSON API - GET /products/1', () => {
  test('deve retornar um produto com status 200 e contrato basico', async ({ request }, testInfo) => {
    const response = await request.get(`${baseURL}/products/1`, {
      headers: {
        Accept: 'application/json',
      },
    });

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('application/json');

    const product = await response.json();
    console.log('ID do produto consultado:', product.id);
    await testInfo.attach('produto-consultado', {
      body: JSON.stringify(product, null, 2),
      contentType: 'application/json',
    });

    expect(product).toEqual(
      expect.objectContaining({
        id: 1,
        title: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        category: expect.any(String),
      })
    );
  });
});
