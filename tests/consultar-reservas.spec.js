// @ts-check
import { test, expect } from '@playwright/test';

test('consultar todas as reservas cadastradas', async ({ request }, testInfo) => {
  const response = await request.get('/booking');

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');

  const reservas = await response.json();

  expect(Array.isArray(reservas), 'A resposta deve ser uma lista de reservas').toBe(true);

  console.log(`Total de reservas cadastradas: ${reservas.length}`);
  await testInfo.attach('reservas-cadastradas', {
    body: JSON.stringify(reservas, null, 2),
    contentType: 'application/json',
  });

  const ids = reservas.map((reserva) => reserva?.bookingid);
  expect(
    ids.every((id) => Number.isInteger(id) && id > 0),
    'Todas as reservas devem ter um bookingid inteiro positivo',
  ).toBe(true);
  expect(new Set(ids).size, 'Os IDs das reservas devem ser unicos').toBe(ids.length);
});

test('consultar uma reserva cadastrada pelo id', async ({ request }) => {
  const reserva = {
    firstname: 'Fernando',
    lastname: 'Oliveira',
    totalprice: 250,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-08-10',
      checkout: '2026-08-15',
    },
    additionalneeds: 'Breakfast',
  };

  const createResponse = await request.post('/booking', {
    data: reserva,
  });

  expect(createResponse.status()).toBe(200);
  expect(createResponse.headers()['content-type']).toContain('application/json');

  const { bookingid } = await createResponse.json();

  const getResponse = await request.get(`/booking/${bookingid}`);

  expect(getResponse.status()).toBe(200);
  expect(getResponse.headers()['content-type']).toContain('application/json');
  expect(await getResponse.json()).toEqual(reserva);
});

test('consultar uma reserva cadastrada pelo id validando apenas os campos', async ({ request }, testInfo) => {
  const response = await request.get('/booking/695');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');

  const jsonBody = await response.json();
  console.log('Reserva consultada: 695');
  await testInfo.attach('reserva-consultada', {
    body: JSON.stringify(jsonBody, null, 2),
    contentType: 'application/json',
  });

  //verificando dados da reserva
  expect(jsonBody).toHaveProperty('firstname');
  expect(jsonBody).toHaveProperty('lastname');
  expect(jsonBody).toHaveProperty('totalprice');
  expect(jsonBody).toHaveProperty('depositpaid');
  expect(jsonBody).toHaveProperty('bookingdates');
  expect(jsonBody.bookingdates).toHaveProperty('checkin');
  expect(jsonBody.bookingdates).toHaveProperty('checkout');
  expect(jsonBody).toHaveProperty('additionalneeds');

});
