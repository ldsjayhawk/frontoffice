const swaggerAutogen  = require('swagger-autogen')();

const doc = {
    info: {
        title: 'FGM Api',
        description: 'FGM Api'
    },
    host: 'localhost:3000',
    schemas: ['https','http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc)