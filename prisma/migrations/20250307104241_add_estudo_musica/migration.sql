-- CreateTable
CREATE TABLE "EstudoMusica" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "musicaId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notas" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EstudoMusica_musicaId_fkey" FOREIGN KEY ("musicaId") REFERENCES "musicas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "EstudoMusica_musicaId_idx" ON "EstudoMusica"("musicaId");
