-- CreateTable
CREATE TABLE "blocos_musicais" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "bandaId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "blocos_musicais_bandaId_fkey" FOREIGN KEY ("bandaId") REFERENCES "Banda" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "blocos_musicas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "blocoId" TEXT NOT NULL,
    "musicaId" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "blocos_musicas_blocoId_fkey" FOREIGN KEY ("blocoId") REFERENCES "blocos_musicais" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "blocos_musicas_musicaId_fkey" FOREIGN KEY ("musicaId") REFERENCES "musicas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "blocos_musicas_blocoId_musicaId_key" ON "blocos_musicas"("blocoId", "musicaId");
