package config

import (
	"os"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestLoad(t *testing.T) {
	// Set some env vars
	os.Setenv("AGENT_CONTROL_PLANE_URL", "http://localhost:3001")
	os.Setenv("AGENT_CLUSTER_ID", "test-cluster")
	os.Setenv("AGENT_AGENT_TOKEN", "test-token")
	os.Setenv("AGENT_DEVELOPMENT", "true")

	cfg, err := Load()
	assert.NoError(t, err)

	assert.Equal(t, "http://localhost:3001", cfg.ControlPlaneURL)
	assert.Equal(t, "test-cluster", cfg.ClusterID)
	assert.Equal(t, "test-token", cfg.AgentToken)
	assert.True(t, cfg.Development)
	assert.Equal(t, 30*time.Second, cfg.HeartbeatInterval)
}
