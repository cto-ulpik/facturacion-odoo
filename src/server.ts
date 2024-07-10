import { Elysia, t } from 'elysia';

const server = new Elysia();

server.get('/', ({set}:any) => {
    set.status(200);
    return 'ok';
});

server.listen({ port: 8080 }, () => {
  console.log('Server running on http://localhost:8080');
});