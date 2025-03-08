-- CreateTable
CREATE TABLE "repertorios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "observacoes" TEXT,
    "bandaId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "repertorios_bandaId_fkey" FOREIGN KEY ("bandaId") REFERENCES "Banda" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "repertorios_blocos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "repertorioId" TEXT NOT NULL,
    "blocoId" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "repertorios_blocos_repertorioId_fkey" FOREIGN KEY ("repertorioId") REFERENCES "repertorios" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "repertorios_blocos_blocoId_fkey" FOREIGN KEY ("blocoId") REFERENCES "blocos_musicais" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "repertorios_blocos_repertorioId_blocoId_key" ON "repertorios_blocos"("repertorioId", "blocoId");
