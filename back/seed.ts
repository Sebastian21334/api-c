const BASE_URL = 'http://localhost:3000';

const ADMIN_EMAIL = 'santigomezprola@gmail.com';
const ADMIN_PASSWORD = 'santiago23';

const categorias = [
  { name: 'lacteo' },
  { name: 'frescos' },
  { name: 'despensa' },
  { name: 'fiambreria' },
  { name: 'perfumeria' },
];

const productos = [
  { name: 'Jamon cocido', price: 500, stock: 10, category: 'fiambreria' },
  { name: 'Jamon crudo', price: 900, stock: 8, category: 'fiambreria' },
  { name: 'Queso cremoso', price: 800, stock: 24, category: 'fiambreria' },
  { name: 'Queso de barra', price: 650, stock: 18, category: 'fiambreria' },
  { name: 'Salame', price: 1200, stock: 12, category: 'fiambreria' },

  { name: 'Leche entera', price: 400, stock: 50, category: 'lacteo' },
  { name: 'Leche descremada', price: 420, stock: 30, category: 'lacteo' },
  { name: 'Yogur natural', price: 350, stock: 40, category: 'lacteo' },
  { name: 'Crema de leche', price: 500, stock: 20, category: 'lacteo' },
  { name: 'Manteca', price: 600, stock: 15, category: 'lacteo' },

  { name: 'Arroz largo fino', price: 1100, stock: 35, category: 'despensa' },
  { name: 'Fideos spaghetti', price: 800, stock: 40, category: 'despensa' },
  { name: 'Aceite de girasol', price: 1500, stock: 25, category: 'despensa' },
  { name: 'Azucar', price: 900, stock: 30, category: 'despensa' },
  { name: 'Harina 0000', price: 700, stock: 45, category: 'despensa' },

  { name: 'Tomate cherry', price: 600, stock: 20, category: 'frescos' },
  { name: 'Lechuga', price: 300, stock: 25, category: 'frescos' },
  { name: 'Zanahoria', price: 250, stock: 30, category: 'frescos' },

  { name: 'Shampoo', price: 1200, stock: 20, category: 'perfumeria' },
  { name: 'Acondicionador', price: 1300, stock: 15, category: 'perfumeria' },
];

// helper para normalizar nombres
const normalize = (str: string) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

async function seed() {
  console.log('🌱 Iniciando seed...\n');

  // 1. LOGIN
  console.log('🔐 Login...');

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

  const { access_token } = await loginRes.json();

  console.log('✅ Login OK\n');

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access_token}`,
  };

  // 2. CREAR CATEGORÍAS (SI NO EXISTEN)
  console.log('📂 Creando categorías...');

  for (const cat of categorias) {
    const res = await fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(cat),
    });

    if (res.ok) {
      console.log(`✅ Categoría creada: ${cat.name}`);
    } else {
      const text = await res.text();

      // si ya existe, no rompemos el seed
      if (!text.toLowerCase().includes('exists')) {
        console.log(`⚠️ ${cat.name}: ${text}`);
      }
    }
  }

  console.log('\n📥 Obteniendo categorías...');

  const resCat = await fetch(`${BASE_URL}/categories`, {
    headers: authHeaders,
  });

  const categoriasBackend = await resCat.json();

  if (!Array.isArray(categoriasBackend)) {
    console.log('❌ Error: categorías no válidas');
    console.log(categoriasBackend);
    process.exit(1);
  }

  // map: nombre normalizado → id
  const categoriaMap: Record<string, number> = {};

  for (const cat of categoriasBackend) {
    categoriaMap[normalize(cat.name)] = cat.id;
  }

  console.log('✅ Categorías listas\n');

  // 3. CREAR PRODUCTOS
  console.log('📦 Creando productos...\n');

  for (const prod of productos) {
    const categoryId = categoriaMap[normalize(prod.category)];

    if (!categoryId) {
      console.log(`❌ ${prod.name} → categoría "${prod.category}" no existe`);
      continue;
    }

    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: prod.name,
        price: prod.price,
        stock: prod.stock,
        categoryId,
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

  console.log('\n🎉 Seed finalizado correctamente');
}

seed().catch(console.error);