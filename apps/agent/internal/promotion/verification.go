package promotion

import (
	"context"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

type Verifier struct {
	clientset *kubernetes.Clientset
}

func NewVerifier(clientset *kubernetes.Clientset) *Verifier {
	return &Verifier{
		clientset: clientset,
	}
}

func (v *Verifier) VerifyPromotion(ctx context.Context, promotionID string) (bool, string, error) {
	// In a real implementation, we would look for resources tagged with this promotionID
	// and verify their health. For now, we provide a placeholder.
	
	// Example check: look for any pod with a specific label
	labelSelector := "kubesecure.io/promotion-id=" + promotionID
	pods, err := v.clientset.CoreV1().Pods("").List(ctx, metav1.ListOptions{
		LabelSelector: labelSelector,
	})
	if err != nil {
		return false, "failed to list pods", err
	}

	if len(pods.Items) == 0 {
		return false, "no pods found for promotion", nil
	}

	for _, p := range pods.Items {
		if p.Status.Phase != "Running" {
			return false, "at least one pod is not running", nil
		}
	}

	return true, "all pods running", nil
}
