-- CreateTable
CREATE TABLE "Banda" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "logo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_musicas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "artista" TEXT NOT NULL,
    "tom" TEXT NOT NULL,
    "bpm" INTEGER NOT NULL,
    "bandaId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "musicas_bandaId_fkey" FOREIGN KEY ("bandaId") REFERENCES "Banda" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_musicas" ("artista", "bandaId", "bpm", "createdAt", "id", "nome", "tom", "updatedAt") SELECT "artista", "bandaId", "bpm", "createdAt", "id", "nome", "tom", "updatedAt" FROM "musicas";
DROP TABLE "musicas";
ALTER TABLE "new_musicas" RENAME TO "musicas";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
