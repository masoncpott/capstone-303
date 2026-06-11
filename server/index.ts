import express from 'express';

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.get('/health', (_request, response) => {
  response.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
