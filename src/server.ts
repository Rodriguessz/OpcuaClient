import routes from './routes/index';
import { GlobalExceptionHandler } from './infrastructure/exceptions/GlobalExceptionHandler';

const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/v1', routes);


app.use(GlobalExceptionHandler.handleError);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}/api/v1`);
});
