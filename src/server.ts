import { Elysia, t } from 'elysia';

const server = new Elysia();

server.get('/', ({set, body}:any) => {
    console.log(body)
    set.status = 200;
    return;
});

server.listen({ port: 8080 }, () => {
  console.log('Server running on http://localhost:8080');
});