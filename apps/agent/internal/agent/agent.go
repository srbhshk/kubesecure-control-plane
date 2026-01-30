package agent

import (
	"context"
	"time"

	"github.com/kubesecure/agent/internal/collector"
	"github.com/kubesecure/agent/internal/config"
	"github.com/kubesecure/agent/internal/controlplane"
	"github.com/kubesecure/agent/internal/metrics"
	"github.com/rs/zerolog/log"
	"k8s.io/client-go/kubernetes"
)

type Agent struct {
	cfg              *config.Config
	cpClient         *controlplane.Client
	stateCollector   *collector.StateCollector
	metricsCollector *metrics.MetricsCollector
}

func New(cfg *config.Config, clientset *kubernetes.Clientset) *Agent {
	cpClient := controlplane.NewClient(cfg.ControlPlaneURL, cfg.ClusterID, cfg.AgentToken)
	
	return &Agent{
		cfg:              cfg,
		cpClient:         cpClient,
		stateCollector:   collector.NewStateCollector(clientset),
		metricsCollector: metrics.NewMetricsCollector(clientset),
	}
}

func (a *Agent) Run(ctx context.Context) error {
	heartbeatTicker := time.NewTicker(a.cfg.HeartbeatInterval)
	stateTicker := time.NewTicker(a.cfg.StateSendInterval)
	metricsTicker := time.NewTicker(a.cfg.MetricsSendInterval)
	
	defer heartbeatTicker.Stop()
	defer stateTicker.Stop()
	defer metricsTicker.Stop()

	log.Info().Msg("Agent orchestrator started")

	// Initial sync
	a.sync(ctx)

	for {
		select {
		case <-ctx.Done():
			log.Info().Msg("Agent orchestrator stopping")
			return nil
		case <-heartbeatTicker.C:
			a.sendHeartbeat(ctx)
		case <-stateTicker.C:
			a.sendState(ctx)
		case <-metricsTicker.C:
			a.sendMetrics(ctx)
		}
	}
}

func (a *Agent) sync(ctx context.Context) {
	a.sendHeartbeat(ctx)
	a.sendState(ctx)
	a.sendMetrics(ctx)
}

func (a *Agent) sendHeartbeat(ctx context.Context) {
	payload := controlplane.HeartbeatPayload{
		ClusterID:    a.cfg.ClusterID,
		AgentVersion: "0.1.0", // TODO: use version package
		KubeVersion:  "v1.30.0", // TODO: fetch from kube client
		Capabilities: []string{"state", "metrics", "drift"},
	}

	if err := a.cpClient.SendHeartbeat(ctx, payload); err != nil {
		log.Error().Err(err).Msg("Failed to send heartbeat")
	} else {
		log.Debug().Msg("Heartbeat sent successfully")
	}

	// Also poll for instructions
	instr, err := a.cpClient.FetchInstructions(ctx)
	if err != nil {
		log.Error().Err(err).Msg("Failed to fetch instructions")
	} else if instr != nil {
		log.Debug().Interface("instructions", instr).Msg("Received instructions")
		// TODO: handle instructions (update intervals, verify promotions, etc.)
	}
}

func (a *Agent) sendState(ctx context.Context) {
	resources, err := a.stateCollector.Collect(ctx)
	if err != nil {
		log.Error().Err(err).Msg("Failed to collect state")
		return
	}

	payload := controlplane.StatePayload{
		ClusterID: a.cfg.ClusterID,
		Resources: resources,
		Timestamp: time.Now(),
	}

	if err := a.cpClient.SendState(ctx, payload); err != nil {
		log.Error().Err(err).Msg("Failed to send state")
	} else {
		log.Debug().Int("resources", len(resources)).Msg("State sent successfully")
	}
}

func (a *Agent) sendMetrics(ctx context.Context) {
	m, err := a.metricsCollector.Collect(ctx)
	if err != nil {
		log.Error().Err(err).Msg("Failed to collect metrics")
		return
	}

	payload := controlplane.MetricsPayload{
		ClusterID: a.cfg.ClusterID,
		Metrics:   m,
		Timestamp: time.Now(),
	}

	if err := a.cpClient.SendMetrics(ctx, payload); err != nil {
		log.Error().Err(err).Msg("Failed to send metrics")
	} else {
		log.Debug().Int("metrics", len(m)).Msg("Metrics sent successfully")
	}
}
