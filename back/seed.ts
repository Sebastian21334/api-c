const BASE_URL = 'http://localhost:3000';

const ADMIN_EMAIL = 'MAIL_DE_EJEMPLO';
const ADMIN_PASSWORD = 'CONTRASEÑA_DE_EJEMPLO';

const categorias = [
  { name: 'lacteo' },
  { name: 'frescos' },
  { name: 'despensa' },
  { name: 'fiambreria' },
  { name: 'perfumeria' },
];

const productos = [
  { name: 'Jamon cocido',      price: 500,  stock: 10, categorie: 15 },
  { name: 'Jamon crudo',       price: 900,  stock: 8,  categorie: 15 },
  { name: 'Queso cremoso',     price: 800,  stock: 24, categorie: 15 },
  { name: 'Queso de barra',    price: 650,  stock: 18, categorie: 15 },
  { name: 'Salame',            price: 1200, stock: 12, categorie: 15 },

  { name: 'Leche entera',      price: 400,  stock: 50, categorie: 12 },
  { name: 'Leche descremada',  price: 420,  stock: 30, categorie: 12 },
  { name: 'Yogur natural',     price: 350,  stock: 40, categorie: 12 },
  { name: 'Crema de leche',    price: 500,  stock: 20, categorie: 12 },
  { name: 'Manteca',           price: 600,  stock: 15, categorie: 12 },

  { name: 'Arroz largo fino',  price: 1100, stock: 35, categorie: 14 },
  { name: 'Fideos spaghetti',  price: 800,  stock: 40, categorie: 14 },
  { name: 'Aceite de girasol', price: 1500, stock: 25, categorie: 14 },
  { name: 'Azucar',            price: 900,  stock: 30, categorie: 14 },
  { name: 'Harina 0000',       price: 700,  stock: 45, categorie: 14 },

  { name: 'Tomate cherry',     price: 600,  stock: 20, categorie: 13 },
  { name: 'Lechuga',           price: 300,  stock: 25, categorie: 13 },
  { name: 'Zanahoria',         price: 250,  stock: 30, categorie: 13 },

  { name: 'Shampoo',           price: 1200, stock: 20, categorie: 16 },
  { name: 'Acondicionador',    price: 1300, stock: 15, categorie: 16 },
];

async function seed() {
  console.log('🌱 Iniciando carga de datos...\n');

  // 1. Login
  console.log('🔐 Iniciando sesión...');

  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  });

  if (!loginRes.ok) {
    console.log('❌ Login fallido');
    console.log(await loginRes.text());
    process.exit(1);
  }

  const loginData = await loginRes.json();
  const token = loginData.access_token;

  console.log('✅ Login exitoso\n');

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  // 2. Traer categorías (solo para validación opcional)
  console.log('📂 Cargando categorías...');

  const resCat = await fetch(`${BASE_URL}/categories`, {
    headers: authHeaders,
  });

  const existentes = await resCat.json();

  const categoriasIds = {};
  for (const cat of existentes) {
    categoriasIds[cat.id] = cat.name;
  }

  console.log('✅ Categorías cargadas\n');

  // 3. Cargar productos
  console.log('📦 Cargando productos...\n');

  for (const prod of productos) {
    // validación opcional
    if (!categoriasIds[prod.categorie]) {
      console.log(
        `❌ ${prod.name} → categoría ${prod.categorie} no existe`
      );
      continue;
    }

    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: prod.name,
        price: prod.price,
        stock: prod.stock,
        categorie: prod.categorie, // 👈 IMPORTANTE (tu DTO lo exige así)
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`✅ ${prod.name} → id ${data.id}`);
    } else {
      console.log(`❌ Error en ${prod.name}`);
      console.log(await res.text());
    }
  }

  console.log('\n🎉 Seed finalizado');
}

seed().catch(console.error);