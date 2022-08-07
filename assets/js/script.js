let monedasSection = document.querySelector("#section");
let chart;

async function getMonedas() {
    try {
        const res = await fetch("https://mindicador.cl/api");
        const monedas = await res.json();
        return monedas;

    } catch (error) {
        alert(error.message)
    }
}

async function renderMonedas() {
    const monedas = await getMonedas();
    let template = "";
    Object.entries(monedas).forEach(([key, moneda]) => {
        if (typeof moneda === 'object') {
            template += `
            <select id="selector1">          
            <option value="${moneda["valor"]}">${moneda["codigo"]}</option>
            </select>
        `
        }
    });
    monedasSection.innerHTML = template;
}
renderMonedas()

const btnBuscar = document.querySelector("#buscar")
const clpInput = document.querySelector("#clp")
const resultado = document.querySelector("#resultado")

btnBuscar.addEventListener("click", () => {
    clpAgregado = clpInput.value;
    monedaValor = monedasSection.value
    resultadoTotal = clpAgregado / monedaValor
    resultado.innerHTML = "Resultado: " + resultadoTotal.toFixed(2)
    monedaCodigo = monedasSection.options[monedasSection.selectedIndex].text
    if (chart){
        chart.destroy()
    }
    renderGrafica(monedaCodigo)
    // clpInput.value = ""
    // renderMonedas()    
})

async function getAndCreateDataToChart(monedaCodigo) {
    console.log(monedaCodigo)
    const res = await fetch(`https://mindicador.cl/api/${monedaCodigo}`);
    const indicador = await res.json();
    const labels = indicador.serie.slice(0,10).map((s) => {
        return s.fecha.split("T")[0];
        
    });
    const data = indicador.serie.map((s) => {
        const valor = s.valor;
        return Number(valor);
    });
    const datasets = [
        {
            label: "Variación indicador económico",
            borderColor: "rgb(255, 99, 132)",
            data
        }
    ];
    return { labels, datasets };
}
async function renderGrafica(monedaCodigo) {
    const data = await getAndCreateDataToChart(monedaCodigo);
    const config = {
        type: "line",
        data
    };
    const myChart = document.querySelector("#myChart");
    myChart.style.backgroundColor = "white";
    chart = new Chart(myChart, config);
    
}