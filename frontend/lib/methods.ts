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

const exampleLabs: Record<MethodId, MethodContent["exampleLab"]> = {
  grape: {
    title: "Pulse Tuning Sandbox",
    description:
      "Try different pulse horizon, power, and hardware noise values to see how direct-learning GRAPE responds.",
    controls: [
      { key: "horizon", label: "Pulse Horizon", min: 40, max: 180, step: 5, defaultValue: 80, unit: "steps" },
      { key: "power", label: "Control Power", min: 0.4, max: 1.8, step: 0.05, defaultValue: 1, unit: "x" },
      { key: "noise", label: "Hardware Noise", min: 0, max: 0.25, step: 0.01, defaultValue: 0.06 },
    ],
    baseline: { fidelity: 0.93, iterations: 120, energy: 0.74 },
    sensitivity: {
      horizon: { fidelity: 0.18, iterations: -52, energy: 0.14 },
      power: { fidelity: 0.12, iterations: -36, energy: 0.42 },
      noise: { fidelity: -0.58, iterations: 80, energy: 0.08 },
    },
  },
  krotov: {
    title: "Smooth Policy Tuning",
    description:
      "Krotov-style settings prioritize stable improvements. Slide controls to compare smoothness vs speed.",
    controls: [
      { key: "horizon", label: "Pulse Horizon", min: 50, max: 210, step: 5, defaultValue: 95, unit: "steps" },
      { key: "power", label: "Control Power", min: 0.35, max: 1.5, step: 0.05, defaultValue: 0.85, unit: "x" },
      { key: "noise", label: "Hardware Noise", min: 0, max: 0.25, step: 0.01, defaultValue: 0.05 },
    ],
    baseline: { fidelity: 0.915, iterations: 135, energy: 0.62 },
    sensitivity: {
      horizon: { fidelity: 0.22, iterations: -48, energy: 0.1 },
      power: { fidelity: 0.08, iterations: -24, energy: 0.34 },
      noise: { fidelity: -0.5, iterations: 66, energy: 0.05 },
    },
  },
  pontryagin: {
    title: "Baseline-Guided Control Lab",
    description:
      "This variant uses stronger baseline guidance. Explore how it stabilizes outcomes under harder conditions.",
    controls: [
      { key: "horizon", label: "Pulse Horizon", min: 45, max: 190, step: 5, defaultValue: 90, unit: "steps" },
      { key: "power", label: "Control Power", min: 0.35, max: 1.65, step: 0.05, defaultValue: 0.95, unit: "x" },
      { key: "noise", label: "Hardware Noise", min: 0, max: 0.25, step: 0.01, defaultValue: 0.07 },
    ],
    baseline: { fidelity: 0.924, iterations: 128, energy: 0.69 },
    sensitivity: {
      horizon: { fidelity: 0.2, iterations: -50, energy: 0.12 },
      power: { fidelity: 0.1, iterations: -28, energy: 0.35 },
      noise: { fidelity: -0.43, iterations: 54, energy: 0.03 },
    },
  },
  shortcuts: {
    title: "Low-Power Shortcut Simulator",
    description:
      "STA favors gentle controls. Tune parameters to see how low-power pulses trade speed for robustness.",
    controls: [
      { key: "horizon", label: "Pulse Horizon", min: 35, max: 180, step: 5, defaultValue: 85, unit: "steps" },
      { key: "power", label: "Control Power", min: 0.2, max: 1.4, step: 0.05, defaultValue: 0.7, unit: "x" },
      { key: "noise", label: "Hardware Noise", min: 0, max: 0.25, step: 0.01, defaultValue: 0.05 },
    ],
    baseline: { fidelity: 0.9, iterations: 110, energy: 0.48 },
    sensitivity: {
      horizon: { fidelity: 0.26, iterations: -40, energy: 0.08 },
      power: { fidelity: 0.07, iterations: -20, energy: 0.3 },
      noise: { fidelity: -0.35, iterations: 45, energy: 0.02 },
    },
  },
};

