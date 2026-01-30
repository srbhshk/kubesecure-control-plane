package controlplane

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

type Client struct {
	baseURL    string
	clusterID  string
	agentToken string
	httpClient *http.Client
}

func NewClient(baseURL, clusterID, agentToken string) *Client {
	return &Client{
		baseURL:    baseURL,
		clusterID:  clusterID,
		agentToken: agentToken,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

func (c *Client) doRequest(ctx context.Context, method, path string, body interface{}, result interface{}) error {
	var bodyReader io.Reader
	if body != nil {
		jsonBody, err := json.Marshal(body)
		if err != nil {
			return fmt.Errorf("failed to marshal body: %w", err)
		}
		bodyReader = bytes.NewReader(jsonBody)
	}

	url := fmt.Sprintf("%s%s", c.baseURL, path)
	req, err := http.NewRequestWithContext(ctx, method, url, bodyReader)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.agentToken))
	req.Header.Set("X-Cluster-ID", c.clusterID)

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	if result != nil {
		if err := json.NewDecoder(resp.Body).Decode(result); err != nil {
			return fmt.Errorf("failed to decode response: %w", err)
		}
	}

	return nil
}

func (c *Client) SendHeartbeat(ctx context.Context, payload HeartbeatPayload) error {
	return c.doRequest(ctx, http.MethodPost, "/agent/v1/heartbeat", payload, nil)
}

func (c *Client) SendState(ctx context.Context, payload StatePayload) error {
	return c.doRequest(ctx, http.MethodPost, "/agent/v1/state", payload, nil)
}

func (c *Client) SendMetrics(ctx context.Context, payload MetricsPayload) error {
	return c.doRequest(ctx, http.MethodPost, "/agent/v1/metrics", payload, nil)
}

func (c *Client) FetchInstructions(ctx context.Context) (*Instructions, error) {
	var instructions Instructions
	if err := c.doRequest(ctx, http.MethodGet, "/agent/v1/instructions", nil, &instructions); err != nil {
		return nil, err
	}
	return &instructions, nil
}
