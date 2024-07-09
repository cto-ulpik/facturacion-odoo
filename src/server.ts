import { Elysia, t } from 'elysia';

const server = new Elysia();

server.get('/', () => {
    return 'Hello World';
});

server.listen({ port: 3000 }, () => {
  console.log('Server running on http://localhost:3000');
});