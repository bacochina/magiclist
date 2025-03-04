-- CreateTable
CREATE TABLE "pedaleiras" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "bancos_pedaleira" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" INTEGER NOT NULL,
    "descricao" TEXT,
    "pedaleira_id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "bancos_pedaleira_pedaleira_id_fkey" FOREIGN KEY ("pedaleira_id") REFERENCES "pedaleiras" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "patches_pedaleira" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" INTEGER NOT NULL,
    "letra" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT,
    "banco_id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "patches_pedaleira_banco_id_fkey" FOREIGN KEY ("banco_id") REFERENCES "bancos_pedaleira" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "musicas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "artista" TEXT NOT NULL,
    "tom" TEXT NOT NULL,
    "bpm" INTEGER NOT NULL,
    "bandaId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_MusicaToPatchPedaleira" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_MusicaToPatchPedaleira_A_fkey" FOREIGN KEY ("A") REFERENCES "musicas" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MusicaToPatchPedaleira_B_fkey" FOREIGN KEY ("B") REFERENCES "patches_pedaleira" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_MusicaToPatchPedaleira_AB_unique" ON "_MusicaToPatchPedaleira"("A", "B");

-- CreateIndex
CREATE INDEX "_MusicaToPatchPedaleira_B_index" ON "_MusicaToPatchPedaleira"("B");
