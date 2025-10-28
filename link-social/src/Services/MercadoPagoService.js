import 'dotenv/config';
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({

    accessToken: process.env.accessToken,
    options: {
        timeout: 500
    },
});

const paymentClient = new Payment(client);


export async function criarPagamentoPix(valor, descricao, email,) {
    console.log("Iniciando criação de pagamento PIX com os seguintes dados:", { valor, descricao, email, });

    console.log(process.env.accessToken);

    const body = {
        transaction_amount: parseFloat(valor),
        description: descricao,
        payment_method_id: 'pix',
        payer: {
            email: email,
        },
    };

    try {

        const result = await paymentClient.create({ body });

        console.log("Pagamento criado com sucesso! Resultado:", result);
        return result;

    } catch (error) {
        console.error("Erro ao criar pagamento:", error);

        throw error;
    }
}