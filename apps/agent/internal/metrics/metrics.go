package metrics

import (
	"context"

	"github.com/kubesecure/agent/internal/controlplane"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

type MetricsCollector struct {
	clientset *kubernetes.Clientset
}

func NewMetricsCollector(clientset *kubernetes.Clientset) *MetricsCollector {
	return &MetricsCollector{
		clientset: clientset,
	}
}

func (m *MetricsCollector) Collect(ctx context.Context) ([]controlplane.MetricValue, error) {
	var metrics []controlplane.MetricValue

	// Example: Node count
	nodes, err := m.clientset.CoreV1().Nodes().List(ctx, metav1.ListOptions{})
	if err == nil {
		metrics = append(metrics, controlplane.MetricValue{
			Name:  "kubernetes_node_count",
			Value: float64(len(nodes.Items)),
		})
	}

	return metrics, nil
}
