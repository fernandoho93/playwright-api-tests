// @ts-check
import { test, expect } from '@playwright/test';

test('deve criar uma reserva com dados validos', async ({ request }) => {
  // Preparar os dados da reserva.
  const reserva = {
    firstname: 'Fernando',
    lastname: 'Oliveira',
    totalprice: 250,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-10-10',
      checkout: '2026-10-15',
    },
    additionalneeds: 'Breakfast',
  };

  // Enviar a solicitacao de criacao.
  const response = await request.post('/booking', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    data: reserva,
  });

  // Validar a resposta da API.
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');

  const jsonBody = await response.json();
  expect(jsonBody.bookingid).toEqual(expect.any(Number));
  expect(jsonBody.bookingid).toBeGreaterThan(0);
  expect(jsonBody.booking).toEqual(reserva);
});

test('deve criar uma reserva para Sally Brown', async ({ request }, testInfo) => {
  const reserva = {
    firstname: 'Sally',
    lastname: 'Brown',
    totalprice: 111,
    depositpaid: true,
    bookingdates: {
      checkin: '2013-02-23',
      checkout: '2014-10-23',
    },
    additionalneeds: 'Breakfast',
  };

  const response = await request.post('/booking', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    data: reserva,
  });

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');

  const jsonBody = await response.json();
  expect(jsonBody.bookingid).toEqual(expect.any(Number));
  expect(jsonBody.bookingid).toBeGreaterThan(0);
  expect(jsonBody.booking).toEqual(reserva);

  console.log('ID da reserva criada:', jsonBody.bookingid);
  await testInfo.attach('reserva-criada', {
    body: JSON.stringify(jsonBody, null, 2),
    contentType: 'application/json',
  });
});
