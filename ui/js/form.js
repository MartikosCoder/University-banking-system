(async () => {
    const generateOption = data => {
        const option = document.createElement('option');
        option.value = data.id;
        option.innerHTML = data.name;

        return option;
    }
    const live_city_select = document.getElementById('live_city_id');
    const family_status_select = document.getElementById('family_status_id');
    const citizenship_select = document.getElementById('citizenship_id');
    const disability_select = document.getElementById('disability_id');

    try {
        const fetcher = await fetch('/api/dictionaries');
        data = await fetcher.json();

        for (const city of data.cities) {
            live_city_select.appendChild(generateOption(city));
        }

        for (const citizenship of data.citizenships) {
            citizenship_select.appendChild(generateOption(citizenship));
        }

        for (const disability of data.disabilities) {
            disability_select.appendChild(generateOption(disability));
        }

        for (const family_status of data.family_statuses) {
            family_status_select.appendChild(generateOption(family_status));
        }
    } catch (e) {
        alert("Ошибка при получении данных");
        console.log(e);
    }

    try {
        const id = +location.pathname.slice(1).split('/')[1];
        if (id) {
            try {
                const fetcher = await fetch(`/api/client/${id}`);
                data = await fetcher.json();

                document.getElementById('id').value = data.id;
                document.getElementById('second_name').value = data.second_name;
                document.getElementById('first_name').value = data.first_name;
                document.getElementById('patronymic').value = data.patronymic;

                document.getElementById('birth_date').value = new Date(Date.parse(data.birth_date)).toLocaleDateString().split('.').reverse().join('-');
                document.getElementById('passport_series').value = data.passport_series;
                document.getElementById('passport_number').value = data.passport_number;
                document.getElementById('passport_issued_by').value = data.passport_issued_by;

                document.getElementById('passport_issue_date').value = new Date(Date.parse(data.passport_issue_date)).toLocaleDateString().split('.').reverse().join('-');
                document.getElementById('id_number').value = data.id_number;
                document.getElementById('birth_place').value = data.birth_place;
                document.getElementById('live_city_id').value = data.live_city_id;

                document.getElementById('live_address').value = data.live_address;
                document.getElementById('home_phone').value = data.home_phone;
                document.getElementById('mobile_phone').value = data.mobile_phone;
                document.getElementById('email').value = data.email;

                document.getElementById('work_place').value = data.work_place;
                document.getElementById('work_occupation').value = data.work_occupation;
                document.getElementById('registration_address').value = data.registration_address;
                document.getElementById('family_status_id').value = data.family_status_id;

                document.getElementById('citizenship_id').value = data.citizenship_id;
                document.getElementById('disability_id').value = data.disability_id;
                document.getElementById('is_pensioner').checked = data.is_pensioner;
                document.getElementById('monthly_income').value = Number(data.monthly_income.replace(/[^0-9.-]+/g, "")) / 100;
            } catch (e) {
                alert("Ошибка при получении данных");
                console.log(e);

                location.href = '/';
            }
        }
    } catch (e) {
        console.log(e);
    }
})();

const validate = values => {
    if (!values.second_name || !/^[\p{L} ,.'-]+$/u.test(values.second_name.trim())) return [false, 'Неверная фамилия'];
    if (!values.first_name || !/^[\p{L} ,.'-]+$/u.test(values.first_name.trim())) return [false, 'Неверное имя'];
    if (!values.patronymic || !/^[\p{L} ,.'-]+$/u.test(values.patronymic.trim())) return [false, 'Неверное отчество'];
    if (!values.birth_date || !/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(values.birth_date.trim())) return [false, 'Неверно указана дата рождения'];

    if (!values.passport_series || !/^[A-Z][A-Z]$/.test(values.passport_series.trim())) return [false, 'Неверная серия паспорта'];
    if (!values.passport_number || !/^\d{7}$/.test(values.passport_number.trim())) return [false, 'Неверный номер паспорта'];
    if (!values.passport_issued_by || values.passport_issued_by.trim().length === 0) return [false, 'Неверно указано кем выдан паспорт'];
    if (!values.passport_issue_date || !/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(values.passport_issue_date.trim())) return [false, 'Неверное указана дата выдачи паспорта'];

    if (!values.id_number || !/^([A-Z]|\d){14}$/.test(values.id_number.trim())) return [false, 'Неверный идентификационный номер'];
    if (!values.birth_place || values.birth_place.trim().length === 0) return [false, 'Неверно указано место рождения'];
    if (!values.live_city_id || values.live_city_id <= 0) return [false, 'Неверный город проживания'];
    if (!values.live_address || values.live_address.trim().length === 0) return [false, 'Неверный адрес проживания'];

    if (values.home_phone && !/^80\d{7}$/.test(values.home_phone.trim())) return [false, 'Неверный домашний телефон'];
    if (values.mobile_phone && !/^375\d{9}$/.test(values.mobile_phone.trim())) return [false, 'Неверный мобильный телефон'];
    if (values.email && !/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(values.email.trim())) return [false, 'Неверная почта'];
    if (values.work_place && values.work_place.trim().length === 0) return [false, 'Неверное место работы'];
    if (values.work_occupation && values.work_occupation.trim().length === 0) return [false, 'Неверная должность'];

    if (!values.registration_address || values.registration_address.trim().length === 0) return [false, 'Неверный адрес регистрации'];
    if (!values.family_status_id || values.family_status_id <= 0) return [false, 'Неверное семейное положение'];
    if (!values.citizenship_id || values.citizenship_id <= 0) return [false, 'Неверное гражданство'];
    if (!values.disability_id || values.disability_id <= 0) return [false, 'Неверный статус инвалидности'];

    if (values.monthly_income && values.monthly_income < 0) return [false, 'Неверное значение ежемесячного дохода'];

    return [true, ''];
}

document.getElementById('send_btn').addEventListener('click', async (e) => {
    e.preventDefault();

    const data = new FormData(document.getElementById('form'));
    const values = {};

    data.forEach((val, key) => {
        values[key] = val;
    });

    values.citizenship_id = +values.citizenship_id;
    values.disability_id = +values.disability_id;
    values.family_status_id = +values.family_status_id;
    values.live_city_id = +values.live_city_id;
    values.is_pensioner = values.is_pensioner === 'on' ? 1 : 0;

    const [is_valid, error_message] = validate(values);
    if (!is_valid) {
        alert(error_message);
        return;
    }

    const url = values.id ? `/api/client/${values.id}` : '/api/client';
    const method = values.id ? 'PUT' : 'POST';

    const fetcher = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    });

    if (fetcher.status !== 200) {
        alert("Ошибка при работе с клиентом");
        console.error(fetcher.statusText);
        return;
    }

    location.href = '/';
});
