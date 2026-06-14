# API-C

## Requisitos
- Node.js 18+
- PostgreSQL (requerido por la entrega final)

## Primeros pasos

1. Clonar el repositorio:
```
git clone <url-del-repo>
cd api-c
```

2. Instalar dependencias:
```
npm install
```

3. Copiar el archivo de variables de entorno:
```
cp .env.example .env
```

4. Editar `.env` con tus datos de Postgres y un JWT_SECRET propio

5. Crear la base de datos en PostgreSQL con el nombre que pusiste en `DB_NAME`

6. Levantar el servidor:
```
npm run start:dev
```

## Cargar datos iniciales

Con el servidor corriendo, ejecutar en otra terminal:
```
npx ts-node seed.ts
```
Esto carga automáticamente las categorías y productos de ejemplo en la BD.

## Notas
- Cada integrante tiene su propia BD local de Postgres — no se comparte
- El primer usuario registrado en `POST /auth/register` con la BD vacía sale como `admin`
- Los siguientes registros salen como `user`
- **Importante:** si usás el archivo `db.sqlite` del repo para probar, ya seguramente tiene 
   usuarios cargados por lo que el próximo registro **no** va a ser `admin`. Usá Postgres 
   con una BD vacía para que el primer registro sea `admin`