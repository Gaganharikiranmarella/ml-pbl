from __future__ import annotations

import jax.numpy as jnp

from backend.rl.agent import PolicyGradientAgent, PolicyGradientConfig
from backend.rl.core import RLEnvironment, RLResult


def run_grape(
    drift: jnp.ndarray,
    controls: tuple[jnp.ndarray, ...],
    target: jnp.ndarray,
    dt: float,
    horizon: int,
    episodes: int = 150,
    learning_rate: float = 0.02,
) -> RLResult:
    """GRAPE using Policy Gradient RL with direct amplitude learning."""

    env = RLEnvironment(drift, controls, target, dt, horizon)

    config = PolicyGradientConfig(
        episodes=episodes,
        learning_rate=learning_rate,
        baseline_weight=0.5,
        entropy_coef=0.005,
        policy_scale=0.08,
    )

    agent = PolicyGradientAgent(env, config)
    return agent.train()


def sample_problem() -> tuple[jnp.ndarray, jnp.ndarray, jnp.ndarray, float, int]:
    """Sample 2-qubit Hadamard problem for testing."""
    sx = jnp.array([[0, 1], [1, 0]], dtype=jnp.complex64)
    sz = jnp.array([[1, 0], [0, -1]], dtype=jnp.complex64)
    hadamard = (1 / jnp.sqrt(2)) * jnp.array(
        [[1, 1], [1, -1]], dtype=jnp.complex64
    )
    return (
        0.2 * sz,
        (sx, sz),
        hadamard,
        0.05,
        80,
    )

