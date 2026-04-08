from __future__ import annotations

from dataclasses import dataclass

import jax.numpy as jnp

from backend.rl.agent import PolicyGradientAgent, PolicyGradientConfig
from backend.rl.core import RLEnvironment, RLResult


@dataclass(frozen=True)
class KrotovConfig:
    episodes: int = 120
    learning_rate: float = 0.015
    baseline_weight: float = 0.6
    entropy_coef: float = 0.02


def run_krotov(
    drift: jnp.ndarray,
    controls: tuple[jnp.ndarray, ...],
    target: jnp.ndarray,
    dt: float,
    horizon: int,
    config: KrotovConfig = KrotovConfig(),
) -> RLResult:
    """Krotov using Policy Gradient RL with smooth regularization."""

    env = RLEnvironment(drift, controls, target, dt, horizon)

    pg_config = PolicyGradientConfig(
        episodes=config.episodes,
        learning_rate=config.learning_rate,
        baseline_weight=config.baseline_weight,
        entropy_coef=config.entropy_coef,
        policy_scale=0.05,  # Smaller init for smoother policy
    )

    agent = PolicyGradientAgent(env, pg_config)
    return agent.train()

