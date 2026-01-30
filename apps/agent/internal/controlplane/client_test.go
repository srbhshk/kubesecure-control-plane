package controlplane

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestClient_SendHeartbeat(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		assert.Equal(t, "/agent/v1/heartbeat", r.URL.Path)
		assert.Equal(t, "Bearer test-token", r.Header.Get("Authorization"))
		assert.Equal(t, "test-cluster", r.Header.Get("X-Cluster-ID"))

		var payload HeartbeatPayload
		err := json.NewDecoder(r.Body).Decode(&payload)
		assert.NoError(t, err)
		assert.Equal(t, "test-cluster", payload.ClusterID)

		w.WriteHeader(http.StatusOK)
	}))
	defer server.Close()

	client := NewClient(server.URL, "test-cluster", "test-token")
	err := client.SendHeartbeat(context.Background(), HeartbeatPayload{
		ClusterID: "test-cluster",
	})
	assert.NoError(t, err)
}

func TestClient_FetchInstructions(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		assert.Equal(t, "/agent/v1/instructions", r.URL.Path)
		
		instr := Instructions{
			HeartbeatInterval: 60,
			FeatureFlags:      []string{"drift-detection"},
		}
		json.NewEncoder(w).Encode(instr)
	}))
	defer server.Close()

	client := NewClient(server.URL, "test-cluster", "test-token")
	instr, err := client.FetchInstructions(context.Background())
	assert.NoError(t, err)
	assert.NotNil(t, instr)
	assert.Equal(t, 60, instr.HeartbeatInterval)
	assert.Contains(t, instr.FeatureFlags, "drift-detection")
}
