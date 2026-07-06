document.addEventListener('DOMContentLoaded', () => {
    const dateNow = new Date()
    const yesterday = new Date()

    const today = `${dateNow.getFullYear()}-${dateNow.getMonth()}-${dateNow.getDate()}`
    const yest = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate() - 1}`
    const ApiRange = `https://api.frankfurter.dev/v2/rates?from=${yest}&to=${today}&base=USD&quotes=MXN,EUR,GBP,JPY,CAD`;
    async function GetLatest(Api) {

        let response = await fetch(ApiRange)
        let data = response.json()

        return data

    }


    let current = GetLatest(ApiRange)




    let dat = current.then(d => {
        const resultado = Object.values(
            d.reduce((acc, current) => {
                // 1. Creamos una llave única combinando base y quote
                const clave = `${current.base}_${current.quote}`;

                // 2. Si es la primera vez que vemos esta combinación, inicializamos el objeto
                if (!acc[clave]) {
                    acc[clave] = {
                        base: current.base,
                        quote: current.quote,
                        history: [] // Aquí guardaremos las fechas y tasas
                    };
                }

                // 3. Agregamos los datos de la fecha actual al historial de esa moneda
                acc[clave].history.push({
                    date: current.date,
                    rate: current.rate
                });

                return acc;
            }, {})
        )
        return resultado
    })
    const content = document.getElementById('live-markets')
    content.innerHTML = ''
    dat.then(d => {
        d.forEach(element => {
            const item = document.createElement('li')
            let variacion = element.history[1].rate - element.history[0].rate
            let clase = "green"
            let arrow = "▲"
            if (element.history[0].rate > element.history[1].rate) {
                clase = 'red';
                arrow = '▼';

            }
            item.classList.add('live--rates')
            item.classList.add('nav-item')
            const label = document.createElement('span')
            const actual = document.createElement('span')
            const arrow_icon = document.createElement('span')
            const change = document.createElement('span')
            label.classList.add("currencies--label")
            actual.classList.add("currencies--actual--rate")
            arrow_icon.classList.add("arrow")
            arrow_icon.classList.add(clase)
            change.classList.add("cuerriencies--change")
            change.classList.add(clase)

            label.innerHTML = `${element.base}/${element.quote}`
            actual.innerHTML = element.history[1].rate
            arrow_icon.innerHTML = arrow
            change.innerHTML = `${((variacion / element.history[1].rate) * 100).toFixed(2)}%`
            // console.log(actual)
            item.appendChild(label)
            item.appendChild(actual)
            item.append(arrow_icon)
            item.appendChild(change)
            content.appendChild(item)
        });
    }).catch(e => console.log(e))



})
