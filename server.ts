import express from 'express';
import request from 'request';

import PORTS from './constant/PORTS'

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:false}));
require('dotenv').config();

app.set('view engine', 'ejs')

// default Home : Login
app.use('/login', (req, res) => {
    const client_id = process.env.client_id;
    const grant_type = "authorization_code";
    const redirect_uri = "http://localhost:8000/authorize"

    const uri = 'http://localhost:8001/oauth/v1/login?' +
    `client_id=${client_id}&`+
    `grant_type=${grant_type}&`+
    `redirect_uri=${redirect_uri}`

    return res.redirect(uri)
})

// Login Page

app.use('/authorize', (req, res) => {
    const { code } = req.query;
    const bodyInfo = JSON.stringify({
        code: (code),
        client_id: process.env.client_id,
        client_secret: process.env.client_secret
    });
    return request.post({
        url: `http://localhost:8001/oauth/v1/authorize?data=${bodyInfo}`,
    })
})


app.listen(PORTS.APP, () => {
    console.log(`listen on port ${PORTS.APP} : http://localhost:${PORTS.APP}`)
})