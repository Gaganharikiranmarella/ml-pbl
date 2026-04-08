import { MethodContent, MethodId } from "@/types/method";

const defaultN = [16, 32, 64, 96, 128, 192, 256];

const curveFns: Record<MethodId, (n: number) => { time: number; space: number }> = {
  grape: (n) => ({ time: 1.6 * n ** 2, space: 0.8 * n }),
  krotov: (n) => ({ time: 1.3 * n ** 2.2, space: 1.1 * n }),
  pontryagin: (n) => ({ time: 1.1 * n ** 1.9, space: 0.9 * n }),
  shortcuts: (n) => ({ time: 0.9 * n ** 1.6, space: 0.6 * n }),
};

const buildComplexity = (methodId: MethodId) =>
  defaultN.map((n) => ({ n, ...curveFns[methodId](n) }));

export const METHODS: Record<MethodId, MethodContent> = {
  grape: {
    id: "grape",
    title: "GRAPE",
    subtitle: "Gradient Ascent Pulse Engineering",
    theory:
      "GRAPE discretizes the control pulse into time bins and performs gradient ascent over each bin to maximize gate fidelity. It is widely used because it is numerically stable and scales well to medium-size control landscapes.",
    code: `def run_grape(problem, steps=250, learning_rate=3e-2):\n    pulses = initial_pulses(len(problem.controls), problem.horizon, scale=0.05)\n    return optimize_with_gradient_descent(\n        problem=problem,\n        pulses=pulses,\n        steps=steps,\n        learning_rate=learning_rate,\n        l2_reg=1e-4,\n    )`,
    example:
      "Applied to a 1-qubit Hadamard gate transfer, GRAPE quickly improves fidelity while maintaining smooth pulse amplitudes when mild regularization is used.",
    complexity: buildComplexity("grape"),
  },
  krotov: {
    id: "krotov",
    title: "Krotov",
    subtitle: "Monotonic Functional Optimization",
    theory:
      "Krotov updates controls using forward and backward propagated states to guarantee monotonic objective improvement under suitable conditions. It is attractive when strict convergence behavior matters.",
    code: `def run_krotov(problem, config=KrotovConfig()):\n    pulses = initial_pulses(len(problem.controls), problem.horizon, scale=0.02)\n    for _ in range(config.steps):\n        grad = grad_fn(pulses)\n        pulses = pulses - config.step_size * grad\n    return result`,
    example:
      "In state-to-state transfer, Krotov-style updates can reduce oscillatory optimization trajectories and produce more predictable convergence than naive gradient descent.",
    complexity: buildComplexity("krotov"),
  },
  pontryagin: {
    id: "pontryagin",
    title: "Pontryagin",
    subtitle: "Maximum Principle Guided Updates",
    theory:
      "Pontryagin's Maximum Principle frames control updates through a Hamiltonian maximization condition with co-state dynamics. In discretized form, it yields principled gradient-like updates with physics-informed structure.",
    code: `def run_pontryagin(problem, config=PontryaginConfig()):\n    velocity = 0\n    for _ in range(config.steps):\n        grad = grad_fn(pulses)\n        velocity = config.momentum * velocity + (1 - config.momentum) * grad\n        pulses = pulses - config.alpha * velocity\n    return result`,
    example:
      "For constrained pulse shaping, the Pontryagin-inspired momentum step improves robustness against local noise in gradient estimates.",
    complexity: buildComplexity("pontryagin"),
  },
  shortcuts: {
    id: "shortcuts",
    title: "STA",
    subtitle: "Shortcuts to Adiabaticity",
    theory:
      "STA designs non-adiabatic control fields that mimic slow adiabatic outcomes in shorter time. Optimization can include smoothness and bounded-power terms to produce physically realizable pulses.",
    code: `def run_shortcuts_to_adiabaticity(problem, config=STAConfig()):\n    for _ in range(config.steps):\n        grad = grad_fn(current)\n        current = current - config.learning_rate * grad\n    return result`,
    example:
      "For time-critical transfer, STA-inspired objectives trade minimal infidelity against pulse smoothness and can reduce runtime significantly.",
    complexity: buildComplexity("shortcuts"),
  },
};

export const METHOD_ORDER: MethodId[] = [
  "grape",
  "krotov",
  "pontryagin",
  "shortcuts",
];

export const isMethodId = (value: string): value is MethodId =>
  value in METHODS;
