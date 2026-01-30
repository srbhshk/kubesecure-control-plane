package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"

	"github.com/kubesecure/agent/internal/agent"
	"github.com/kubesecure/agent/internal/config"
	"github.com/kubesecure/agent/internal/kube"
	"github.com/kubesecure/agent/internal/logging"
	"github.com/rs/zerolog/log"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to load configuration")
	}

	// Initialize logging
	logging.Init(cfg.LogLevel, cfg.Development)

	if cfg.ControlPlaneURL == "" || cfg.ClusterID == "" || cfg.AgentToken == "" {
		log.Fatal().Msg("Missing required configuration: AGENT_CONTROL_PLANE_URL, AGENT_CLUSTER_ID, AGENT_TOKEN")
	}

	log.Info().
		Str("control_plane_url", cfg.ControlPlaneURL).
		Str("cluster_id", cfg.ClusterID).
		Msg("Starting KubeSecure Agent")

	// Initialize Kubernetes client
	clientset, err := kube.NewClient()
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to initialize Kubernetes client")
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	// Initialize and start the agent orchestrator
	ag := agent.New(cfg, clientset)
	if err := ag.Run(ctx); err != nil {
		log.Fatal().Err(err).Msg("Agent failed")
	}
	
	log.Info().Msg("Agent shut down successfully")
}
