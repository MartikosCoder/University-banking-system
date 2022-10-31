import express from 'express';
const app = express();

import db from './database';

app.use(express.json());

app.get('/api/clients', async (req, res) => {
    if(!db) {
        res.sendStatus(502);
        return;
    }

    const rows = await db.getAll();
    res.json(rows);
});

app.get('/api/dictionaries', async (req, res) => {
    if(!db) {
        res.sendStatus(502);
        return;
    }

    const rows = await db.getInfo();
    res.json(rows);
});

app.post('/api/client', async (req, res) => {
    if(!db) {
        res.sendStatus(502);
        return;
    }

    if(!db.validate(req.body)) {
        res.sendStatus(500);
        return;
    }

    const is_inserted = await db.insert(req.body);
    if(!is_inserted) {
        res.sendStatus(500);
        return;
    }

    res.sendStatus(200);
});

app.route('/api/client/:id')
    .get(async (req, res) => {
        if(!db) {
            res.sendStatus(502);
            return;
        }

        const result = await db.get(+req.params.id);
        if(!result) {
            res.sendStatus(500);
            return;
        }

        res.json(result);
    })
    .put(async (req, res) => {
        if(!db) {
            res.sendStatus(502);
            return;
        }

        if(!db.validate(req.body)) {
            res.sendStatus(500);
            return;
        }

        const is_updated = await db.update(+req.params.id, req.body);
        if(!is_updated) {
            res.sendStatus(500);
            return;
        }
    
        res.sendStatus(200);
    })
    .delete(async (req, res) => {
        if(!db) {
            res.sendStatus(502);
            return;
        }
    
        const is_deleted = await db.delete(+req.params.id);
        res.sendStatus(is_deleted ? 200 : 500);
    });

app.use('/assets', express.static('ui'));

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: 'ui'});
});

app.get('/client/new', (req, res) => {
    res.sendFile('form.html', {root: 'ui'});
});

app.get('/client/:id', (req, res) => {
    res.sendFile('form.html', {root: 'ui'});
})

app.listen(8000);