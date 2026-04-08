"""Policy Gradient RL Agent for Quantum Optimal Control."""

from __future__ import annotations

from dataclasses import dataclass

import jax
import jax.numpy as jnp

from .core import RLEnvironment, RLResult


@dataclass(frozen=True)
class PolicyGradientConfig:
    """Configuration for policy gradient training."""

    episodes: int = 100
    learning_rate: float = 0.01
    baseline_weight: float = 0.5
    entropy_coef: float = 0.01
    policy_scale: float = 0.1


class PolicyGradientAgent:
    """Policy Gradient RL agent using REINFORCE with baseline."""

    def __init__(
        self,
        env: RLEnvironment,
        config: PolicyGradientConfig = PolicyGradientConfig(),
    ):
        self.env = env
        self.config = config
        self.num_controls = len(env.controls)
        self.horizon = env.horizon

    def policy_forward(self, params: jnp.ndarray) -> jnp.ndarray:
        """Generate pulse sequence from policy parameters."""
        # Expand learnable params through time via smoothing basis
        # Shape: (num_controls, horizon)
        return params * jnp.linspace(1.0, 0.8, self.horizon)[None, :]

    def compute_policy_loss(
        self,
        params: jnp.ndarray,
        baseline_params: jnp.ndarray,
    ) -> tuple[jnp.ndarray, dict]:
        """Compute policy gradient loss with baseline."""
        # Generate pulse from policy
        pulses = self.policy_forward(params)

        # Compute reward
        reward = self.env.compute_reward(pulses)
        fidelity = self.env.compute_fidelity(pulses)

        # Baseline prediction
        baseline = jnp.mean(baseline_params)

        # Advantage
        advantage = reward - baseline

        # Policy loss: -log_prob * advantage
        # Simplified: MSE between params and advantage-scaled params
        policy_loss = -advantage * jnp.mean(params**2)

        # Entropy regularization
        entropy = -jnp.sum(params**2) * self.config.entropy_coef

        total_loss = policy_loss - entropy

        return total_loss, {"reward": reward, "fidelity": fidelity, "advantage": advantage}

    def train(self) -> RLResult:
        """Train policy using REINFORCE algorithm."""
        # Initialize policy and baseline parameters
        policy_params = jnp.ones((self.num_controls, self.horizon)) * self.config.policy_scale
        baseline_params = jnp.array([0.5])

        # Gradient functions
        policy_grad_fn = jax.grad(
            lambda p: self.compute_policy_loss(p, baseline_params)[0]
        )
        baseline_grad_fn = jax.grad(
            lambda b: self.compute_policy_loss(policy_params, b)[0]
        )

        reward_history = []
        fidelity_history = []

        for episode in range(self.config.episodes):
            # Policy gradient update
            policy_grads = policy_grad_fn(policy_params)
            policy_params = policy_params - self.config.learning_rate * policy_grads

            # Baseline update
            baseline_grads = baseline_grad_fn(baseline_params)
            baseline_params = baseline_params - (
                self.config.learning_rate * self.config.baseline_weight * baseline_grads
            )

            # Track metrics
            pulses = self.policy_forward(policy_params)
            reward = float(self.env.compute_reward(pulses))
            fidelity = float(self.env.compute_fidelity(pulses))

            reward_history.append(reward)
            fidelity_history.append(fidelity)

        # Final pulses
        final_pulses = self.policy_forward(policy_params)

        return RLResult(
            policies={"policy_params": policy_params, "baseline_params": baseline_params},
            reward_history=jnp.array(reward_history),
            fidelity_history=jnp.array(fidelity_history),
            metadata={
                "episodes": float(self.config.episodes),
                "learning_rate": self.config.learning_rate,
                "final_fidelity": float(fidelity_history[-1]),
                "final_reward": float(reward_history[-1]),
            },
        )
