(async () => {
    let data = {
        clients: [],
        cities: [],
        family_statuses: [],
        citizenships: [],
        disabilities: []
    };
    
    const table = document.querySelector('tbody');
    const generateHTMLRow = line => {
        const row = document.createElement('tr');

        const live_city = data.cities.find(city => city.id === line.live_city_id);
        const family_status = data.family_statuses.find(status => status.id === line.family_status_id);
        const citizenship = data.citizenships.find(citizenship => citizenship.id === line.citizenship_id);
        const disability = data.disabilities.find(disability => disability.id === line.disability_id);

        const remove_btn = document.createElement('button');
        remove_btn.classList.add('button');
        remove_btn.innerHTML = 'Удалить';
        remove_btn.addEventListener('click', async(e) => {
            e.preventDefault();

            const fetcher = await fetch(`/api/client/${line.id}`, {
                method: 'DELETE'
            });

            if(fetcher.status !== 200) {
                alert("Ошибка при удалении клиента");
                console.error(fetcher.statusText);
                return;
            }

            location.reload();
        });

        row.innerHTML = `<td>${line.second_name}</td>
            <td>${line.first_name}</td>
            <td>${line.patronymic}</td>
            <td>${new Date(Date.parse(line.birth_date)).toLocaleDateString("ru-RU")}</td>
            <td>${line.passport_series}</td>
            <td>${line.passport_number}</td>
            <td>${line.passport_issued_by}</td>
            <td>${new Date(Date.parse(line.passport_issue_date)).toLocaleDateString("ru-RU")}</td>
            <td>${line.id_number}</td>
            <td>${line.birth_place}</td>
            <td>${live_city.name}</td>
            <td>${line.live_address}</td>
            <td>${line.home_phone}</td>
            <td>${line.mobile_phone}</td>
            <td>${line.email}</td>
            <td>${line.work_place}</td>
            <td>${line.work_occupation}</td>
            <td>${line.registration_address}</td>
            <td>${family_status.name}</td>
            <td>${citizenship.name}</td>
            <td>${disability.name}</td>
            <td>${line.is_pensioner ? 'Да' : 'Нет'}</td>
            <td>${line.monthly_income}</td>
            <td><a href="/client/${line.id}" class="button">Редактировать</a></td>`;

        const remove_btn_fragment = document.createElement('td');
        remove_btn_fragment.appendChild(remove_btn);
        row.appendChild(remove_btn_fragment);

        return row;
    }

    try {
        const fetcher = await fetch('/api/clients');
        data = await fetcher.json();

        const fragment = document.createDocumentFragment();
        if(!data) return;

        for(const client of data.clients) {
            fragment.appendChild(generateHTMLRow(client));
        }

        table.appendChild(fragment);
    } catch (e) {
        alert("Ошибка при получении данных");
        console.log(e);
    }
})();