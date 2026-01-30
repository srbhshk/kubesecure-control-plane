import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export async function agentRoutes(fastify: FastifyInstance) {
  fastify.post('/agent/v1/heartbeat', {
    onRequest: [
      async (request, reply) => {
        try {
          await request.jwtVerify();
        } catch (err) {
          reply.send(err);
        }
      },
    ],
    schema: {
      body: z.object({
        clusterId: z.string(),
        agentVersion: z.string(),
        kubeVersion: z.string(),
      }),
    },
    handler: async (request, reply) => {
      const { clusterId, agentVersion, kubeVersion } = request.body as {
        clusterId: string;
        agentVersion: string;
        kubeVersion: string;
      };

      // Verify token matches clusterId
      const payload = request.user as { clusterId: string; type: string };
      if (payload.type !== 'agent' || payload.clusterId !== clusterId) {
        return reply.status(403).send({ error: 'Invalid token for this cluster' });
      }

      // Update cluster status
      await prisma.cluster.update({
        where: { id: clusterId },
        data: {
          status: 'HEALTHY',
          lastSeenAt: new Date(),
        },
      });

      fastify.log.debug({ clusterId }, 'Received heartbeat from agent');

      return { status: 'ok' };
    },
  });

  fastify.get('/agent/v1/instructions', {
    onRequest: [
      async (request, reply) => {
        try {
          await request.jwtVerify();
        } catch (err) {
          reply.send(err);
        }
      },
    ],
    handler: async (request, reply) => {
      const payload = request.user as { clusterId: string };

      // Fetch any pending instructions (drift detection, promotion verification)
      // For MVP, return default instructions
      return {
        heartbeatInterval: 30,
        stateSendInterval: 60,
        metricsSendInterval: 60,
      };
    },
  });
}
