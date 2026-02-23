import { prisma } from "./prisma";

export interface AuditPayload {
  action: string;
  entity: string;
  entityId?: string;
  payload?: Record<string, unknown>;
  actorId?: string;
  ip?: string;
  userAgent?: string;
}

export async function createAuditLog(p: AuditPayload): Promise<void> {
  await prisma.auditLog.create({
    data: {
      action: p.action,
      entity: p.entity,
      entityId: p.entityId ?? null,
      payload: p.payload ?? undefined,
      actorId: p.actorId ?? null,
      ip: p.ip ?? null,
      userAgent: p.userAgent ?? null,
    },
  });
}
