package collector

import (
	"context"
	"fmt"

	"github.com/kubesecure/agent/internal/controlplane"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

type StateCollector struct {
	clientset *kubernetes.Clientset
}

func NewStateCollector(clientset *kubernetes.Clientset) *StateCollector {
	return &StateCollector{
		clientset: clientset,
	}
}

func (s *StateCollector) Collect(ctx context.Context) ([]controlplane.Resource, error) {
	var resources []controlplane.Resource

	// Collect Deployments
	deploys, err := s.clientset.AppsV1().Deployments("").List(ctx, metav1.ListOptions{})
	if err == nil {
		for _, d := range deploys.Items {
			resources = append(resources, controlplane.Resource{
				Kind:      "Deployment",
				Namespace: d.Namespace,
				Name:      d.Name,
				Status:    fmt.Sprintf("%d/%d", d.Status.ReadyReplicas, d.Status.Replicas),
				Labels:    d.Labels,
			})
		}
	}

	// Collect Pods
	pods, err := s.clientset.CoreV1().Pods("").List(ctx, metav1.ListOptions{})
	if err == nil {
		for _, p := range pods.Items {
			resources = append(resources, controlplane.Resource{
				Kind:      "Pod",
				Namespace: p.Namespace,
				Name:      p.Name,
				Status:    string(p.Status.Phase),
				Labels:    p.Labels,
			})
		}
	}

	// Collect Services
	svcs, err := s.clientset.CoreV1().Services("").List(ctx, metav1.ListOptions{})
	if err == nil {
		for _, svc := range svcs.Items {
			resources = append(resources, controlplane.Resource{
				Kind:      "Service",
				Namespace: svc.Namespace,
				Name:      svc.Name,
				Status:    string(svc.Spec.Type),
				Labels:    svc.Labels,
			})
		}
	}

	return resources, nil
}
