import "./styles/main.scss";

import _ from "lodash";
import { Chart } from "chart.js/auto";

import ventas from "./data/ventas.json";
import productos from "./data/productos.yaml";
import inventario from "./data/inventario.csv";

import logo from "./assets/logo.png";

// Poner logo
const logoImg = document.getElementById("logo");
if (logoImg) {
  logoImg.src = logo;
}

// Elementos del DOM
const totalProductosEl = document.getElementById("total-productos");
const totalInventarioEl = document.getElementById("total-inventario");

const cardTotalProductos = document.getElementById("card-total-productos");
const cardTotalInventario = document.getElementById("card-total-inventario");

const productosCard = document.getElementById("productos-card");
const inventarioCard = document.getElementById("inventario-card");

const productosList = document.getElementById("productos-list");
const inventarioList = document.getElementById("inventario-list");

// Totales
if (totalProductosEl) {
  totalProductosEl.textContent = String(productos.length);
}

if (totalInventarioEl) {
  const total = _.sumBy(inventario, (fila) =>
    Number(fila.cantidad || fila.Cantidad || 0)
  );
  totalInventarioEl.textContent = String(total);
}

// Estado interno
let productosVisible = false;
let inventarioVisible = false;

// ------------------------
//   LISTA DE PRODUCTOS
// ------------------------
if (cardTotalProductos && productosCard && productosList) {
  const llenarListaProductos = () => {
    productosList.innerHTML = "";

    productos.forEach((p) => {
      const li = document.createElement("li");

      const nombre = document.createElement("strong");
      nombre.textContent = p.nombre;

      const meta = document.createElement("span");
      meta.className = "producto-meta";

      const categoriaSpan = document.createElement("span");
      categoriaSpan.className = "tag";
      categoriaSpan.textContent = p.categoria || "Sin categoría";

      const stockText = document.createTextNode(`Stock: ${p.stock ?? "N/D"}`);

      meta.appendChild(categoriaSpan);
      meta.appendChild(stockText);

      li.appendChild(nombre);
      li.appendChild(meta);
      productosList.appendChild(li);
    });
  };

  const toggleProductos = () => {
    // Si está abierto → cerrar
    if (productosVisible) {
      productosCard.classList.remove("card-visible");
      productosCard.classList.add("card-hidden");
      productosVisible = false;
      return;
    }

    // Si está cerrado → abrir
    llenarListaProductos();
    productosCard.classList.remove("card-hidden");
    productosCard.classList.add("card-visible");
    productosVisible = true;

    productosCard.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  cardTotalProductos.addEventListener("click", toggleProductos);
  cardTotalProductos.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleProductos();
    }
  });
}

// ------------------------
//   LISTA DE INVENTARIO
// ------------------------
if (cardTotalInventario && inventarioCard && inventarioList) {
  const llenarListaInventario = () => {
    inventarioList.innerHTML = "";

    inventario.forEach((item) => {
      const li = document.createElement("li");

      const nombre = document.createElement("strong");
      nombre.textContent = item.nombre;

      const meta = document.createElement("span");
      meta.className = "producto-meta";

      const cantidadText = document.createTextNode(
        `Cantidad: ${item.cantidad || item.Cantidad || 0}`
      );

      meta.appendChild(cantidadText);

      li.appendChild(nombre);
      li.appendChild(meta);
      inventarioList.appendChild(li);
    });
  };

  const toggleInventario = () => {
    if (inventarioVisible) {
      inventarioCard.classList.remove("card-visible");
      inventarioCard.classList.add("card-hidden");
      inventarioVisible = false;
      return;
    }

    llenarListaInventario();
    inventarioCard.classList.remove("card-hidden");
    inventarioCard.classList.add("card-visible");
    inventarioVisible = true;

    inventarioCard.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  cardTotalInventario.addEventListener("click", toggleInventario);
  cardTotalInventario.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleInventario();
    }
  });
}

// ------------------------
//   GRÁFICA CHART.JS
// ------------------------
const canvas = document.getElementById("grafico");
if (canvas) {
  const ctx = canvas.getContext("2d");

  const labels = ventas.map((v) => v.mes);
  const data = ventas.map((v) => v.total);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Ventas mensuales",
          data,
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// ------------------------
//   SERVICE WORKER
// ------------------------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => console.log("SW registrado:", reg.scope))
      .catch((err) => console.error("SW error:", err));
  });
}
