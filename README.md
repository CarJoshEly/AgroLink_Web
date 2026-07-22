# AgroLink Honduras — Web

Este repositorio contiene **solo el frontend** (Next.js) del marketplace
agrícola AgroLink Honduras. La API REST (NestJS + Prisma + PostgreSQL) vive
en su propio repositorio independiente y se consume por HTTP — este repo no
la contiene ni la ejecuta.

`frontend/` es la raíz efectiva de trabajo: todo el código, dependencias y
scripts viven ahí dentro. Se mantiene como subdirectorio (en vez de
aplanarse a la raíz del repo) para no arriesgar el historial de git con un
movimiento masivo de archivos; en la práctica, cualquier tarea de
desarrollo (`npm install`, `npm run dev`, etc.) se ejecuta dentro de
`frontend/`.

```
AgroLink_WEB/
  frontend/   Aplicación web Next.js (raíz efectiva del proyecto)
```

Ver [`frontend/README.md`](frontend/README.md) para instrucciones de
arranque, variables de entorno, y el detalle de cómo se conecta a la API
real.
