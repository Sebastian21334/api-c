const BASE_URL = 'http://localhost:3000';

const categorias = [
  { name: 'lacteo' },
  { name: 'frescos' },
  { name: 'despensa' },
  { name: 'fiambreria' },
  { name: 'perfumeria' },
];

const productos = [
  { name: 'Jamon cocido',      price: 500,  stock: 10, categorie: 'fiambreria' },
  { name: 'Jamon crudo',       price: 900,  stock: 8,  categorie: 'fiambreria' },
  { name: 'Queso cremoso',     price: 800,  stock: 24, categorie: 'fiambreria' },
  { name: 'Queso de barra',    price: 650,  stock: 18, categorie: 'fiambreria' },
  { name: 'Salame',            price: 1200, stock: 12, categorie: 'fiambreria' },
  { name: 'Leche entera',      price: 400,  stock: 50, categorie: 'lacteo' },
  { name: 'Leche descremada',  price: 420,  stock: 30, categorie: 'lacteo' },
  { name: 'Yogur natural',     price: 350,  stock: 40, categorie: 'lacteo' },
  { name: 'Crema de leche',    price: 500,  stock: 20, categorie: 'lacteo' },
  { name: 'Manteca',           price: 600,  stock: 15, categorie: 'lacteo' },
  { name: 'Arroz largo fino',  price: 1100, stock: 35, categorie: 'despensa' },
  { name: 'Fideos spaghetti',  price: 800,  stock: 40, categorie: 'despensa' },
  { name: 'Aceite de girasol', price: 1500, stock: 25, categorie: 'despensa' },
  { name: 'Azucar',            price: 900,  stock: 30, categorie: 'despensa' },
  { name: 'Harina 0000',       price: 700,  stock: 45, categorie: 'despensa' },
  { name: 'Tomate cherry',     price: 600,  stock: 20, categorie: 'frescos' },
  { name: 'Lechuga',           price: 300,  stock: 25, categorie: 'frescos' },
  { name: 'Zanahoria',         price: 250,  stock: 30, categorie: 'frescos' },
  { name: 'Shampoo',           price: 1200, stock: 20, categorie: 'perfumeria' },
  { name: 'Acondicionador',    price: 1300, stock: 15, categorie: 'perfumeria' },
];

async function seed() {
  console.log('🌱 Iniciando carga de datos...\n');

  // 1. Traer categorías existentes
  const resGet = await fetch(`${BASE_URL}/categories`);
  const existentes: { id: number; name: string }[] = await resGet.json();

  // Mapa nombre → id
  const mapaCategoria: Record<string, number> = {};
  for (const cat of existentes) {
    mapaCategoria[cat.name] = cat.id;
  }

  // 2. Crear las que no existen
  console.log('📂 Verificando categorías...');
  for (const cat of categorias) {
    if (mapaCategoria[cat.name]) {
      console.log(`  ✅ ${cat.name} → id ${mapaCategoria[cat.name]} (ya existía)`);
    } else {
      const res = await fetch(`${BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cat),
      });
      const data = await res.json();
      mapaCategoria[cat.name] = data.id;
      console.log(`  ✅ ${cat.name} → id ${data.id} (creada)`);
    }
  }

  // 3. Cargar productos
  console.log('\n📦 Cargando productos...');
  for (const prod of productos) {
    const categorieId = mapaCategoria[prod.categorie];

    if (!categorieId) {
      console.log(`  ❌ ${prod.name} → categoría "${prod.categorie}" no encontrada`);
      continue;
    }

    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...prod, categorie: categorieId }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`  ✅ ${prod.name} → id ${data.id}`);
    } else {
      const err = await res.json();
      console.log(`  ❌ ${prod.name} → ${JSON.stringify(err.message)}`);
    }
  }

  console.log('\n✅ Carga finalizada!');
}

seed().catch(console.error);
