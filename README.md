1. Instalar dependencias.
   `npm i`
2. Configurar variables de entorno.
   1. Copiar *.env.template* a *.env.*
   2. Editar *.env* con las variables necesarias.
3. Iniciar la base de datos de desarrollo con docker.
   `docker compose up -d`
4. Configurar prisma.
   1. Genera el cliente de prisma.
      `npx prisma generate`
   2. Aplicar migraciones a la base de datos.
      `npx prisma migrate dev`
   3. Ejecutar la semilla
      `npx prisma db seed`
5. Iniciar servidor de desarrollo.
   `npm run dev`
#### Uso de prisma
* Para crear nuevos modelos o modificar existentes, edita el archivo `prisma/schema.prisma`
- Después de cambios en el esquema, ejecuta:
  `npx prisma migrate dev --name [NOMBRE_DE_LA_MIGRACION]`
- Para actualizar el cliente de Prisma después de cambios:
  `npx prisma generate`
