// @ts-check
import { test, expect } from '@playwright/test';

const bookingId = 1;
const bookingEndpoint = `/booking/${bookingId}`;
const requestHeaders = {
  Accept: 'application/json',
};

test.describe('Restful Booker API - GET /booking/1', () => {
  test('deve retornar status 200 e content-type JSON', async ({ request }, testInfo) => {
    const response = await request.get(bookingEndpoint, {
      headers: requestHeaders,
    });

    console.log('Status:', response.status());
    await testInfo.attach('headers-da-resposta', {
      body: JSON.stringify(response.headers(), null, 2),
      contentType: 'application/json',
    });

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('deve retornar uma reserva com o contrato esperado', async ({ request }, testInfo) => {
    const response = await request.get(bookingEndpoint, {
      headers: requestHeaders,
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const booking = await response.json();

    console.log('Status:', response.status());
    await testInfo.attach('reserva-consultada', {
      body: JSON.stringify(booking, null, 2),
      contentType: 'application/json',
    });

    expect(booking).toEqual(
      expect.objectContaining({
        firstname: expect.any(String),
        lastname: expect.any(String),
        totalprice: expect.any(Number),
        depositpaid: expect.any(Boolean),
        bookingdates: expect.objectContaining({
          checkin: expect.any(String),
          checkout: expect.any(String),
        }),
      })
    );
  });

  test('deve retornar dados validos para nome, preco e datas da reserva', async ({ request }, testInfo) => {
    const response = await request.get(bookingEndpoint, {
      headers: requestHeaders,
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const booking = await response.json();

    console.log('Status:', response.status());
    await testInfo.attach('reserva-consultada', {
      body: JSON.stringify(booking, null, 2),
      contentType: 'application/json',
    });

    expect(booking.firstname.trim().length).toBeGreaterThan(0);
    expect(booking.lastname.trim().length).toBeGreaterThan(0);
    expect(booking.totalprice).toBeGreaterThanOrEqual(0);
    expect(booking.bookingdates.checkin).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(booking.bookingdates.checkout).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

test.describe('Restful Booker API - GET /booking', () => {
  test('consultando reservas cadastradas', async ({ request }, testInfo) => {
    const response = await request.get('/booking', {
      headers: requestHeaders,
    });

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('application/json');

    const reservas = await response.json();
    expect(Array.isArray(reservas)).toBe(true);
    console.log('Total de reservas cadastradas:', reservas.length);
    await testInfo.attach('reservas-cadastradas', {
      body: JSON.stringify(reservas, null, 2),
      contentType: 'application/json',
    });
  });
});
