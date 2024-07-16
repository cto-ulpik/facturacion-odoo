import { Elysia, t } from 'elysia';
import createBill from './modules/billing/main';

const server = new Elysia();

server.post('/', ({set, body}:any) => {
    createBill(body);
    set.status = 200;
    return '';
});

server.listen({ port: 8080 }, () => {
  console.log('Server running on http://localhost:8080');
});