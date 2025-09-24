import { INodeType, INodeTypeDescription, IExecuteFunctions } from 'n8n-workflow';
import axios from 'axios';

export class Random implements INodeType {
    description: INodeTypeDescription = {
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

    async execute(this: IExecuteFunctions) {
        const items = this.getInputData();
        const returnData = [];

        for (let i = 0; i < items.length; i++) {
            const operation = this.getNodeParameter('operation', i);

            if (operation === 'generateRandomNumber') {
                const min = this.getNodeParameter('min', i) as number;
                const max = this.getNodeParameter('max', i) as number;

                try {
                    const url = `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;
                    const response = await axios.get(url, { responseType: 'text' });

                    const responseText = Buffer.isBuffer(response.data)
                        ? response.data.toString('utf8')
                        : String(response.data);

                    const randomNumber = parseInt(responseText.trim(), 10);

                    returnData.push({ json: { randomNumber } });
                } catch (error: any) {
                    returnData.push({ json: { error: `Falha ao gerar número: ${error.message}` } });
                }
            }
        }

        
        return this.prepareOutputData(returnData);
    }
}
