package drift

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"

	"github.com/kubesecure/agent/internal/controlplane"
)

type DriftDetector struct{}

func NewDriftDetector() *DriftDetector {
	return &DriftDetector{}
}

// ComputeHash computes a hash of the resource to help control plane detect drift
func (d *DriftDetector) ComputeHash(resource controlplane.Resource) (string, error) {
	data, err := json.Marshal(resource)
	if err != nil {
		return "", fmt.Errorf("failed to marshal resource: %w", err)
	}
	hash := sha256.Sum256(data)
	return hex.EncodeToString(hash[:]), nil
}
