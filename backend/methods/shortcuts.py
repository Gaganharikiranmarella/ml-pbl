from __future__ import annotations

from dataclasses import dataclass

import jax.numpy as jnp

from backend.rl.agent import PolicyGradientAgent, PolicyGradientConfig
from backend.rl.core import RLEnvironment, RLResult


@dataclass(frozen=True)
class STAConfig:
    episodes: int = 110
    learning_rate: float = 0.012
    baseline_weight: float = 0.7
    entropy_coef: float = 0.03


def run_shortcuts_to_adiabaticity(
    drift: jnp.ndarray,
    controls: tuple[jnp.ndarray, ...],
    target: jnp.ndarray,
    dt: float,
    horizon: int,
    config: STAConfig = STAConfig(),
) -> RLResult:
    """STA using Policy Gradient RL with strong smoothness constraints."""

    env = RLEnvironment(drift, controls, target, dt, horizon)

    pg_config = PolicyGradientConfig(
        episodes=config.episodes,
        learning_rate=config.learning_rate,
        baseline_weight=config.baseline_weight,
        entropy_coef=config.entropy_coef,
        policy_scale=0.03,  # Very small init for smooth pulses
    )

    agent = PolicyGradientAgent(env, pg_config)
    return agent.train()

