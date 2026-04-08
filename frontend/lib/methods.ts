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
    subtitle: "Policy Gradient RL with Direct Amplitude Learning",
    theory:
      "GRAPE uses a Policy Gradient RL agent that learns direct control amplitudes at each time step. The agent explores the control landscape via REINFORCE, receiving fidelity-based rewards. This RL approach automatically discovers optimal pulse sequences while maintaining exploration through entropy regularization.",
    code: `from backend.rl.agent import PolicyGradientAgent, PolicyGradientConfig\nfrom backend.rl.core import RLEnvironment\n\nenv = RLEnvironment(drift, controls, target, dt, horizon)\nconfig = PolicyGradientConfig(episodes=150, learning_rate=0.02, policy_scale=0.08)\nagent = PolicyGradientAgent(env, config)\nresult = agent.train()  # Returns fidelity_history`,
    example:
      "Applied to a 1-qubit Hadamard gate, the RL agent learns smooth pulse amplitudes over 150 episodes, achieving high fidelity through reward maximization.",
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
