const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
    if (!req.headers['authorization']) {
        return res.json({ error: 'Token is missing' });
    }

    const token = req.headers['authorization'];

    let payload;
    try {
        payload = jwt.verify(token, '33 is coming home');
    } catch (error) {
        return res.json({ error: 'Token is incorrect' });
    }

    next();
}

module.exports = { checkToken }