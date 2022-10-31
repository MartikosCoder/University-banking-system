import { Client } from 'pg';
type Data = {
    second_name: string,
    first_name: string,
    patronymic: string,
    birth_date: string,
    passport_series: string,
    passport_number: string,
    passport_issued_by: string,
    passport_issue_date: string,
    id_number: string,
    birth_place: string,
    live_city_id: Number,
    live_address: string, 
    home_phone?: string,
    mobile_phone?: string, 
    email?: string,
    work_place?: string,
    work_occupation?: string,
    registration_address: string,
    family_status_id: Number, 
    citizenship_id: Number, 
    disability_id: Number, 
    is_pensioner: Boolean,
    monthly_income?: Number
}

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'db',
    password: 'pass',
    port: 5432,
});
client.connect();

export default ({
    async getAll() {
        try {
            const result = {
                clients: (await client.query('SELECT * FROM sorted_clients')).rows,
                ...await this.getInfo()
            };

            return result;
        } catch (e) {
            console.log("|| Ошибка при получении данных ||\n", e);
            return {};
        }
    },
    async get(id: Number) {
        try {
            const result = (await client.query('SELECT * FROM sorted_clients WHERE id = $1', [id])).rows[0];

            return result;
        } catch (e) {
            console.log("|| Ошибка при получении данных ||\n", e);
            return undefined;
        }
    },
    async getInfo() {
        try {
            const result = {
                cities: (await client.query('SELECT * FROM cities')).rows,
                family_statuses: (await client.query('SELECT * FROM family_statuses')).rows,
                citizenships: (await client.query('SELECT * FROM citizenships')).rows,
                disabilities: (await client.query('SELECT * FROM disabilities')).rows,
            };

            return result;
        } catch (e) {
            console.log("|| Ошибка при получении данных ||\n", e);
            return {};
        }
    },
    validate(values: Data): Boolean {
        if (!values.second_name || !/^[\p{L} ,.'-]+$/u.test(values.second_name.trim())) return false;
        if (!values.first_name || !/^[\p{L} ,.'-]+$/u.test(values.first_name.trim())) return false;
        if (!values.patronymic || !/^[\p{L} ,.'-]+$/u.test(values.patronymic.trim())) return false;
        if (!values.birth_date || !/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(values.birth_date.trim())) return false;

        if (!values.passport_series || !/^[A-Z][A-Z]$/.test(values.passport_series.trim())) return false;
        if (!values.passport_number || !/^\d{7}$/.test(values.passport_number.trim())) return false;
        if (!values.passport_issued_by || values.passport_issued_by.trim().length === 0) return false;
        if (!values.passport_issue_date || !/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(values.passport_issue_date.trim())) return false;

        if (!values.id_number || !/^([A-Z]|\d){14}$/.test(values.id_number.trim())) return false;
        if (!values.birth_place || values.birth_place.trim().length === 0) return false;
        if (!values.live_city_id || values.live_city_id <= 0) return false;
        if (!values.live_address || values.live_address.trim().length === 0) return false;

        if (values.home_phone && !/^80\d{7}$/.test(values.home_phone.trim())) return false;
        if (values.mobile_phone && !/^375\d{9}$/.test(values.mobile_phone.trim())) return false;
        if (values.email && !/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(values.email.trim())) return false;
        if (values.work_place && values.work_place.trim().length === 0) return false;
        if (values.work_occupation && values.work_occupation.trim().length === 0) return false;

        if (!values.registration_address || values.registration_address.trim().length === 0) return false;
        if (!values.family_status_id || values.family_status_id <= 0) return false;
        if (!values.citizenship_id || values.citizenship_id <= 0) return false;
        if (!values.disability_id || values.disability_id <= 0) return false;

        if (values.monthly_income && values.monthly_income < 0) return false;

        return true;
    },
    async insert(values: Data): Promise<Boolean> {
        try {
            await client.query(`
                INSERT INTO clients(second_name, first_name, patronymic, birth_date, passport_series, passport_number, passport_issued_by, passport_issue_date, id_number, birth_place, live_city_id, live_address, home_phone, mobile_phone, email, work_place, work_occupation, registration_address, family_status_id, citizenship_id, disability_id, is_pensioner, monthly_income)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
            `, [
                values.second_name, values.first_name, values.patronymic,
                values.birth_date, values.passport_series, values.passport_number,
                values.passport_issued_by, values.passport_issue_date, values.id_number,
                values.birth_place, values.live_city_id, values.live_address, values.home_phone,
                values.mobile_phone, values.email, values.work_place, values.work_occupation,
                values.registration_address, values.family_status_id, values.citizenship_id,
                values.disability_id, +values.is_pensioner, `${values.monthly_income}`.replace('.', ',')
            ]);
            return true;
        } catch (e) {
            console.log("|| Ошибка при добавлении клиента ||\n", e);
            return false;
        }
    },
    async update(id: Number, values: Data): Promise<Boolean> {
        try {
            await client.query(`
                UPDATE clients SET second_name = $1, first_name = $2, patronymic = $3, birth_date = $4, passport_series = $5, passport_number = $6, passport_issued_by = $7, passport_issue_date = $8, id_number = $9, birth_place = $10, live_city_id = $11, live_address = $12, home_phone = $13, mobile_phone = $14, email = $15, work_place = $16, work_occupation = $17, registration_address = $18, family_status_id = $19, citizenship_id = $20, disability_id = $21, is_pensioner = $22, monthly_income = $23
                WHERE id = $24
            `, [
                values.second_name, values.first_name, values.patronymic,
                values.birth_date, values.passport_series, values.passport_number,
                values.passport_issued_by, values.passport_issue_date, values.id_number,
                values.birth_place, values.live_city_id, values.live_address, values.home_phone,
                values.mobile_phone, values.email, values.work_place, values.work_occupation,
                values.registration_address, values.family_status_id, values.citizenship_id,
                values.disability_id, +values.is_pensioner, `${values.monthly_income}`.replace('.', ','), id
            ]);
            return true;
        } catch (e) {
            console.log("|| Ошибка при обновлении клиента ||\n", e);
            return false;
        }
    },
    async delete(id: Number): Promise<Boolean> {
        try {
            await client.query('DELETE FROM clients WHERE id = $1', [id]);
            return true;
        } catch (e) {
            console.log("|| Ошибка при удалении клиента ||\n", e);
            return false;
        }
    }
});