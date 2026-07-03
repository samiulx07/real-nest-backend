-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT 'Dhaka',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "floorLabel" TEXT NOT NULL,
    "totalFloors" INTEGER NOT NULL,
    "totalUnits" INTEGER NOT NULL,
    "unitsPerFloor" INTEGER,
    "startingPrice" DOUBLE PRECISION,
    "handoverDate" TIMESTAMP(3),
    "landArea" TEXT,
    "facing" TEXT,
    "roadSize" TEXT,
    "parkingAvailable" BOOLEAN NOT NULL DEFAULT false,
    "liftAvailable" BOOLEAN NOT NULL DEFAULT false,
    "generatorBackup" BOOLEAN NOT NULL DEFAULT false,
    "securityAvailable" BOOLEAN NOT NULL DEFAULT false,
    "imageUrls" TEXT[],
    "amenities" TEXT[],
    "status" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "properties_slug_key" ON "properties"("slug");
