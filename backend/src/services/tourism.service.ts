import { prisma } from "../config/prisma";

type TourismInput = {
  type: number;
  name: string;
  detail?: string;
  province?: string;
  district?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  introImage?: string;
  url?: string;
  isOpen?: boolean;
};

export async function list() {
  return prisma.tourismLocal.findMany({
    orderBy: { createdAt: "desc" }
  });
}

export async function getById(id: number) {
  return prisma.tourismLocal.findUnique({ where: { id } });
}

export async function create(data: TourismInput) {
  return prisma.tourismLocal.create({ data });
}

export async function update(id: number, data: Partial<TourismInput>) {
  return prisma.tourismLocal.update({ where: { id }, data });
}

export async function remove(id: number) {
  return prisma.tourismLocal.delete({ where: { id } });
}
