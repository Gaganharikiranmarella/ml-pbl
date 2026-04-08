from __future__ import annotations

from dataclasses import dataclass

import jax
import jax.numpy as jnp

from .common import OptimizationResult, QOCProblem, fidelity, initial_pulses, objective


@dataclass(frozen=True)
class KrotovConfig:
    steps: int = 200
    step_size: float = 0.12
    shape_lambda: float = 5e-3


def run_krotov(problem: QOCProblem, config: KrotovConfig = KrotovConfig()) -> OptimizationResult:
    """A lightweight Krotov-style monotonic update loop with a shape penalty."""

    pulses = initial_pulses(len(problem.controls), problem.horizon, scale=0.02)
    grad_fn = jax.grad(lambda p: objective(problem, p, l2_reg=config.shape_lambda))

    loss_hist = []
    fidelity_hist = []
    current = pulses

    for _ in range(config.steps):
        grad = grad_fn(current)
        update = config.step_size * grad
        current = current - update
        loss_hist.append(objective(problem, current, l2_reg=config.shape_lambda))
        fidelity_hist.append(fidelity(problem, current))

    return OptimizationResult(
        pulses=current,
        loss_history=jnp.array(loss_hist),
        fidelity_history=jnp.array(fidelity_hist),
        metadata={
            "steps": float(config.steps),
            "step_size": config.step_size,
            "shape_lambda": config.shape_lambda,
        },
    )
