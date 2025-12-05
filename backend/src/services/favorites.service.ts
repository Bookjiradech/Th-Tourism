import { prisma } from "../config/prisma";

type FavoriteInput =
  | { 
      tourismLocalId: number; 
      externalSource?: undefined; 
      externalId?: undefined;
      externalName?: undefined;
      externalDetail?: undefined;
      externalImage?: undefined;
      externalProvince?: undefined;
    }
  | { 
      tourismLocalId?: undefined; 
      externalSource: string; 
      externalId: string;
      externalName?: string;
      externalDetail?: string;
      externalImage?: string;
      externalProvince?: string;
    };

export async function listByUser(userId: number) {
  return prisma.favorite.findMany({
    where: { userId },
    include: { tourismLocal: true },
    orderBy: { createdAt: "desc" }
  });
}

export async function add(userId: number, input: FavoriteInput) {
  return prisma.favorite.create({
    data: {
      userId,
      tourismLocalId: input.tourismLocalId,
      externalSource: input.externalSource,
      externalId: input.externalId,
      externalName: input.externalName,
      externalDetail: input.externalDetail,
      externalImage: input.externalImage,
      externalProvince: input.externalProvince,
    }
  });
}

export async function remove(userId: number, favoriteId: number) {
  // ensure เป็นของ user
  const fav = await prisma.favorite.findFirst({
    where: { id: favoriteId, userId }
  });
  if (!fav) {
    const err: any = new Error("Favorite not found");
    err.status = 404;
    throw err;
  }
  await prisma.favorite.delete({ where: { id: favoriteId } });
}
