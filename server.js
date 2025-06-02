// server.js
const express = require('express');
const twilio = require('twilio');
const multer = require('multer');
const app = express();

const upload = multer();
const client = twilio('YOUR_ACCOUNT_SID', 'YOUR_AUTH_TOKEN');

app.post('/api/send-mms', upload.single('image'), async (req, res) => {
    try {
        const { phone, message } = req.body;
        const imageBuffer = req.file.buffer;
        
        // Upload image to temporary storage (Cloudinary, AWS S3, etc.)
        const imageUrl = await uploadImage(imageBuffer);
        
        // Send MMS via Twilio
        await client.messages.create({
            body: message,
            from: 'YOUR_TWILIO_PHONE_NUMBER', // +1234567890
            to: `+1${phone}`,
            mediaUrl: imageUrl
        });
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
