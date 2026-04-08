from __future__ import annotations

from dataclasses import dataclass

import jax.numpy as jnp

from backend.rl.agent import PolicyGradientAgent, PolicyGradientConfig
from backend.rl.core import RLEnvironment, RLResult


@dataclass(frozen=True)
class PontryaginConfig:
    episodes: int = 140
    learning_rate: float = 0.018
    baseline_weight: float = 0.55
    entropy_coef: float = 0.015


def run_pontryagin(
    drift: jnp.ndarray,
    controls: tuple[jnp.ndarray, ...],
    target: jnp.ndarray,
    dt: float,
    horizon: int,
    config: PontryaginConfig = PontryaginConfig(),
) -> RLResult:
    """Pontryagin using Policy Gradient RL with costate-inspired regularization."""

    env = RLEnvironment(drift, controls, target, dt, horizon)

    pg_config = PolicyGradientConfig(
        episodes=config.episodes,
        learning_rate=config.learning_rate,
        baseline_weight=config.baseline_weight,
        entropy_coef=config.entropy_coef,
        policy_scale=0.07,
    )

    agent = PolicyGradientAgent(env, pg_config)
    return agent.train()

