async function getGrafico() {
    try {
        const res = await fetch("https://mindicador.cl/api");
        const monedas = await res.json();
        return monedas;

    } catch (error) {
        alert(error.message)
    }
}