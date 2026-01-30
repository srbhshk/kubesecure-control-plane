package controlplane

import "time"

type HeartbeatPayload struct {
	ClusterID         string            `json:"clusterId"`
	AgentVersion      string            `json:"agentVersion"`
	KubeVersion       string            `json:"kubeVersion"`
	Capabilities      []string          `json:"capabilities"`
	LastSyncTime      map[string]time.Time `json:"lastSyncTime"`
}

type StatePayload struct {
	ClusterID string      `json:"clusterId"`
	Resources []Resource  `json:"resources"`
	Timestamp time.Time   `json:"timestamp"`
}

type Resource struct {
	Kind      string            `json:"kind"`
	Namespace string            `json:"namespace"`
	Name      string            `json:"name"`
	Status    string            `json:"status"`
	Labels    map[string]string `json:"labels"`
}

type MetricsPayload struct {
	ClusterID string           `json:"clusterId"`
	Metrics   []MetricValue    `json:"metrics"`
	Timestamp time.Time        `json:"timestamp"`
}

type MetricValue struct {
	Name   string            `json:"name"`
	Value  float64           `json:"value"`
	Labels map[string]string `json:"labels"`
}

type Instructions struct {
	HeartbeatInterval   int      `json:"heartbeatInterval,omitempty"`
	StateSendInterval   int      `json:"stateSendInterval,omitempty"`
	MetricsSendInterval int      `json:"metricsSendInterval,omitempty"`
	FeatureFlags        []string `json:"featureFlags,omitempty"`
	PromotionsToVerify  []string `json:"promotionsToVerify,omitempty"`
}
