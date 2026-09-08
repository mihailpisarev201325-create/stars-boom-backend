const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());
app.use(cors());

const BOT_TOKEN = '8626439086:AAGNq24sMMmFFsz93s3c0s8f90OpWhyqWOw'; // Вставь токен своего бота

app.post('/create-invoice', async (req, res) => {
    const { stars } = req.body;

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: 'Пополнение баланса',
                description: `Пополнение баланса на ${stars} ⭐ в Stars Boom`,
                payload: `deposit_${stars}_${Date.now()}`,
                currency: 'XTR',
                prices: [{ label: 'Звёзды', amount: stars }]
            })
        });

        const data = await response.json();
        
        if (data.ok) {
            res.json({ invoice_link: data.result });
        } else {
            res.status(400).json({ error: data.description });
        }
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
