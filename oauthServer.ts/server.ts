import express from 'express';
import request from 'request'
import bodyParser from 'body-parser';
import services from './database/services'
import users from './database/users';

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:false}));

app.set('view engine', 'ejs')

app.get("/oauth/v1/login", (req, res) => {
    let authClient = false;
    const { redirect_uri, client_id, grant_type } = req.query
    for (let service of services) {
        if (service.client_id === client_id) {
            authClient = true;
            break;
        }
    }
    if (authClient) {
        return res.render(`login`, { redirect_uri: redirect_uri })
    } else {
        return res.send({ status: 400, message: "없는클라이언트 ^^ "})
    }
})

// Client Login Page
app.get('/login', (req, res) => {
    const { id, password, redirect_uri } = req.query;

    for (let user of users) {
        if (user.id === id && String(user.password) === password) {
            return request.get(String(redirect_uri)+`?code=${user.code}`)
        }
    }
    return res.send({ status: 400, message: '잘못된 유저정보입니다. '})
})
// Authorize Page

app.post('/oauth/v1/authorize', async (req, res) => {
    const { data } = req.query;
    const { code, client_id, client_secret } = JSON.parse(String(data))

    for (let service of services) {
        if (service.client_id === client_id && service.client_secret === client_secret) {
            // Todo: code Invalidation
            return res.send({
                accessToken: '12345'
            })
        }
    };
})

app.listen(8001, () => console.log("listen on >> http://localhost:8001"))