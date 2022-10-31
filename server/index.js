"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const database_1 = __importDefault(require("./database"));
app.use(express_1.default.json());
app.get('/api/clients', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!database_1.default) {
        res.sendStatus(502);
        return;
    }
    const rows = yield database_1.default.getAll();
    res.json(rows);
}));
app.get('/api/dictionaries', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!database_1.default) {
        res.sendStatus(502);
        return;
    }
    const rows = yield database_1.default.getInfo();
    res.json(rows);
}));
app.post('/api/client', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!database_1.default) {
        res.sendStatus(502);
        return;
    }
    if (!database_1.default.validate(req.body)) {
        res.sendStatus(500);
        return;
    }
    const is_inserted = yield database_1.default.insert(req.body);
    if (!is_inserted) {
        res.sendStatus(500);
        return;
    }
    res.sendStatus(200);
}));
app.route('/api/client/:id')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!database_1.default) {
        res.sendStatus(502);
        return;
    }
    const result = yield database_1.default.get(+req.params.id);
    if (!result) {
        res.sendStatus(500);
        return;
    }
    res.json(result);
}))
    .put((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!database_1.default) {
        res.sendStatus(502);
        return;
    }
    if (!database_1.default.validate(req.body)) {
        res.sendStatus(500);
        return;
    }
    const is_updated = yield database_1.default.update(+req.params.id, req.body);
    if (!is_updated) {
        res.sendStatus(500);
        return;
    }
    res.sendStatus(200);
}))
    .delete((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!database_1.default) {
        res.sendStatus(502);
        return;
    }
    const is_deleted = yield database_1.default.delete(+req.params.id);
    res.sendStatus(is_deleted ? 200 : 500);
}));
app.use('/assets', express_1.default.static('ui'));
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'ui' });
});
app.get('/client/new', (req, res) => {
    res.sendFile('form.html', { root: 'ui' });
});
app.get('/client/:id', (req, res) => {
    res.sendFile('form.html', { root: 'ui' });
});
app.listen(8000);
