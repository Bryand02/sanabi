# Sanabi

Sanabi es una tienda online de ropa infantil nueva y de segunda mano construida con `Next.js`, `Prisma`, `SQLite` y `NextAuth`.

## Qué incluye

- Home con identidad visual propia y catálogo responsive.
- Filtros por talla, categoría, estado y género.
- Página individual de producto.
- Carrito persistente en navegador.
- Registro e inicio de sesión.
- Checkout con estructura preparada para PSE usando Wompi o Mercado Pago.
- Confirmación de compra por correo si configuras SMTP.
- Panel administrativo con CRUD de productos, carga de imágenes y gestión de pedidos.
- Roles `ADMIN` y `USER`.

## Requisitos

- Node.js 20+.
- npm 10+.

## Ejecutar localmente

1. Instala dependencias:

```bash
npm install
```

2. Crea tu archivo `.env` a partir de `.env.example`.

3. Genera la base y carga datos de prueba:

```bash
npm run db:push
npm run db:seed
```

4. Inicia el proyecto:

```bash
npm run dev
```

5. Abre `http://localhost:3000`.

## Docker en puerto 8100

1. Crea el archivo de entorno Docker:

```bash
cp .env.docker.example .env.docker
```

2. Levanta el proyecto:

```bash
docker compose up -d --build
```

3. Abre:

```text
http://TU_SERVIDOR:8100
```

### Persistencia en Docker

- La base de datos queda en el volumen `sanabi_data`.
- Las imágenes subidas quedan en el volumen `sanabi_uploads`.
- El contenedor inicializa la base y carga datos de prueba solo la primera vez.

## Usuario administrador de prueba

- Correo: `admin@sanabi.co`
- Contraseña: `AdminSanabi2026!`

## Variables de entorno clave

- `DATABASE_URL`: local usa `file:./dev.db` dentro de `prisma/`. Docker usa `file:/app/data/dev.db`.
- `AUTH_SECRET`: secreto para sesiones.
- `AUTH_URL`: URL base de la app.
- `SANDBOX_PAYMENT_MODE`: usa `mock` para aprobar pagos en modo demo.
- `WOMPI_*`: llaves para integrar Wompi.
- `MERCADO_PAGO_*`: llaves para integrar Mercado Pago.
- `SMTP_*`: credenciales de correo.

## Notas de integración

- El checkout ya crea pedidos, pagos y descuenta inventario.
- Si no configuras Wompi o Mercado Pago, el proyecto usa un modo sandbox funcional.
- Si no configuras SMTP, la confirmación por correo se registra en consola del servidor.
