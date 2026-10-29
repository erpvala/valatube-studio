export type Scene = { id: string; title: string; description: string; narration: string; visual: string; shot: string; duration: number; asset: number };
export const SCENES: Scene[] = [
  { id: "s1", title: "Cold open", description: "Stack of laptops on desk", narration: "You're probably about to overspend…", visual: "Slow push-in, red rim light", shot: "Close-up", duration: 6, asset: 0 },
  { id: "s2", title: "Intro", description: "Host to camera", narration: "I tested 23 laptops this year…", visual: "Two-camera setup", shot: "Medium", duration: 18, asset: 0 },
  { id: "s3", title: "Processor", description: "Spec graphic overlay", narration: "Processor: what the numbers mean.", visual: "Animated chart", shot: "Screen capture", duration: 95, asset: 3 },
  { id: "s4", title: "Battery test", description: "Timelapse of battery drain", narration: "How to read real-world numbers.", visual: "Timelapse", shot: "Wide", duration: 70, asset: 0 },
  { id: "s5", title: "Outro & CTA", description: "Host with checklist", narration: "Grab the free checklist…", visual: "End screen layout", shot: "Medium", duration: 20, asset: 0 },
];
