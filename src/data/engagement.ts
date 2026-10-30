/** Fictional audience comments for the Engagement page (Phase 01 demo). */
export type Sentiment = "positive" | "neutral" | "negative" | "question";
export type Comment = {
  id: string; author: string; text: string; videoId: string; channelId: string;
  sentiment: Sentiment; likes: number; time: string; status: "open" | "replied" | "hidden";
  pinned: boolean; replies: { by: string; text: string }[];
};

export const comments: Comment[] = [
  { id: "cm1", author: "Ravi_Builds", text: "Which earbuds would you pick for running? The sweat test was super helpful.", videoId: "v1", channelId: "ch-tech", sentiment: "question", likes: 214, time: "2h ago", status: "open", pinned: false, replies: [] },
  { id: "cm2", author: "Lena M.", text: "Finally an honest review. Subscribed!", videoId: "v1", channelId: "ch-tech", sentiment: "positive", likes: 98, time: "3h ago", status: "replied", pinned: true, replies: [{ by: "Circuit Bay", text: "Welcome aboard, Lena!" }] },
  { id: "cm3", author: "techskeptic", text: "Audio was out of sync around 6:40.", videoId: "v2", channelId: "ch-tech", sentiment: "negative", likes: 41, time: "5h ago", status: "open", pinned: false, replies: [] },
  { id: "cm4", author: "HomeCook22", text: "Made the salmon bowls tonight — family loved it!", videoId: "v5", channelId: "ch-food", sentiment: "positive", likes: 156, time: "1h ago", status: "open", pinned: false, replies: [] },
  { id: "cm5", author: "Priyanka", text: "Can I swap salmon for tofu? Same cooking time?", videoId: "v5", channelId: "ch-food", sentiment: "question", likes: 63, time: "4h ago", status: "open", pinned: false, replies: [] },
  { id: "cm6", author: "J. Ortiz", text: "Music is a bit loud over the voice.", videoId: "v6", channelId: "ch-food", sentiment: "negative", likes: 22, time: "1d ago", status: "replied", pinned: false, replies: [{ by: "Green Pan Kitchen", text: "Thanks — we'll mix it lower next time." }] },
  { id: "cm7", author: "trailgoat", text: "That sunrise shot is unreal. What camera?", videoId: "v9", channelId: "ch-travel", sentiment: "question", likes: 301, time: "6h ago", status: "open", pinned: false, replies: [] },
  { id: "cm8", author: "wanderlou", text: "Packed using your list — worked perfectly.", videoId: "v10", channelId: "ch-travel", sentiment: "positive", likes: 77, time: "1d ago", status: "open", pinned: false, replies: [] },
  { id: "cm9", author: "SpamBot3000", text: "Free crypto here >>> link", videoId: "v12", channelId: "ch-money", sentiment: "negative", likes: 0, time: "2d ago", status: "hidden", pinned: false, replies: [] },
  { id: "cm10", author: "Noor A.", text: "Clearest index fund explanation I've watched.", videoId: "v12", channelId: "ch-money", sentiment: "positive", likes: 189, time: "8h ago", status: "open", pinned: false, replies: [] },
  { id: "cm11", author: "budgetbeth", text: "Is this still true if I'm self-employed?", videoId: "v13", channelId: "ch-money", sentiment: "question", likes: 54, time: "9h ago", status: "open", pinned: false, replies: [] },
  { id: "cm12", author: "mk_dev", text: "Okay video, nothing new though.", videoId: "v2", channelId: "ch-tech", sentiment: "neutral", likes: 8, time: "1d ago", status: "open", pinned: false, replies: [] },
];

export const savedReplies = [
  "Thanks so much for watching!",
  "Great question — we'll cover this in an upcoming video.",
  "Thanks for flagging this, we'll fix it in the next upload.",
  "Glad it helped! Share it with a friend who needs it.",
];
