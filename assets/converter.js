document.addEventListener('DOMContentLoaded', () => {

    const input_receive = document.getElementById('input_receive')
    const input_send = document.getElementById('input_send')
    const select_receive = document.getElementById('select_receive')
    const select_send = document.getElementById('select_send')

    input_send.addEventListener('input', () => {
        converter()
    })
    input_receive.addEventListener('input', () => {
        converter()
    })
    select_receive.addEventListener('change', () => {
        converter()
    })
    select_send.addEventListener('change', () => {
        converter()
    })
})

function converter() {
    const api = `https://api.frankfurter.dev/v2/rates?base=${select_send.value}&quotes=${select_receive.value}`
    fetch(api)
        .then(response => response.json())
        .then(data => {
            console.log(data[0].rate)
            input_receive.value = (input_send.value * data[0].rate).toFixed(2)
        }).catch(error => console.error('Error fetching exchange rate:', error))
}