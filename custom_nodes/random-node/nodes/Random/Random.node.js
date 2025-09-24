const axios = require("axios");

class Random {
    constructor() {
        this.description = {
            displayName: 'Random',
            name: 'random',
            icon: 'file:random.svg',
            group: ['transform'],
            version: 1,
            description: 'Gera um número inteiro aleatório usando a API do Random.org.',
            defaults: { name: 'Random' },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        { name: 'True Random Number Generator', value: 'generateRandomNumber' },
                    ],
                    default: 'generateRandomNumber',
                },
                {
                    displayName: 'Min',
                    name: 'min',
                    type: 'number',
                    typeOptions: { minValue: 1 },
                    default: 1,
                    description: 'Valor mínimo do intervalo',
                },
                {
                    displayName: 'Max',
                    name: 'max',
                    type: 'number',
                    typeOptions: { minValue: 1 },
                    default: 100,
                    description: 'Valor máximo do intervalo',
                },
            ],
        };
    }

    async execute() {
        const items = this.getInputData();
        const returnData = [];

        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            const operation = this.getNodeParameter('operation', itemIndex);

            if (operation === 'generateRandomNumber') {
                const min = this.getNodeParameter('min', itemIndex);
                const max = this.getNodeParameter('max', itemIndex);

                try {
                    const url = `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;
                    const response = await axios.get(url, { responseType: 'text' });

                    const responseText = Buffer.isBuffer(response.data) ? response.data.toString('utf8') : String(response.data);
                    const randomNumber = parseInt(responseText.trim(), 10);

                    returnData.push({ json: { randomNumber } });
                } catch (error) {
                    returnData.push({ json: { error: `Falha ao gerar número: ${error.message}` } });
                }
            }
        }

        return this.prepareOutputData(returnData);
    }
}

module.exports = { Random };