export const METHODS: Record<MethodId, MethodContent> = {
  grape: {
    id: "grape",
    title: "GRAPE",
    subtitle: "Policy Gradient RL with Direct Amplitude Learning",
    theory:
      "GRAPE uses a Policy Gradient RL agent that learns direct control amplitudes at each time step. The agent explores the control landscape via REINFORCE, receiving fidelity-based rewards. This RL approach automatically discovers optimal pulse sequences while maintaining exploration through entropy regularization.",
    code: `from backend.rl.agent import PolicyGradientAgent, PolicyGradientConfig\nfrom backend.rl.core import RLEnvironment\n\nenv = RLEnvironment(drift, controls, target, dt, horizon)\nconfig = PolicyGradientConfig(episodes=150, learning_rate=0.02, policy_scale=0.08)\nagent = PolicyGradientAgent(env, config)\nresult = agent.train()  # Returns fidelity_history`,
    example:
      "Applied to a 1-qubit Hadamard gate, the RL agent learns smooth pulse amplitudes over 150 episodes, achieving high fidelity through reward maximization.",
    exampleLab: exampleLabs.grape,
    complexity: buildComplexity("grape"),
  },
  krotov: {
    id: "krotov",
    title: "Krotov",
    subtitle: "Policy Gradient RL with Smooth Regularization",
    theory:
      "Krotov employs the same Policy Gradient RL framework but with enhanced smoothness regularization. The agent learns smoother control policies through higher entropy regularization (0.02) and reduced policy scale, mimicking Krotov's monotonic improvement philosophy.",
    code: `from backend.rl.agent import PolicyGradientAgent, PolicyGradientConfig\n\nconfig = PolicyGradientConfig(\n    episodes=120, learning_rate=0.015, entropy_coef=0.02, policy_scale=0.05\n)\nagent = PolicyGradientAgent(env, config)\nresult = agent.train()  # Smoother pulses`,
    example:
      "In state-to-state transfer, Krotov's RL variant achieves monotonic reward improvement by penalizing erratic changes in control policies, reducing oscillatory behavior.",
    exampleLab: exampleLabs.krotov,
    complexity: buildComplexity("krotov"),
  },
  pontryagin: {
    id: "pontryagin",
    title: "Pontryagin",
    subtitle: "Policy Gradient RL with Costate-Inspired Baseline",
    theory:
      "Pontryagin adapts the Policy Gradient RL agent using a higher baseline weight (0.55), emulating costate dynamics. The baseline predicts expected rewards, enabling more principled policy updates that align with the Maximum Principle's structure.",
    code: `from backend.rl.agent import PolicyGradientAgent, PolicyGradientConfig\n\nconfig = PolicyGradientConfig(\n    episodes=140, learning_rate=0.018, baseline_weight=0.55\n)\nagent = PolicyGradientAgent(env, config)\nresult = agent.train()  # Costate-informed baseline`,
    example:
      "For constrained pulse shaping, the Pontryagin RL approach improves robustness by using a stronger baseline, reducing variance in policy gradient estimates.",
    exampleLab: exampleLabs.pontryagin,
    complexity: buildComplexity("pontryagin"),
  },
  shortcuts: {
    id: "shortcuts",
    title: "STA",
    subtitle: "Policy Gradient RL with Adiabatic-Inspired Smoothness",
    theory:
      "STA uses Policy Gradient RL with the strongest smoothness constraints. Very low policy scale (0.03) and high entropy regularization (0.03) encourage the agent to learn minimal-power pulses that mimic adiabatic shortcuts.",
    code: `from backend.rl.agent import PolicyGradientAgent, PolicyGradientConfig\n\nconfig = PolicyGradientConfig(\n    episodes=110, learning_rate=0.012, entropy_coef=0.03, policy_scale=0.03\n)\nagent = PolicyGradientAgent(env, config)\nresult = agent.train()  # Minimal-power pulses`,
    example:
      "For time-critical transfer, STA's RL variant trades peak infidelity for smoother, lower-power pulses that are physically more realizable.",
    exampleLab: exampleLabs.shortcuts,
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
