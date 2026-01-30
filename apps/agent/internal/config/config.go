package config

import (
	"strings"
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	ControlPlaneURL        string        `mapstructure:"control_plane_url"`
	ClusterID             string        `mapstructure:"cluster_id"`
	AgentToken            string        `mapstructure:"agent_token"`
	HeartbeatInterval     time.Duration `mapstructure:"heartbeat_interval"`
	StateSendInterval     time.Duration `mapstructure:"state_send_interval"`
	MetricsSendInterval   time.Duration `mapstructure:"metrics_send_interval"`
	LogLevel              string        `mapstructure:"log_level"`
	Development           bool          `mapstructure:"development"`
}

func Load() (*Config, error) {
	v := viper.New()
	v.SetDefault("heartbeat_interval", "30s")
	v.SetDefault("state_send_interval", "60s")
	v.SetDefault("metrics_send_interval", "60s")
	v.SetDefault("log_level", "info")
	v.SetDefault("development", false)

	v.SetEnvPrefix("AGENT")
	v.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	v.AutomaticEnv()

	// Explicitly bind env vars for required fields
	v.BindEnv("control_plane_url")
	v.BindEnv("cluster_id")
	v.BindEnv("agent_token")

	v.SetConfigName("config")
	v.SetConfigType("yaml")
	v.AddConfigPath(".")
	v.AddConfigPath("/etc/agent/")

	if err := v.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return nil, err
		}
	}

	var config Config
	if err := v.Unmarshal(&config); err != nil {
		return nil, err
	}

	return &config, nil
}
