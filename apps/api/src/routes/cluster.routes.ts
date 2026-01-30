import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export async function clusterRoutes(fastify: FastifyInstance) {
  fastify.post('/clusters', {
    schema: {
      body: z.object({
        name: z.string().min(3),
        orgId: z.string(), // In a real app, this would come from the user's JWT
      }),
    },
    handler: async (request, reply) => {
      const { name, orgId } = request.body as { name: string; orgId: string };

      // 1. Create cluster in DB
      const cluster = await prisma.cluster.create({
        data: {
          name,
          orgId,
          status: 'PENDING',
        },
      });

      // 2. Generate Agent JWT
      // Payload includes clusterId and orgId for verification on heartbeat
      const agentToken = fastify.jwt.sign({
        clusterId: cluster.id,
        orgId: cluster.orgId,
        type: 'agent',
      });

      // 3. Update cluster with token (optional, but good for audit/retrieval)
      await prisma.cluster.update({
        where: { id: cluster.id },
        data: { agentToken },
      });

      return {
        clusterId: cluster.id,
        agentToken,
      };
    },
  });

  fastify.get('/clusters', async (request, reply) => {
    // In a real app, filter by user's orgId
    const clusters = await prisma.cluster.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return clusters;
  });

  fastify.get('/clusters/:id/status', async (request, reply) => {
    const { id } = request.params as { id: string };
    const cluster = await prisma.cluster.findUnique({
      where: { id },
      select: { status: true, lastSeenAt: true },
    });

    if (!cluster) {
      return reply.status(404).send({ error: 'Cluster not found' });
    }

    return cluster;
  });
}
