from __future__ import annotations

from dataclasses import dataclass

import jax
import jax.numpy as jnp

from .common import OptimizationResult, QOCProblem, fidelity, initial_pulses, objective


@dataclass(frozen=True)
class STAConfig:
    steps: int = 180
    learning_rate: float = 0.02
    smoothness_weight: float = 8e-3


def _finite_difference_smoothness(pulses: jnp.ndarray) -> jnp.ndarray:
    return jnp.mean((pulses[:, 1:] - pulses[:, :-1]) ** 2)


def run_shortcuts_to_adiabaticity(
    problem: QOCProblem,
    config: STAConfig = STAConfig(),
) -> OptimizationResult:
    """STA-inspired optimization balancing fidelity and pulse smoothness."""

    pulses = initial_pulses(len(problem.controls), problem.horizon, scale=0.01)

    def sta_loss(p: jnp.ndarray) -> jnp.ndarray:
        base = objective(problem, p, l2_reg=2e-4)
        return base + config.smoothness_weight * _finite_difference_smoothness(p)

    grad_fn = jax.grad(sta_loss)

    loss_hist = []
    fidelity_hist = []
    current = pulses

    for _ in range(config.steps):
        grad = grad_fn(current)
        current = current - config.learning_rate * grad
        loss_hist.append(sta_loss(current))
        fidelity_hist.append(fidelity(problem, current))

    return OptimizationResult(
        pulses=current,
        loss_history=jnp.array(loss_hist),
        fidelity_history=jnp.array(fidelity_hist),
        metadata={
            "steps": float(config.steps),
            "learning_rate": config.learning_rate,
            "smoothness_weight": config.smoothness_weight,
        },
    )
