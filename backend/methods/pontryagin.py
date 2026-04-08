from __future__ import annotations

from dataclasses import dataclass

import jax
import jax.numpy as jnp

from .common import OptimizationResult, QOCProblem, fidelity, initial_pulses, objective


@dataclass(frozen=True)
class PontryaginConfig:
    steps: int = 220
    alpha: float = 0.03
    momentum: float = 0.85


def run_pontryagin(
    problem: QOCProblem,
    config: PontryaginConfig = PontryaginConfig(),
) -> OptimizationResult:
    """Discrete PMP-inspired update using a momentum-regularized Hamiltonian gradient."""

    pulses = initial_pulses(len(problem.controls), problem.horizon, scale=0.08)
    grad_fn = jax.grad(lambda p: objective(problem, p, l2_reg=1e-4))

    velocity = jnp.zeros_like(pulses)
    loss_hist = []
    fidelity_hist = []
    current = pulses

    for _ in range(config.steps):
        grad = grad_fn(current)
        velocity = config.momentum * velocity + (1.0 - config.momentum) * grad
        current = current - config.alpha * velocity
        loss_hist.append(objective(problem, current, l2_reg=1e-4))
        fidelity_hist.append(fidelity(problem, current))

    return OptimizationResult(
        pulses=current,
        loss_history=jnp.array(loss_hist),
        fidelity_history=jnp.array(fidelity_hist),
        metadata={
            "steps": float(config.steps),
            "alpha": config.alpha,
            "momentum": config.momentum,
        },
    )
