const CONFIG = window.CHAT_CONFIG || {};

const YOUTUBE_BADGE_ICONS = {
  owner: "icons/badges/youtube-broadcaster.svg",
  moderator: "icons/badges/youtube-moderator.svg",
  member: "icons/badges/youtube-member.svg",
  verified: "icons/badges/youtube-verified.svg"
};

const DEFAULT_CONFIG = window.CHAT_DEFAULT_CONFIG || {};

let cfg;
let SB_WS;
let TIKFINITY_WS;
let maxMessages;

const chat = document.getElementById("chat");
const connectionToasts = new Map();
const avatarCache = new Map();
const thirdPartyEmotes = new Map();
const messageIndex = new Map();

const tiktokUserMessageIndex = new Map();

const recentTwitchEmoteDetails = new Map();
let scrollTestTimer = null;
let scrollTestStopped = false;
let autoScrollPaused = false;
let autoScrollResumeButton = null;
let autoScrollIgnoreUntil = 0;

const platformLogos = {
  kofi: "icons/platforms/kofi.png",
  streamelements: "icons/platforms/streamelements.png",
  streamlabs: "icons/platforms/streamlabs.png",
  patreon: "icons/platforms/patreon.png",
  fourthwall: "icons/platforms/fourthwall.png",
  donordrive: "icons/platforms/donordrive.png",
  tipeeestream: "icons/platforms/tipeee.png"
};

const ALERT_GROUP_TYPES = {
  twitch: [
    "announcements",
    "channelPointRedemptions",
    "cheers",
    "follows",
    "subs",
    "giftSubs",
    "raids",
    "watchStreaks",
    "upgrades",
    "hype",
    "hypeTrain",
    "charity",
    "goals",
    "polls",
    "predictions",
    "sharedChat",
    "shoutouts",
    "stream",
    "moderation",
    "system"
  ],
  youtube: [
    "superChats",
    "superStickers",
    "members",
    "gifts",
    "polls",
    "stream",
    "moderation",
    "system"
  ],
  tiktok: [
    "follows",
    "subscribers",
    "gifts",
    "likes",
    "treasureBoxes",
    "shares",
    "joins",
    "questions",
    "goals",
    "polls",
    "battles",
    "stream",
    "system"
  ],
  kick: [
    "follows",
    "subs",
    "giftSubs",
    "rewardRedemptions",
    "stream",
    "moderation",
    "system"
  ]
};

const STYLE_TYPE_GROUPS = {
  twitch: [
    "chat",
    "announcements",
    "announcementsDefault",
    "announcementsBlue",
    "announcementsGreen",
    "announcementsOrange",
    "announcementsPurple",
    "announcementsPrimary",
    "channelPointRedemptions",
    "cheers",
    "follows",
    "subs",
    "giftSubs",
    "raids",
    "watchStreaks",
    "upgrades",
    "hype",
    "hypeTrain",
    "charity",
    "goals",
    "polls",
    "predictions",
    "sharedChat",
    "shoutouts",
    "stream",
    "moderation",
    "system"
  ],
  youtube: ["chat", "superChats", "superStickers", "members", "gifts", "polls", "stream", "moderation", "system"],
  tiktok: ["chat", "follows", "subscribers", "gifts", "likes", "treasureBoxes", "shares", "joins", "questions", "goals", "polls", "battles", "stream", "system"],
  kick: ["chat", "follows", "subs", "giftSubs", "rewardRedemptions", "stream", "moderation", "system"],
  special: ["rainbow"],
  donations: ["streamlabs", "streamelements", "kofi", "tipeeestream", "fourthwall", "patreon", "donordrive"]
};

const STYLE_TYPE_DEFAULT_COLORS = {
  twitch: {
    chat: "#9146ff",
    announcements: "#9146ff",
    announcementsDefault: "#787884",
    announcementsBlue: "#03d3d7",
    announcementsGreen: "#01da86",
    announcementsOrange: "#feb419",
    announcementsPurple: "#8D05C3",
    announcementsPrimary: "#9146ff",
    channelPointRedemptions: "#9146ff",
    cheers: "#9146ff",
    follows: "#9146ff",
    subs: "#9146ff",
    giftSubs: "#9146ff",
    raids: "#9146ff",
    watchStreaks: "#9146ff",
    upgrades: "#9146ff",
    hype: "#9146ff",
    hypeTrain: "#9146ff",
    charity: "#9146ff",
    goals: "#9146ff",
    polls: "#9146ff",
    predictions: "#9146ff",
    sharedChat: "#9146ff",
    shoutouts: "#9146ff",
    stream: "#9146ff",
    moderation: "#9146ff",
    system: "#9146ff"
  },
  special: {
    rainbow: "#ff00d4"
  },
  youtube: {
    chat: "#ff0033",
    superChats: "#ff0033",
    superStickers: "#ff0033",
    members: "#ff0033",
    gifts: "#ff0033",
    polls: "#ff0033",
    stream: "#ff0033",
    moderation: "#ff0033",
    system: "#ff0033"
  },
  tiktok: {
    chat: "#25f4ee",
    follows: "#25f4ee",
    subscribers: "#25f4ee",
    gifts: "#25f4ee",
    likes: "#25f4ee",
    treasureBoxes: "#25f4ee",
    shares: "#25f4ee",
    joins: "#25f4ee",
    questions: "#25f4ee",
    goals: "#25f4ee",
    polls: "#25f4ee",
    battles: "#25f4ee",
    stream: "#25f4ee",
    system: "#25f4ee"
  },
  kick: {
    chat: "#53fc18",
    follows: "#53fc18",
    subs: "#53fc18",
    giftSubs: "#53fc18",
    rewardRedemptions: "#53fc18",
    stream: "#53fc18",
    moderation: "#53fc18",
    system: "#53fc18"
  },
  donations: {
    streamlabs: "#80f5d2",
    streamelements: "#00d9ff",
    kofi: "#ff6b4a",
    tipeeestream: "#f5a623",
    fourthwall: "#9ca3af",
    patreon: "#ff424d",
    donordrive: "#4da3ff"
  }
};

const STYLE_TYPE_DEFAULT_TITLE_COLORS = {
  twitch: {
    titleBgColor: "#8D05C3",
    titleBgColor2: "#5524AA",
    titleIconBgColor: "#4928a5",
    titleIconBgColor2: "#32157a"
  },
  youtube: {
    titleBgColor: "#ff3048",
    titleBgColor2: "#5e0815",
    titleIconBgColor: "#7d1127",
    titleIconBgColor2: "#2d0811"
  },
  tiktok: {
    titleBgColor: "#0AEAEF",
    titleBgColor2: "#04ADA7",
    titleIconBgColor: "#1A656D",
    titleIconBgColor2: "#13252d"
  },
  kick: {
    titleBgColor: "#53fc18",
    titleBgColor2: "#2fc80f",
    titleIconBgColor: "#1fa20a",
    titleIconBgColor2: "#0f3d10"
  }
};

const TYPE_GRADIENT_SUFFIXES = ["", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

const DEFAULT_TYPE_STYLE = {
  // Compatibility fields: these first-stop colour/opacity keys also preserve older saved configs.
  avatarGlowColor: "",
  avatarGlowOpacity: 0.72,
  avatarBorderColor: "",
  avatarBorderOpacity: 0.94,
  titleGlowColor: "",
  titleGlowOpacity: 0.2,
  titleBorderColor: "",
  titleBorderOpacity: 0.88,
  titleBgColor: "",
  titleBgColor2: "",
  titleBgColor3: "",
  titleBgColor4: "",
  titleBgAngle: 135,
  titleBgColorStop: 0,
  titleBgColor2Stop: 100,
  titleBgColor3Stop: 100,
  titleBgColor4Stop: 100,
  titleBgOpacity: 0.88,
  titleIconBgColor: "",
  titleIconBgColor2: "",
  titleIconBgColor3: "",
  titleIconBgColor4: "",
  titleIconBgAngle: 180,
  titleIconBgColorStop: 0,
  titleIconBgColor2Stop: 100,
  titleIconBgColor3Stop: 100,
  titleIconBgColor4Stop: 100,
  messageGlowColor: "",
  messageGlowOpacity: 0.2,
  messageBorderColor: "",
  messageBorderOpacity: 0.88,
  messageBgColor: "",
  messageBgColor2: "",
  messageBgColor3: "",
  messageBgColor4: "",
  messageBgAngle: 135,
  messageBgColorStop: 0,
  messageBgColor2Stop: 36,
  messageBgColor3Stop: 78,
  messageBgColor4Stop: 100,
  messageBgOpacity: 0.13,
  alertGlowColor: "",
  alertGlowOpacity: 0.2,
  alertBorderColor: "",
  alertBorderOpacity: 0.78,
  alertBgColor: "",
  alertBgColor2: "",
  alertBgColor3: "",
  alertBgColor4: "",
  alertBgAngle: 135,
  alertBgColorStop: 0,
  alertBgColor2Stop: 100,
  alertBgColor3Stop: 100,
  alertBgColor4Stop: 100,
  alertBgOpacity: 0.92,
  giftGlowColor: "",
  giftGlowOpacity: 0.2,
  giftBorderColor: "",
  giftBorderOpacity: 0.88,
  giftBgColor: "",
  giftBgColor2: "",
  giftBgColor3: "",
  giftBgColor4: "",
  giftBgAngle: 135,
  giftBgColorStop: 0,
  giftBgColor2Stop: 35,
  giftBgColor3Stop: 78,
  giftBgColor4Stop: 100,
  giftBgOpacity: 0.13
};

const TYPE_GRADIENT_PREFIXES = [
  "avatarGlow",
  "avatarBorder",
  "titleGlow",
  "titleBorder",
  "titleBg",
  "titleIconBg",
  "messageGlow",
  "messageBorder",
  "messageBg",
  "alertGlow",
  "alertBorder",
  "alertBg",
  "giftGlow",
  "giftBorder",
  "giftBg"
];

const TYPE_BORDER_PREFIXES = [
  "avatarBorder",
  "titleBorder",
  "messageBorder",
  "alertBorder",
  "giftBorder"
];

const TYPE_GLOW_PREFIXES = [
  "avatarGlow",
  "titleGlow",
  "messageGlow",
  "alertGlow",
  "giftGlow"
];

TYPE_GRADIENT_PREFIXES.forEach(prefix => {
  DEFAULT_TYPE_STYLE[`${prefix}Mode`] = "linear";
  if (TYPE_BORDER_PREFIXES.includes(prefix) || TYPE_GLOW_PREFIXES.includes(prefix)) {
    DEFAULT_TYPE_STYLE[`${prefix}Enabled`] = true;
  }

  TYPE_GRADIENT_SUFFIXES.forEach((suffix, index) => {
    if (index >= 4) {
      DEFAULT_TYPE_STYLE[`${prefix}Color${suffix}`] = "";
      DEFAULT_TYPE_STYLE[`${prefix}Color${suffix}Stop`] = 100;
    }

    DEFAULT_TYPE_STYLE[`${prefix}Color${suffix}Alpha`] = "";
  });
});

Object.assign(DEFAULT_TYPE_STYLE, {
  messageBgMode: "radial",
  messageBgColor2: "#10121e",
  messageBgColor3: "#06060c",
  messageBgColor4: "#08080f",
  messageBgColorAlpha: 0.13,
  messageBgColor2Alpha: 0.98,
  messageBgColor3Alpha: 1,
  messageBgColor4Alpha: 1,
  messageBgOpacity: 1
});

const DEFAULT_STYLE_PRESET = {
  fontFamily: "'Sora', sans-serif",
  accentFontFamily: "'Sora', sans-serif",
  messageFontFamily: "'Sora', sans-serif",
  titleFontSize: 12,
  messageFontSize: 17,
  titleLineHeight: 1.05,
  messageLineHeight: 1.28,
  emoteOnlyFontSize: 30,
  gigantifiedFontSize: 44,
  messageTextColor: "#ffffff",
  titleTextColor: "#ffffff",
  accentColor: "#9146ff",
  useCustomAccentColor: false,
  colors: {
    twitch: {
      chat: "#9146ff",
      announcements: "#9146ff",
      channelPointRedemptions: "#9146ff",
      cheers: "#9146ff",
      follows: "#9146ff",
      subs: "#9146ff",
      giftSubs: "#9146ff",
      raids: "#9146ff",
      watchStreaks: "#9146ff",
      upgrades: "#9146ff",
      hype: "#9146ff",
      hypeTrain: "#9146ff",
      charity: "#9146ff",
      goals: "#9146ff",
      polls: "#9146ff",
      predictions: "#9146ff",
      sharedChat: "#9146ff",
      shoutouts: "#9146ff",
      stream: "#9146ff",
      moderation: "#9146ff",
      system: "#9146ff"
    },
    youtube: {
      chat: "#ff0033",
      superChats: "#ff0033",
      superStickers: "#ff0033",
      members: "#ff0033",
      gifts: "#ff0033",
      polls: "#ff0033",
      stream: "#ff0033",
      moderation: "#ff0033",
      system: "#ff0033"
    },
    tiktok: {
      chat: "#25f4ee",
      follows: "#25f4ee",
      subscribers: "#25f4ee",
      gifts: "#25f4ee",
      likes: "#25f4ee",
      treasureBoxes: "#25f4ee",
      shares: "#25f4ee",
      joins: "#25f4ee",
      questions: "#25f4ee",
      goals: "#25f4ee",
      polls: "#25f4ee",
      battles: "#25f4ee",
      stream: "#25f4ee",
      system: "#25f4ee"
    },
    kick: {
      chat: "#53fc18",
      follows: "#53fc18",
      subs: "#53fc18",
      giftSubs: "#53fc18",
      rewardRedemptions: "#53fc18",
      stream: "#53fc18",
      moderation: "#53fc18",
      system: "#53fc18"
    },
    donations: {
      streamlabs: "#80f5d2",
      streamelements: "#00d9ff",
      kofi: "#ff6b4a",
      tipeeestream: "#f5a623",
      fourthwall: "#9ca3af",
      patreon: "#ff424d",
      donordrive: "#4da3ff"
    },
    special: {
      rainbow: "#ff00d4"
    },
    text: {
      twitchName: "#ffe45f",
      youtubeName: "#ffd6dc",
      tiktokName: "#061114",
      kickName: "#ecffe8",
      muted: "#d6d6e0",
      dark: "#061114",
      stealth: "#ffffff"
    },
    surfaces: {
      pageBackground: "#000000",
      bubbleBase: "#050510",
      bubbleHighlight: "#ffffff",
      mediaBackground: "#000000",
      linkPreviewText: "#ffffff",
      linkPreviewMeta: "#d6d6e0",
      badgeBackground: "#000000",
      avatarBorder: "#ffffff",
      avatarFill: "#ffffff"
    },
    effects: {
      shadow: "#000000",
      emoteSparkle: "#ffffff",
      gigantifiedSparkle: "#ffd65a",
      highlightGlow: "#ff00c8",
      highlightWarmGlow: "#ffb400",
      tiktokRed: "#fe2c55",
      tiktokBlue: "#25f4ee"
    },
    rainbow: {
      one: "#ff004c",
      two: "#ff8a00",
      three: "#fff700",
      four: "#00ff85",
      five: "#00c8ff",
      six: "#7a5cff",
      seven: "#ff00d4"
    }
  },
  typeStyles: buildDefaultTypeStyles(DEFAULT_CONFIG.style),
  bubbleShape: "rounded",
  bubbleLayout: "stacked",
  nameTagOffsetX: 10,
  nameTagOverlapY: 8,
  overlappedMessageTopPadding: 17,
  overlappedCardShadow: true,
  overlappedRandomTilt: false,
  overlappedTiltAmount: 3,
  bubbleRadius: 21,
  nameBubbleRadius: 20,
  bubbleSlant: 26,
  bubbleNotch: 23,
  nameIconPosition: "right",
  nameIconEdgeOverlap: 16,
  nameIconEdgeRadius: 19,
  useTwitchChatNameColor: false,
  borderGlow: true,
  stealthMode: false,
  showNameBackgrounds: true,
  showMessageBackgrounds: true,
  showAlertBackgrounds: true,
  showGiftBackgrounds: true,
  showMediaBackgrounds: true,
  showPageBackground: false,
  showAvatarGlow: true,
  showEmoteGlow: true,
  showColoredText: true,
  minimal: {
    nameBackgrounds: false,
    messageBackgrounds: false,
    alertBackgrounds: true,
    giftBackgrounds: true,
    glow: false,
    shine: false,
    animations: true
  },
  minimalStyle: false
};

const MESSAGE_THEME_PRESETS = {
  "theme-neon": {
    style: {
      fontFamily: "'Exo 2', sans-serif",
      accentFontFamily: "'Orbitron', sans-serif",
      messageFontFamily: "'Exo 2', sans-serif",
      accentColor: "#00f5ff",
      messageTextColor: "#ffffff",
      titleTextColor: "#ffffff",
      colors: {
        twitch: { chat: "#a855f7", announcements: "#c084fc", channelPointRedemptions: "#f472b6", cheers: "#22d3ee", follows: "#38bdf8", subs: "#facc15", giftSubs: "#fb7185", raids: "#34d399" },
        youtube: { chat: "#ff2d55", superChats: "#ff8a00", superStickers: "#ff477e", members: "#facc15" },
        tiktok: { chat: "#25f4ee", follows: "#25f4ee", subscribers: "#fe2c55", gifts: "#facc15", likes: "#ff4fd8", treasureBoxes: "#38bdf8" },
        kick: { chat: "#53fc18", follows: "#86efac", subs: "#bef264", giftSubs: "#22c55e", rewardRedemptions: "#a3e635" },
        surfaces: { pageBackground: "#03030a", bubbleBase: "#050511", bubbleHighlight: "#ffffff", mediaBackground: "#020207", badgeBackground: "#050511", avatarBorder: "#00f5ff", avatarFill: "#ffffff" },
        effects: { shadow: "#000000", emoteSparkle: "#00f5ff", gigantifiedSparkle: "#facc15", highlightGlow: "#ff4fd8", highlightWarmGlow: "#facc15", tiktokRed: "#fe2c55", tiktokBlue: "#25f4ee" },
        rainbow: { one: "#ff2d55", two: "#ff8a00", three: "#facc15", four: "#53fc18", five: "#25f4ee", six: "#8b5cf6", seven: "#ff4fd8" }
      },
      bubbleRadius: 22,
      nameBubbleRadius: 22,
      nameIconEdgeOverlap: 22,
      nameIconEdgeRadius: 8,
      titleFontSize: 12,
      messageFontSize: 18,
      borderGlow: true,
      showAvatarGlow: true,
      showEmoteGlow: true
    },
    animation: "fast",
    typeStyle: { bg: ["accent", "#150026", "#020617", "#050012"], alphas: [0.92, 0.98, 1, 1], glowOpacity: 0.52, borderOpacity: 1, secondStop: 24 }
  },
  "theme-minimal": {
    style: {
      fontFamily: "'Inter', sans-serif",
      accentFontFamily: "'Inter', sans-serif",
      messageFontFamily: "'Inter', sans-serif",
      accentColor: "#cfd3dc",
      messageTextColor: "#f5f7fb",
      titleTextColor: "#dfe4ec",
      colors: {
        twitch: { chat: "#8b919c", announcements: "#8b919c", channelPointRedemptions: "#a0a6b0", cheers: "#b4bac3", follows: "#8b919c", subs: "#c7ccd4", giftSubs: "#a0a6b0", raids: "#b4bac3" },
        youtube: { chat: "#9da3ad", superChats: "#b4bac3", superStickers: "#a0a6b0", members: "#c7ccd4" },
        tiktok: { chat: "#a7b0bd", follows: "#8b919c", subscribers: "#a0a6b0", gifts: "#c7ccd4", likes: "#b4bac3", treasureBoxes: "#9da3ad" },
        kick: { chat: "#98a09a", follows: "#8b919c", subs: "#b4bac3", giftSubs: "#a0a6b0", rewardRedemptions: "#9da3ad" },
        text: { twitchName: "#f5f7fb", youtubeName: "#f5f7fb", tiktokName: "#f5f7fb", kickName: "#f5f7fb", muted: "#9da3ad", dark: "#17191e", stealth: "#ffffff" },
        surfaces: { pageBackground: "#000000", bubbleBase: "#111317", bubbleHighlight: "#ffffff", mediaBackground: "#08090c", badgeBackground: "#111317", avatarBorder: "#dfe4ec", avatarFill: "#ffffff" },
        effects: { shadow: "#000000", emoteSparkle: "#ffffff", gigantifiedSparkle: "#dfe4ec", highlightGlow: "#cfd3dc", highlightWarmGlow: "#e5e7eb", tiktokRed: "#a0a6b0", tiktokBlue: "#b4bac3" }
      },
      bubbleRadius: 6,
      nameBubbleRadius: 6,
      nameIconEdgeOverlap: 10,
      nameIconEdgeRadius: 3,
      titleFontSize: 10,
      messageFontSize: 16,
      borderGlow: false,
      showAvatarGlow: false,
      showEmoteGlow: false,
      showColoredText: false
    },
    platformIcons: false,
    badges: false,
    avatarSize: 38,
    avatarGap: 8,
    animation: "subtle",
    typeStyle: {
      bg: ["#1a1d23", "#121419", "#0f1115", "#0f1115"],
      titleBg: ["#24272f", "#171a20", "#171a20", "#171a20"],
      alertBg: ["#1a1d23", "#121419", "#0f1115", "#0f1115"],
      giftBg: ["#1a1d23", "#121419", "#0f1115", "#0f1115"],
      alphas: [0.88, 0.94, 0.98, 0.98],
      cardAlphas: [0.92, 0.96, 0.96, 0.96],
      borderColor: "#5c6470",
      glowColor: "#000000",
      glowOpacity: 0,
      borderOpacity: 0.28,
      secondStop: 100
    }
  },
  "theme-cute": {
    style: {
      fontFamily: "'Fredoka', sans-serif",
      accentFontFamily: "'Fredoka', sans-serif",
      messageFontFamily: "'Fredoka', sans-serif",
      accentColor: "#ff7ab6",
      messageTextColor: "#fff7fb",
      titleTextColor: "#ffffff",
      colors: {
        twitch: { chat: "#c084fc", announcements: "#f0abfc", channelPointRedemptions: "#ff7ab6", cheers: "#7dd3fc", follows: "#86efac", subs: "#fde68a", giftSubs: "#f9a8d4", raids: "#c4b5fd" },
        youtube: { chat: "#fb7185", superChats: "#f9a8d4", superStickers: "#f0abfc", members: "#fde68a" },
        tiktok: { chat: "#67e8f9", follows: "#a7f3d0", subscribers: "#f9a8d4", gifts: "#fde68a", likes: "#ff7ab6", treasureBoxes: "#c4b5fd" },
        kick: { chat: "#86efac", follows: "#bbf7d0", subs: "#fde68a", giftSubs: "#a7f3d0", rewardRedemptions: "#c4b5fd" },
        text: { twitchName: "#fff7ad", youtubeName: "#ffe4ec", tiktokName: "#052f33", kickName: "#083617", muted: "#fde2ef", dark: "#24111b", stealth: "#ffffff" },
        surfaces: { pageBackground: "#130812", bubbleBase: "#22111f", bubbleHighlight: "#fff0fa", mediaBackground: "#160a15", badgeBackground: "#2a1426", avatarBorder: "#ffb3d9", avatarFill: "#fff7fb" },
        effects: { shadow: "#2b071b", emoteSparkle: "#ffb3d9", gigantifiedSparkle: "#fde68a", highlightGlow: "#ff7ab6", highlightWarmGlow: "#fde68a", tiktokRed: "#fb7185", tiktokBlue: "#67e8f9" }
      },
      bubbleRadius: 30,
      nameBubbleRadius: 30,
      nameIconEdgeOverlap: 24,
      nameIconEdgeRadius: 24,
      titleFontSize: 13,
      messageFontSize: 18
    },
    animation: "normal",
    typeStyle: { bg: ["accent", "#3a1730", "#1d0d1b", "#251126"], alphas: [0.74, 0.97, 1, 1], glowOpacity: 0.32, borderOpacity: 0.9, secondStop: 30 }
  },
  "theme-arcade": {
    style: {
      fontFamily: "'Chakra Petch', sans-serif",
      accentFontFamily: "'Black Ops One', sans-serif",
      messageFontFamily: "'Chakra Petch', sans-serif",
      accentColor: "#ffe500",
      messageTextColor: "#ffffff",
      titleTextColor: "#061114",
      colors: {
        twitch: { chat: "#8b5cf6", announcements: "#06b6d4", channelPointRedemptions: "#f97316", cheers: "#facc15", follows: "#22c55e", subs: "#ef4444", giftSubs: "#ec4899", raids: "#3b82f6" },
        youtube: { chat: "#ef4444", superChats: "#f97316", superStickers: "#ec4899", members: "#facc15" },
        tiktok: { chat: "#06b6d4", follows: "#22c55e", subscribers: "#ef4444", gifts: "#facc15", likes: "#ec4899", treasureBoxes: "#3b82f6" },
        kick: { chat: "#53fc18", follows: "#22c55e", subs: "#facc15", giftSubs: "#84cc16", rewardRedemptions: "#06b6d4" },
        surfaces: { pageBackground: "#050505", bubbleBase: "#0b0b0f", bubbleHighlight: "#ffffff", mediaBackground: "#050505", badgeBackground: "#0f0f13", avatarBorder: "#ffe500", avatarFill: "#ffffff" },
        effects: { shadow: "#000000", emoteSparkle: "#ffe500", gigantifiedSparkle: "#ffe500", highlightGlow: "#ff00a8", highlightWarmGlow: "#ffe500", tiktokRed: "#ef4444", tiktokBlue: "#06b6d4" },
        rainbow: { one: "#ef4444", two: "#f97316", three: "#ffe500", four: "#53fc18", five: "#06b6d4", six: "#3b82f6", seven: "#ec4899" }
      },
      bubbleShape: "square",
      bubbleRadius: 4,
      nameBubbleRadius: 4,
      nameIconEdgeOverlap: 6,
      nameIconEdgeRadius: 2,
      titleFontSize: 14,
      messageFontSize: 19
    },
    animation: "fast",
    typeStyle: { bg: ["accent", "#151515", "#050505", "#050505"], alphas: [0.9, 1, 1, 1], glowOpacity: 0.26, borderOpacity: 1, secondStop: 18 }
  },
  "theme-glass": {
    style: {
      fontFamily: "'Space Grotesk', sans-serif",
      accentFontFamily: "'Space Grotesk', sans-serif",
      messageFontFamily: "'Space Grotesk', sans-serif",
      accentColor: "#8bdcff",
      messageTextColor: "#f7fbff",
      titleTextColor: "#ffffff",
      colors: {
        twitch: { chat: "#b79cff", announcements: "#a5b4fc", channelPointRedemptions: "#f0abfc", cheers: "#7dd3fc", follows: "#5eead4", subs: "#fde68a", giftSubs: "#f9a8d4", raids: "#93c5fd" },
        youtube: { chat: "#ff8aa1", superChats: "#fca5a5", superStickers: "#f9a8d4", members: "#fde68a" },
        tiktok: { chat: "#67e8f9", follows: "#5eead4", subscribers: "#f9a8d4", gifts: "#fde68a", likes: "#f0abfc", treasureBoxes: "#93c5fd" },
        kick: { chat: "#86efac", follows: "#5eead4", subs: "#bbf7d0", giftSubs: "#a7f3d0", rewardRedemptions: "#67e8f9" },
        surfaces: { pageBackground: "#02070c", bubbleBase: "#07111b", bubbleHighlight: "#ffffff", mediaBackground: "#02070c", badgeBackground: "#08131f", avatarBorder: "#dff6ff", avatarFill: "#ffffff" },
        effects: { shadow: "#000000", emoteSparkle: "#dff6ff", gigantifiedSparkle: "#fde68a", highlightGlow: "#8bdcff", highlightWarmGlow: "#f9a8d4", tiktokRed: "#fb7185", tiktokBlue: "#67e8f9" }
      },
      bubbleRadius: 18,
      nameBubbleRadius: 18,
      nameIconEdgeOverlap: 20,
      nameIconEdgeRadius: 14,
      showPageBackground: false
    },
    animation: "subtle",
    typeStyle: { bg: ["#ffffff", "accent", "#071421", "#04101b"], alphas: [0.24, 0.3, 0.72, 0.78], glowOpacity: 0.2, borderOpacity: 0.72, secondStop: 18 }
  },
  "theme-paper": {
    style: {
      fontFamily: "'Playfair Display', serif",
      accentFontFamily: "'Cinzel', serif",
      messageFontFamily: "'Playfair Display', serif",
      accentColor: "#8f5d3d",
      messageTextColor: "#2d2118",
      titleTextColor: "#fff7e8",
      colors: {
        twitch: { chat: "#7b4d2e", announcements: "#6f6552", channelPointRedemptions: "#9f5f4a", cheers: "#b2803d", follows: "#65734a", subs: "#b2803d", giftSubs: "#9f5f4a", raids: "#5f6d7a" },
        youtube: { chat: "#9f4f45", superChats: "#b2803d", superStickers: "#9f5f4a", members: "#a98b48" },
        tiktok: { chat: "#527a7c", follows: "#65734a", subscribers: "#9f4f45", gifts: "#b2803d", likes: "#9f5f4a", treasureBoxes: "#5f6d7a" },
        kick: { chat: "#647a43", follows: "#65734a", subs: "#8a8644", giftSubs: "#647a43", rewardRedemptions: "#527a7c" },
        text: { twitchName: "#fff7e8", youtubeName: "#fff7e8", tiktokName: "#fff7e8", kickName: "#fff7e8", muted: "#7c6d5c", dark: "#2d2118", stealth: "#ffffff" },
        surfaces: { pageBackground: "#efe4cc", bubbleBase: "#f5ecd8", bubbleHighlight: "#fffaf0", mediaBackground: "#dfd0b5", badgeBackground: "#d9c7a7", avatarBorder: "#f8edd6", avatarFill: "#fff7e8" },
        effects: { shadow: "#3a2a1c", emoteSparkle: "#c79a4b", gigantifiedSparkle: "#b2803d", highlightGlow: "#a96f4b", highlightWarmGlow: "#b2803d", tiktokRed: "#9f4f45", tiktokBlue: "#527a7c" }
      },
      bubbleRadius: 3,
      nameBubbleRadius: 3,
      nameIconEdgeOverlap: 8,
      nameIconEdgeRadius: 2,
      titleFontSize: 12,
      messageFontSize: 18,
      borderGlow: false,
      showAvatarGlow: false,
      showEmoteGlow: false
    },
    avatarSize: 48,
    animation: "subtle",
    typeStyle: {
      bg: ["#fff8e6", "#f1e2c7", "#e7d3ad", "#e7d3ad"],
      titleBg: ["#8f5d3d", "#62402b", "#62402b", "#62402b"],
      titleIconBg: ["#3f3124", "#2d2118", "#2d2118", "#2d2118"],
      alertBg: ["#fff8e6", "#f1e2c7", "#e7d3ad", "#e7d3ad"],
      giftBg: ["#fff8e6", "#f1e2c7", "#e7d3ad", "#e7d3ad"],
      alphas: [1, 1, 1, 1],
      cardAlphas: [1, 1, 1, 1],
      borderColor: "#8f5d3d",
      glowColor: "#5a3a25",
      glowOpacity: 0,
      borderOpacity: 0.82,
      secondStop: 100
    }
  },
  "theme-cyber": {
    style: {
      fontFamily: "'Chakra Petch', sans-serif",
      accentFontFamily: "'Orbitron', sans-serif",
      messageFontFamily: "'Chakra Petch', sans-serif",
      accentColor: "#00ff9d",
      messageTextColor: "#ecfff8",
      titleTextColor: "#03110c",
      colors: {
        twitch: { chat: "#9d4edd", announcements: "#00e5ff", channelPointRedemptions: "#ff00aa", cheers: "#00ff9d", follows: "#00ff9d", subs: "#faff00", giftSubs: "#ff3864", raids: "#00e5ff" },
        youtube: { chat: "#ff3864", superChats: "#ff7a00", superStickers: "#ff00aa", members: "#faff00" },
        tiktok: { chat: "#00e5ff", follows: "#00ff9d", subscribers: "#ff3864", gifts: "#faff00", likes: "#ff00aa", treasureBoxes: "#00e5ff" },
        kick: { chat: "#00ff40", follows: "#00ff9d", subs: "#b8ff00", giftSubs: "#00ff40", rewardRedemptions: "#00e5ff" },
        surfaces: { pageBackground: "#010806", bubbleBase: "#020d0a", bubbleHighlight: "#d8fff1", mediaBackground: "#010806", badgeBackground: "#02120d", avatarBorder: "#00ff9d", avatarFill: "#ecfff8" },
        effects: { shadow: "#000000", emoteSparkle: "#00ff9d", gigantifiedSparkle: "#faff00", highlightGlow: "#00ff9d", highlightWarmGlow: "#faff00", tiktokRed: "#ff3864", tiktokBlue: "#00e5ff" },
        rainbow: { one: "#ff3864", two: "#ff7a00", three: "#faff00", four: "#00ff9d", five: "#00e5ff", six: "#7c3cff", seven: "#ff00aa" }
      },
      bubbleShape: "notch",
      bubbleRadius: 8,
      nameBubbleRadius: 8,
      bubbleNotch: 10,
      nameIconEdgeOverlap: 18,
      nameIconEdgeRadius: 4,
      titleFontSize: 12,
      messageFontSize: 18
    },
    animation: "fast",
    typeStyle: {
      bg: ["#001b12", "#00110b", "#000705", "#000705"],
      titleBg: ["#00ff9d", "#00e5ff", "#00e5ff", "#00e5ff"],
      titleIconBg: ["#000705", "#001b12", "#001b12", "#001b12"],
      alertBg: ["#001b12", "#00110b", "#000705", "#000705"],
      giftBg: ["#001b12", "#00110b", "#000705", "#000705"],
      alphas: [1, 1, 1, 1],
      cardAlphas: [0.95, 0.95, 0.95, 0.95],
      borderColor: "#00ff9d",
      glowColor: "#00ff9d",
      glowOpacity: 0.46,
      borderOpacity: 1,
      secondStop: 42
    }
  },
  "theme-cozy": {
    style: {
      fontFamily: "'DM Sans', sans-serif",
      accentFontFamily: "'Righteous', sans-serif",
      messageFontFamily: "'DM Sans', sans-serif",
      accentColor: "#80d8c3",
      messageTextColor: "#fffdf7",
      titleTextColor: "#fffaf0",
      colors: {
        twitch: { chat: "#9b8fd3", announcements: "#7aa4c2", channelPointRedemptions: "#d895aa", cheers: "#e8c872", follows: "#80d8c3", subs: "#e8c872", giftSubs: "#d895aa", raids: "#7aa4c2" },
        youtube: { chat: "#d86f75", superChats: "#e0a05c", superStickers: "#d895aa", members: "#e8c872" },
        tiktok: { chat: "#7dd3c7", follows: "#80d8c3", subscribers: "#d895aa", gifts: "#e8c872", likes: "#d895aa", treasureBoxes: "#7aa4c2" },
        kick: { chat: "#9bd67c", follows: "#80d8c3", subs: "#c6d87c", giftSubs: "#9bd67c", rewardRedemptions: "#7dd3c7" },
        surfaces: { pageBackground: "#080b10", bubbleBase: "#111820", bubbleHighlight: "#fffaf0", mediaBackground: "#0b1016", badgeBackground: "#151d26", avatarBorder: "#fff0c2", avatarFill: "#fffaf0" },
        effects: { shadow: "#000000", emoteSparkle: "#fff0c2", gigantifiedSparkle: "#e8c872", highlightGlow: "#80d8c3", highlightWarmGlow: "#e8c872", tiktokRed: "#d86f75", tiktokBlue: "#7dd3c7" }
      },
      bubbleRadius: 20,
      nameBubbleRadius: 20,
      nameIconEdgeOverlap: 19,
      nameIconEdgeRadius: 16,
      titleFontSize: 12,
      messageFontSize: 17
    },
    animation: "normal",
    typeStyle: { bg: ["accent", "#1b2630", "#0f161d", "#111b24"], alphas: [0.36, 0.98, 1, 1], glowOpacity: 0.18, borderOpacity: 0.76, secondStop: 28 }
  },
  "theme-blueprint": {
    style: {
      fontFamily: "'Space Grotesk', sans-serif",
      accentFontFamily: "'Teko', sans-serif",
      messageFontFamily: "'Space Grotesk', sans-serif",
      accentColor: "#7dd3fc",
      messageTextColor: "#dff7ff",
      titleTextColor: "#06131f",
      colors: {
        twitch: { chat: "#7dd3fc", announcements: "#7dd3fc", channelPointRedemptions: "#7dd3fc", cheers: "#7dd3fc", follows: "#7dd3fc", subs: "#7dd3fc", giftSubs: "#7dd3fc", raids: "#7dd3fc" },
        youtube: { chat: "#7dd3fc", superChats: "#7dd3fc", superStickers: "#7dd3fc", members: "#7dd3fc" },
        tiktok: { chat: "#7dd3fc", follows: "#7dd3fc", subscribers: "#7dd3fc", gifts: "#7dd3fc", likes: "#7dd3fc", treasureBoxes: "#7dd3fc" },
        kick: { chat: "#7dd3fc", follows: "#7dd3fc", subs: "#7dd3fc", giftSubs: "#7dd3fc", rewardRedemptions: "#7dd3fc" },
        text: { twitchName: "#06131f", youtubeName: "#06131f", tiktokName: "#06131f", kickName: "#06131f", muted: "#9fd7ee", dark: "#06131f", stealth: "#dff7ff" },
        surfaces: { pageBackground: "#03101a", bubbleBase: "#061b2d", bubbleHighlight: "#dff7ff", mediaBackground: "#02101c", badgeBackground: "#0b2a45", avatarBorder: "#7dd3fc", avatarFill: "#dff7ff" },
        effects: { shadow: "#000814", emoteSparkle: "#dff7ff", gigantifiedSparkle: "#7dd3fc", highlightGlow: "#7dd3fc", highlightWarmGlow: "#e0f2fe", tiktokRed: "#7dd3fc", tiktokBlue: "#7dd3fc" }
      },
      bubbleShape: "square",
      bubbleRadius: 2,
      nameBubbleRadius: 2,
      nameIconEdgeOverlap: 4,
      nameIconEdgeRadius: 1,
      titleFontSize: 14,
      messageFontSize: 17,
      borderGlow: true
    },
    animation: "subtle",
    typeStyle: {
      bg: ["#0b2a45", "#061b2d", "#03101a", "#03101a"],
      titleBg: ["#7dd3fc", "#bae6fd", "#bae6fd", "#bae6fd"],
      titleIconBg: ["#03101a", "#0b2a45", "#0b2a45", "#0b2a45"],
      alertBg: ["#0b2a45", "#061b2d", "#03101a", "#03101a"],
      giftBg: ["#0b2a45", "#061b2d", "#03101a", "#03101a"],
      alphas: [0.88, 0.96, 1, 1],
      borderColor: "#7dd3fc",
      glowColor: "#7dd3fc",
      glowOpacity: 0.24,
      borderOpacity: 0.92,
      secondStop: 48
    }
  },
  "theme-liminal": {
    style: {
      fontFamily: "'Work Sans', sans-serif",
      accentFontFamily: "'Cinzel', serif",
      messageFontFamily: "'Work Sans', sans-serif",
      accentColor: "#d6ff6b",
      messageTextColor: "#faffdf",
      titleTextColor: "#11170a",
      colors: {
        twitch: { chat: "#d6ff6b", announcements: "#b8fff1", channelPointRedemptions: "#ff9df2", cheers: "#d6ff6b", follows: "#b8fff1", subs: "#fff3a3", giftSubs: "#ff9df2", raids: "#d6ff6b" },
        youtube: { chat: "#ff9df2", superChats: "#fff3a3", superStickers: "#ff9df2", members: "#d6ff6b" },
        tiktok: { chat: "#b8fff1", follows: "#d6ff6b", subscribers: "#ff9df2", gifts: "#fff3a3", likes: "#ff9df2", treasureBoxes: "#b8fff1" },
        kick: { chat: "#d6ff6b", follows: "#b8fff1", subs: "#fff3a3", giftSubs: "#d6ff6b", rewardRedemptions: "#ff9df2" },
        surfaces: { pageBackground: "#080914", bubbleBase: "#141826", bubbleHighlight: "#faffdf", mediaBackground: "#080914", badgeBackground: "#181d2e", avatarBorder: "#d6ff6b", avatarFill: "#faffdf" },
        effects: { shadow: "#000000", emoteSparkle: "#d6ff6b", gigantifiedSparkle: "#fff3a3", highlightGlow: "#d6ff6b", highlightWarmGlow: "#ff9df2", tiktokRed: "#ff9df2", tiktokBlue: "#b8fff1" }
      },
      bubbleShape: "rounded",
      bubbleRadius: 28,
      nameBubbleRadius: 6,
      nameIconEdgeOverlap: 28,
      nameIconEdgeRadius: 2,
      titleFontSize: 11,
      messageFontSize: 17
    },
    animation: "slow",
    typeStyle: {
      bg: ["#d6ff6b", "#20283b", "#080914", "#141826"],
      titleBg: ["#d6ff6b", "#b8fff1", "#b8fff1", "#b8fff1"],
      titleIconBg: ["#ff9df2", "#20283b", "#20283b", "#20283b"],
      alertBg: ["#ff9df2", "#20283b", "#080914", "#141826"],
      giftBg: ["#fff3a3", "#20283b", "#080914", "#141826"],
      alphas: [0.22, 0.88, 0.98, 1],
      cardAlphas: [0.92, 0.84, 0.84, 0.84],
      borderColor: "#d6ff6b",
      glowColor: "#d6ff6b",
      glowOpacity: 0.3,
      borderOpacity: 0.86,
      secondStop: 20
    }
  },
  "theme-noir": {
    style: {
      fontFamily: "'Montserrat', sans-serif",
      accentFontFamily: "'Playfair Display', serif",
      messageFontFamily: "'Montserrat', sans-serif",
      accentColor: "#f2f2e6",
      messageTextColor: "#f7f7ef",
      titleTextColor: "#050505",
      colors: {
        twitch: { chat: "#f2f2e6", announcements: "#d8d8c8", channelPointRedemptions: "#f2f2e6", cheers: "#ffffff", follows: "#d8d8c8", subs: "#ffffff", giftSubs: "#f2f2e6", raids: "#d8d8c8" },
        youtube: { chat: "#f2f2e6", superChats: "#ffffff", superStickers: "#d8d8c8", members: "#ffffff" },
        tiktok: { chat: "#f2f2e6", follows: "#d8d8c8", subscribers: "#ffffff", gifts: "#f2f2e6", likes: "#ffffff", treasureBoxes: "#d8d8c8" },
        kick: { chat: "#f2f2e6", follows: "#d8d8c8", subs: "#ffffff", giftSubs: "#f2f2e6", rewardRedemptions: "#ffffff" },
        surfaces: { pageBackground: "#050505", bubbleBase: "#090909", bubbleHighlight: "#ffffff", mediaBackground: "#050505", badgeBackground: "#111111", avatarBorder: "#f2f2e6", avatarFill: "#f7f7ef" },
        effects: { shadow: "#000000", emoteSparkle: "#ffffff", gigantifiedSparkle: "#ffffff", highlightGlow: "#f2f2e6", highlightWarmGlow: "#ffffff", tiktokRed: "#f2f2e6", tiktokBlue: "#d8d8c8" }
      },
      bubbleShape: "square",
      bubbleRadius: 2,
      nameBubbleRadius: 2,
      nameIconEdgeOverlap: 6,
      nameIconEdgeRadius: 1,
      titleFontSize: 12,
      messageFontSize: 17,
      borderGlow: false,
      showAvatarGlow: false,
      showEmoteGlow: false
    },
    animation: "subtle",
    typeStyle: {
      bg: ["#141414", "#090909", "#050505", "#050505"],
      titleBg: ["#f2f2e6", "#d8d8c8", "#d8d8c8", "#d8d8c8"],
      titleIconBg: ["#050505", "#141414", "#141414", "#141414"],
      alertBg: ["#141414", "#090909", "#050505", "#050505"],
      giftBg: ["#141414", "#090909", "#050505", "#050505"],
      alphas: [1, 1, 1, 1],
      borderColor: "#f2f2e6",
      glowColor: "#000000",
      glowOpacity: 0,
      borderOpacity: 0.82,
      secondStop: 100
    }
  },
  "theme-chromatic-void": {
    style: {
      fontFamily: "'Exo 2', sans-serif",
      accentFontFamily: "'Orbitron', sans-serif",
      messageFontFamily: "'Space Grotesk', sans-serif",
      accentColor: "#00f0ff",
      messageTextColor: "#fff7ff",
      titleTextColor: "#090014",
      colors: {
        twitch: { chat: "#00f0ff", announcements: "#ff0adf", channelPointRedemptions: "#7b2cff", cheers: "#fff200", follows: "#00ffa8", subs: "#fff200", giftSubs: "#ff0adf", raids: "#00f0ff" },
        youtube: { chat: "#ff0adf", superChats: "#fff200", superStickers: "#00f0ff", members: "#00ffa8" },
        tiktok: { chat: "#00f0ff", follows: "#00ffa8", subscribers: "#ff0adf", gifts: "#fff200", likes: "#ff0adf", treasureBoxes: "#7b2cff" },
        kick: { chat: "#00ffa8", follows: "#00f0ff", subs: "#fff200", giftSubs: "#00ffa8", rewardRedemptions: "#ff0adf" },
        text: { twitchName: "#090014", youtubeName: "#090014", tiktokName: "#090014", kickName: "#090014", muted: "#c7fbff", dark: "#090014", stealth: "#ffffff" },
        surfaces: { pageBackground: "#020008", bubbleBase: "#090014", bubbleHighlight: "#ffffff", mediaBackground: "#020008", badgeBackground: "#190027", avatarBorder: "#00f0ff", avatarFill: "#fff7ff" },
        effects: { shadow: "#000000", emoteSparkle: "#00f0ff", gigantifiedSparkle: "#fff200", highlightGlow: "#ff0adf", highlightWarmGlow: "#fff200", tiktokRed: "#ff0adf", tiktokBlue: "#00f0ff" },
        rainbow: { one: "#00f0ff", two: "#00ffa8", three: "#fff200", four: "#ff8a00", five: "#ff0adf", six: "#7b2cff", seven: "#fff7ff" }
      },
      bubbleShape: "slant",
      bubbleRadius: 8,
      nameBubbleRadius: 4,
      bubbleSlant: 12,
      nameIconEdgeOverlap: 26,
      nameIconEdgeRadius: 3,
      titleFontSize: 11,
      messageFontSize: 18,
      borderGlow: true,
      showAvatarGlow: true,
      showEmoteGlow: true
    },
    avatarSize: 56,
    animation: "fast",
    typeStyle: {
      bg: ["#ff0adf", "#270033", "#06000c", "#090014"],
      titleBg: ["#00f0ff", "#00ffa8", "#fff200", "#ff0adf"],
      titleIconBg: ["#090014", "#270033", "#7b2cff", "#ff0adf"],
      alertBg: ["#ff0adf", "#270033", "#06000c", "#090014"],
      giftBg: ["#fff200", "#ff0adf", "#270033", "#06000c"],
      alphas: [0.76, 0.98, 1, 1],
      cardAlphas: [0.98, 0.96, 0.96, 0.96],
      borderColor: "#00f0ff",
      glowColor: "#ff0adf",
      glowOpacity: 0.5,
      borderOpacity: 1,
      secondStop: 26,
      titleStops: [0, 32, 66, 100],
      titleIconStops: [0, 35, 70, 100],
      alertStops: [0, 32, 72, 100],
      giftStops: [0, 28, 68, 100],
      cardAngle: 105
    }
  },
  "theme-botanical": {
    style: {
      fontFamily: "'Ubuntu', sans-serif",
      accentFontFamily: "'Playfair Display', serif",
      messageFontFamily: "'Ubuntu', sans-serif",
      accentColor: "#b6f27a",
      messageTextColor: "#f4ffe8",
      titleTextColor: "#10200f",
      colors: {
        twitch: { chat: "#b6f27a", announcements: "#77d7a8", channelPointRedemptions: "#f0d38a", cheers: "#f0d38a", follows: "#77d7a8", subs: "#b6f27a", giftSubs: "#f0a6b2", raids: "#77d7a8" },
        youtube: { chat: "#f0a6b2", superChats: "#f0d38a", superStickers: "#f0a6b2", members: "#b6f27a" },
        tiktok: { chat: "#77d7a8", follows: "#b6f27a", subscribers: "#f0a6b2", gifts: "#f0d38a", likes: "#f0a6b2", treasureBoxes: "#77d7a8" },
        kick: { chat: "#b6f27a", follows: "#77d7a8", subs: "#f0d38a", giftSubs: "#b6f27a", rewardRedemptions: "#77d7a8" },
        surfaces: { pageBackground: "#071109", bubbleBase: "#10200f", bubbleHighlight: "#f4ffe8", mediaBackground: "#071109", badgeBackground: "#173019", avatarBorder: "#d8ffae", avatarFill: "#f4ffe8" },
        effects: { shadow: "#000000", emoteSparkle: "#d8ffae", gigantifiedSparkle: "#f0d38a", highlightGlow: "#b6f27a", highlightWarmGlow: "#f0d38a", tiktokRed: "#f0a6b2", tiktokBlue: "#77d7a8" }
      },
      bubbleShape: "rounded",
      bubbleRadius: 26,
      nameBubbleRadius: 26,
      nameIconEdgeOverlap: 26,
      nameIconEdgeRadius: 22,
      titleFontSize: 12,
      messageFontSize: 17
    },
    animation: "slow",
    typeStyle: {
      bg: ["#b6f27a", "#18351c", "#071109", "#10200f"],
      titleBg: ["#d8ffae", "#77d7a8", "#77d7a8", "#77d7a8"],
      titleIconBg: ["#10200f", "#18351c", "#18351c", "#18351c"],
      alertBg: ["#77d7a8", "#18351c", "#071109", "#10200f"],
      giftBg: ["#f0d38a", "#18351c", "#071109", "#10200f"],
      alphas: [0.28, 0.92, 0.98, 1],
      cardAlphas: [0.96, 0.92, 0.92, 0.92],
      borderColor: "#b6f27a",
      glowColor: "#77d7a8",
      glowOpacity: 0.2,
      borderOpacity: 0.78,
      secondStop: 24
    }
  },
  "theme-plastic-pop": {
    style: {
      fontFamily: "'Poppins', sans-serif",
      accentFontFamily: "'Fredoka', sans-serif",
      messageFontFamily: "'Poppins', sans-serif",
      accentColor: "#ff4fd8",
      messageTextColor: "#ffffff",
      titleTextColor: "#251100",
      colors: {
        twitch: { chat: "#ff4fd8", announcements: "#47d7ff", channelPointRedemptions: "#fff200", cheers: "#fff200", follows: "#5dff8c", subs: "#ff8a00", giftSubs: "#ff4fd8", raids: "#47d7ff" },
        youtube: { chat: "#ff4fd8", superChats: "#ff8a00", superStickers: "#47d7ff", members: "#fff200" },
        tiktok: { chat: "#47d7ff", follows: "#5dff8c", subscribers: "#ff4fd8", gifts: "#fff200", likes: "#ff4fd8", treasureBoxes: "#47d7ff" },
        kick: { chat: "#5dff8c", follows: "#47d7ff", subs: "#fff200", giftSubs: "#5dff8c", rewardRedemptions: "#ff4fd8" },
        surfaces: { pageBackground: "#120018", bubbleBase: "#2a0732", bubbleHighlight: "#ffffff", mediaBackground: "#120018", badgeBackground: "#3a0b44", avatarBorder: "#fff200", avatarFill: "#ffffff" },
        effects: { shadow: "#000000", emoteSparkle: "#fff200", gigantifiedSparkle: "#fff200", highlightGlow: "#ff4fd8", highlightWarmGlow: "#fff200", tiktokRed: "#ff4fd8", tiktokBlue: "#47d7ff" }
      },
      bubbleShape: "rounded",
      bubbleRadius: 8,
      nameBubbleRadius: 999,
      nameIconEdgeOverlap: 34,
      nameIconEdgeRadius: 999,
      titleFontSize: 12,
      messageFontSize: 18
    },
    animation: "fast",
    typeStyle: {
      bg: ["#ff4fd8", "#2a0732", "#120018", "#2a0732"],
      titleBg: ["#fff200", "#ff8a00", "#ff8a00", "#ff8a00"],
      titleIconBg: ["#47d7ff", "#ff4fd8", "#ff4fd8", "#ff4fd8"],
      alertBg: ["#47d7ff", "#2a0732", "#120018", "#2a0732"],
      giftBg: ["#fff200", "#ff4fd8", "#2a0732", "#120018"],
      alphas: [0.8, 0.98, 1, 1],
      cardAlphas: [1, 1, 1, 1],
      borderColor: "#ffffff",
      glowColor: "#ff4fd8",
      glowOpacity: 0.36,
      borderOpacity: 1,
      secondStop: 28
    }
  },
  "theme-starlight": {
    style: {
      fontFamily: "'Sora', sans-serif",
      accentFontFamily: "'Righteous', sans-serif",
      messageFontFamily: "'Sora', sans-serif",
      accentColor: "#f7f7ff",
      messageTextColor: "#f7f7ff",
      titleTextColor: "#071024",
      colors: {
        twitch: { chat: "#f7f7ff", announcements: "#8db4ff", channelPointRedemptions: "#d8b4fe", cheers: "#fff6a8", follows: "#b6fff1", subs: "#fff6a8", giftSubs: "#d8b4fe", raids: "#8db4ff" },
        youtube: { chat: "#d8b4fe", superChats: "#fff6a8", superStickers: "#f7f7ff", members: "#b6fff1" },
        tiktok: { chat: "#b6fff1", follows: "#f7f7ff", subscribers: "#d8b4fe", gifts: "#fff6a8", likes: "#d8b4fe", treasureBoxes: "#8db4ff" },
        kick: { chat: "#b6fff1", follows: "#f7f7ff", subs: "#fff6a8", giftSubs: "#b6fff1", rewardRedemptions: "#d8b4fe" },
        surfaces: { pageBackground: "#020617", bubbleBase: "#071024", bubbleHighlight: "#ffffff", mediaBackground: "#020617", badgeBackground: "#0c1730", avatarBorder: "#f7f7ff", avatarFill: "#ffffff" },
        effects: { shadow: "#000000", emoteSparkle: "#ffffff", gigantifiedSparkle: "#fff6a8", highlightGlow: "#f7f7ff", highlightWarmGlow: "#fff6a8", tiktokRed: "#d8b4fe", tiktokBlue: "#b6fff1" }
      },
      bubbleShape: "rounded",
      bubbleRadius: 18,
      nameBubbleRadius: 4,
      nameIconEdgeOverlap: 32,
      nameIconEdgeRadius: 4,
      titleFontSize: 11,
      messageFontSize: 17,
      showPageBackground: false
    },
    avatarSize: 54,
    animation: "subtle",
    typeStyle: {
      bg: ["#f7f7ff", "#16234a", "#020617", "#071024"],
      titleBg: ["#f7f7ff", "#8db4ff", "#8db4ff", "#8db4ff"],
      titleIconBg: ["#071024", "#16234a", "#16234a", "#16234a"],
      alertBg: ["#d8b4fe", "#16234a", "#020617", "#071024"],
      giftBg: ["#fff6a8", "#16234a", "#020617", "#071024"],
      alphas: [0.2, 0.92, 1, 1],
      cardAlphas: [0.96, 0.88, 0.88, 0.88],
      borderColor: "#f7f7ff",
      glowColor: "#f7f7ff",
      glowOpacity: 0.42,
      borderOpacity: 0.84,
      secondStop: 22
    }
  },
  "theme-aurora-luxe": {
    style: {
      fontFamily: "'Space Grotesk', sans-serif",
      accentFontFamily: "'Cinzel', serif",
      messageFontFamily: "'Space Grotesk', sans-serif",
      accentColor: "#7df9ff",
      messageTextColor: "#f8fbff",
      titleTextColor: "#081016",
      colors: {
        twitch: { chat: "#7df9ff", announcements: "#c084fc", channelPointRedemptions: "#ff6ec7", cheers: "#ffe66d", follows: "#8cffb5", subs: "#ffe66d", giftSubs: "#ff6ec7", raids: "#7df9ff" },
        youtube: { chat: "#ff6ec7", superChats: "#ffe66d", superStickers: "#7df9ff", members: "#8cffb5" },
        tiktok: { chat: "#7df9ff", follows: "#8cffb5", subscribers: "#ff6ec7", gifts: "#ffe66d", likes: "#ff6ec7", treasureBoxes: "#c084fc" },
        kick: { chat: "#8cffb5", follows: "#7df9ff", subs: "#ffe66d", giftSubs: "#8cffb5", rewardRedemptions: "#ff6ec7" },
        text: { twitchName: "#081016", youtubeName: "#081016", tiktokName: "#081016", kickName: "#081016", muted: "#b8c7d9", dark: "#081016", stealth: "#ffffff" },
        surfaces: { pageBackground: "#02040c", bubbleBase: "#060b18", bubbleHighlight: "#ffffff", mediaBackground: "#02040c", badgeBackground: "#081426", avatarBorder: "#f8fbff", avatarFill: "#ffffff" },
        effects: { shadow: "#000000", emoteSparkle: "#7df9ff", gigantifiedSparkle: "#ffe66d", highlightGlow: "#7df9ff", highlightWarmGlow: "#ff6ec7", tiktokRed: "#ff6ec7", tiktokBlue: "#7df9ff" },
        rainbow: { one: "#7df9ff", two: "#8cffb5", three: "#ffe66d", four: "#ff9f6e", five: "#ff6ec7", six: "#c084fc", seven: "#f8fbff" }
      },
      bubbleShape: "rounded",
      bubbleRadius: 24,
      nameBubbleRadius: 999,
      nameIconEdgeOverlap: 36,
      nameIconEdgeRadius: 999,
      titleFontSize: 12,
      messageFontSize: 18,
      messageLineHeight: 1.32,
      borderGlow: true,
      showAvatarGlow: true,
      showEmoteGlow: true,
      showPageBackground: false
    },
    avatarSize: 60,
    avatarGap: 12,
    animation: "normal",
    typeStyle: {
      bg: ["#7df9ff", "#16213e", "#050816", "#090d1f"],
      titleBg: ["#f8fbff", "#7df9ff", "#8cffb5", "#ffe66d"],
      titleIconBg: ["#081016", "#16213e", "#c084fc", "#ff6ec7"],
      alertBg: ["#ff6ec7", "#16213e", "#050816", "#090d1f"],
      giftBg: ["#ffe66d", "#ff6ec7", "#16213e", "#050816"],
      alphas: [0.34, 0.92, 1, 1],
      cardAlphas: [0.98, 0.92, 0.92, 0.92],
      borderColor: "#f8fbff",
      glowColor: "#7df9ff",
      glowOpacity: 0.5,
      borderOpacity: 0.96,
      secondStop: 18,
      titleStops: [0, 34, 68, 100],
      titleIconStops: [0, 38, 72, 100],
      alertStops: [0, 28, 72, 100],
      giftStops: [0, 26, 62, 100],
      cardAngle: 115
    }
  }
};

const COMPOSITION_PRESETS = {
  "composition-left-stack": {
    style: {
      nameIconPosition: "left",
      nameIconEdgeOverlap: 18,
      nameIconEdgeRadius: 16,
      showNameBackgrounds: true,
      showMessageBackgrounds: true,
      showAlertBackgrounds: true,
      showGiftBackgrounds: true,
      showMediaBackgrounds: true,
      borderGlow: true,
      showAvatarGlow: true,
      showEmoteGlow: true,
      titleFontSize: 12,
      messageFontSize: 17
    },
    layout: {
      chatWidth: "clamp(320px, 78vw, 720px)",
      maxMessageWidth: "min(600px, var(--chat-content-width))",
      rowGap: 14,
      groupedMessageGap: 4,
      avatarGap: 10,
      avatarSize: 52,
      fitToScreen: false
    },
    behaviour: {
      inlineChat: false,
      groupConsecutiveMessages: true,
      showAvatars: true,
      showBadges: true,
      showPlatformIcons: true,
      showTimestamps: false,
      monitorMode: false,
      scrollDirection: "up"
    }
  },
  "composition-inline-feed": {
    style: {
      nameIconPosition: "left",
      nameIconEdgeOverlap: 0,
      nameIconEdgeRadius: 0,
      showNameBackgrounds: false,
      showMessageBackgrounds: false,
      showAlertBackgrounds: false,
      showGiftBackgrounds: false,
      showMediaBackgrounds: false,
      borderGlow: false,
      showAvatarGlow: false,
      showEmoteGlow: false,
      titleFontSize: 14,
      messageFontSize: 16
    },
    layout: {
      chatWidth: "clamp(360px, 58vw, 640px)",
      maxMessageWidth: "var(--chat-content-width)",
      rowGap: 10,
      groupedMessageGap: 6,
      avatarGap: 10,
      avatarSize: 28,
      fitToScreen: false
    },
    behaviour: {
      inlineChat: true,
      groupConsecutiveMessages: false,
      showAvatars: true,
      showBadges: false,
      showPlatformIcons: true,
      showTimestamps: false,
      monitorMode: false,
      scrollDirection: "up"
    }
  },
  "composition-vertical-stage": {
    style: {
      nameIconPosition: "right",
      nameIconEdgeOverlap: 22,
      nameIconEdgeRadius: 20,
      showNameBackgrounds: true,
      showMessageBackgrounds: true,
      showAlertBackgrounds: true,
      showGiftBackgrounds: true,
      showMediaBackgrounds: true,
      borderGlow: true,
      showAvatarGlow: true,
      showEmoteGlow: true,
      titleFontSize: 12,
      messageFontSize: 17
    },
    layout: {
      chatWidth: "clamp(300px, 42vw, 460px)",
      maxMessageWidth: "min(380px, var(--chat-content-width))",
      rowGap: 14,
      groupedMessageGap: 6,
      avatarGap: 10,
      avatarSize: 46,
      fitToScreen: false
    },
    behaviour: {
      inlineChat: false,
      groupConsecutiveMessages: true,
      showAvatars: true,
      showBadges: true,
      showPlatformIcons: true,
      showTimestamps: false,
      monitorMode: false,
      scrollDirection: "up"
    }
  }
};

const pendingTikTokCombos = new Map();
const renderedTikTokGiftCards = new Map();
const MEDIA_EMBED_RE =
  /https?:\/\/[^\s<>"']+(?:(?:\.(?:png|jpg|jpeg|gif|webp|mp4|webm|mov)(?:\?[^\s<>"']*)?)|(?:[?&]format=(?:png|jpg|jpeg|gif|webp|mp4|webm|mov)\b[^\s<>"']*))/i;
const VIDEO_EMBED_RE =
  /\.(?:mp4|webm|mov)(?:[?#]|$)|[?&]format=(?:mp4|webm|mov)\b/i;
const URL_RE = /https?:\/\/[^\s<>"']+/gi;

initializeConfig();

let ws;
let tkWs;
let currentGroup = null;

applyConfigToDocument();
loadThirdPartyEmotes();

function initializeConfig() {
  const baseConfig = mergeConfig(DEFAULT_CONFIG, CONFIG);

  if (baseConfig.style?.stealthMode) {
    applyStealthPresetTo(baseConfig);
  }

  if (baseConfig.style?.minimalStyle) {
    applyMinimalPresetTo(baseConfig);
  }

  cfg = mergeConfig(baseConfig, getUrlConfigOverrides());
  ensureTypeStyles(cfg);
  repairRainbowTypeStyle(cfg);

  SB_WS = `ws://${cfg.streamerbot.host}:${cfg.streamerbot.port}`;
  TIKFINITY_WS = `ws://${cfg.tikfinity.host}:${cfg.tikfinity.port}`;
  maxMessages = cfg.layout.maxMessages;
}

function showConnectionToast(id, text, color = "#ff3355", autoHideMs = 0) {
  let toast = connectionToasts.get(id);

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "connection-toast";
    toast.dataset.id = id;

    document.body.appendChild(toast);
    connectionToasts.set(id, toast);
  }

  const index = [...connectionToasts.keys()].indexOf(id);

  clearTimeout(toast._hideTimer);

  toast.textContent = text;
  toast.style.setProperty("--toast-color", color);
  toast.style.setProperty("--toast-index", index);

  toast.classList.add("visible");

  if (autoHideMs > 0) {
    toast._hideTimer = setTimeout(() => {
      toast.classList.remove("visible");
    }, autoHideMs);
  }
}

const SUBSCRIPTIONS = {
  Twitch: [
    "AdRun",
    "Announcement",
    "AutomaticRewardRedemption",
    "AutoModMessageHeld",
    "AutoModMessageUpdate",
    "BetterTTVEmoteAdded",
    "BetterTTVEmoteRemoved",
    "BitsBadgeTier",
    "BlockedTermsAdded",
    "BlockedTermsDeleted",
    "BotEventSubConnected",
    "BotEventSubDisconnected",
    "BotWhisper",
    "BroadcasterAuthenticated",
    "BroadcasterChatConnected",
    "BroadcasterChatDisconnected",
    "BroadcasterEventSubConnected",
    "BroadcasterEventSubDisconnected",
    "BroadcastUpdate",
    "CharityCompleted",
    "CharityDonation",
    "CharityProgress",
    "CharityStarted",
    "ChatCleared",
    "ChatEmoteModeOff",
    "ChatEmoteModeOn",
    "ChatFollowerModeChanged",
    "ChatFollowerModeOff",
    "ChatFollowerModeOn",
    "ChatMessage",
    "ChatMessageDeleted",
    "ChatSlowModeChanged",
    "ChatSlowModeOff",
    "ChatSlowModeOn",
    "ChatSubscriberModeOff",
    "ChatSubscriberModeOn",
    "ChatUniqueModeOff",
    "ChatUniqueModeOn",
    "Cheer",
    "CoinCheer",
    "CommunityGoalContribution",
    "CommunityGoalEnded",
    "CustomPowerUpRedemption",
    "FirstWord",
    "Follow",
    "GiftBomb",
    "GiftPaidUpgrade",
    "GiftSub",
    "GoalBegin",
    "GoalEnd",
    "GoalProgress",
    "GuestStarGuestUpdate",
    "GuestStarSessionBegin",
    "GuestStarSessionEnd",
    "GuestStarSettingsUpdate",
    "GuestStarSlotUpdate",
    "HypeChat",
    "HypeChatLevel",
    "HypeTrainEnd",
    "HypeTrainLevelUp",
    "HypeTrainStart",
    "HypeTrainUpdate",
    "ModeratorAdded",
    "ModeratorRemoved",
    "PayItForward",
    "PermittedTermsAdded",
    "PermittedTermsDeleted",
    "PollArchived",
    "PollCompleted",
    "PollCreated",
    "PollTerminated",
    "PollUpdated",
    "PowerUp",
    "PredictionCanceled",
    "PredictionCompleted",
    "PredictionCreated",
    "PredictionLocked",
    "PredictionUpdated",
    "PresentViewers",
    "PrimePaidUpgrade",
    "PyramidBroken",
    "PyramidSuccess",
    "Raid",
    "RaidCancelled",
    "RaidSend",
    "RaidStart",
    "ReSub",
    "RewardCreated",
    "RewardDeleted",
    "RewardRedemption",
    "RewardRedemptionUpdated",
    "RewardUpdated",
    "SevenTVEmoteAdded",
    "SevenTVEmoteRemoved",
    "SharedChatAnnouncement",
    "SharedChatCommunitySubGift",
    "SharedChatGiftPaidUpgrade",
    "SharedChatMessageDeleted",
    "SharedChatPayItForward",
    "SharedChatPrimePaidUpgrade",
    "SharedChatRaid",
    "SharedChatResub",
    "SharedChatSessionBegin",
    "SharedChatSessionEnd",
    "SharedChatSessionUpdate",
    "SharedChatSub",
    "SharedChatSubGift",
    "SharedChatUserBanned",
    "SharedChatUserTimedout",
    "SharedChatUserUnbanned",
    "SharedChatUserUntimedout",
    "ShieldModeBegin",
    "ShieldModeEnd",
    "ShoutoutCreated",
    "ShoutoutReceived",
    "StreamOffline",
    "StreamOnline",
    "StreamUpdate",
    "StreamUpdateGameOnConnect",
    "Sub",
    "SubCounterRollover",
    "SuspiciousUserMessage",
    "SuspiciousUserUpdate",
    "UnbanRequestApproved",
    "UnbanRequestCreated",
    "UnbanRequestDenied",
    "UpcomingAd",
    "UserBanned",
    "UserTimedOut",
    "UserUnbanned",
    "UserUntimedOut",
    "ViewerCountUpdate",
    "VipAdded",
    "VipRemoved",
    "WarnedUser",
    "WarningAcknowledged",
    "WatchStreak",
    "Whisper",

    "Message",
    "Chat",
    "SharedChatMessage",
    "MessageDeleted",
    "ClearChat"
  ],

  YouTube: [
    "BetterTTVEmoteAdded",
    "BetterTTVEmoteRemoved",
    "BroadcastAdded",
    "BroadcastEnded",
    "BroadcastMonitoringEnded",
    "BroadcastMonitoringStarted",
    "BroadcastRemoved",
    "BroadcastStarted",
    "BroadcastUpdated",
    "FirstWords",
    "GiftMembershipReceived",
    "JewelsGifted",
    "MemberMileStone",
    "MembershipGift",
    "Message",
    "MessageDeleted",
    "NewSponsor",
    "NewSponsorOnlyEnded",
    "NewSponsorOnlyStarted",
    "NewSubscriber",
    "PollClosed",
    "PollStarted",
    "PollUpdated",
    "PresentViewers",
    "SevenTVEmoteAdded",
    "SevenTVEmoteRemoved",
    "StatisticsUpdated",
    "SuperChat",
    "SuperSticker",
    "UserBanned",
    "UserTimedout"
  ],

  Kick: [
    "BroadcasterAuthenticated",
    "BroadcasterChatConnected",
    "BroadcasterChatDisconnected",
    "ChannelUpdate",
    "ChatMessage",
    "FirstWords",
    "Follow",
    "GiftSubscription",
    "MassGiftSubscription",
    "PresentViewers",
    "Resubscription",
    "RewardRedemption",
    "SevenTVEmoteAdded",
    "SevenTVEmoteRemoved",
    "sGifted",
    "StreamOffline",
    "StreamOnline",
    "Subscription",
    "UserBanned",
    "UserTimedOut",
    "ViewerCountUpdate"
  ],

  streamlabs: [
    "Donation",
    "CharityDonation",
    "Merchandise"
  ],

  streamElements: [
    "Tip",
    "Merch"
  ],

  kofi: [
    "Donation",
    "Subscription",
    "Resubscription",
    "ShopOrder",
    "Commission"
  ],

  tipeeeStream: [
    "Donation"
  ],

  fourthwall: [
    "Donation",
    "GiftPurchase",
    "OrderPlaced",
    "OrderUpdated",
    "SubscriptionPurchased",
    "SubscriptionChanged",
    "SubscriptionExpired",
    "NewsletterSubscribed",
    "ThankYouSent"
  ],

  patreon: [
    "FollowCreated",
    "FollowDeleted",
    "PledgeCreated",
    "PledgeUpdated",
    "PledgeDeleted"
  ],

  donorDrive: [
    "Donation",
    "Incentive",
    "ProfileUpdated"
  ]
};

function logTreasureEvent(payload) {
  const timestamp = new Date().toISOString();

  const entry = {
    timestamp,
    payload
  };

  const existing = JSON.parse(localStorage.getItem("treasureEvents") || "[]");
  existing.push(entry);

  localStorage.setItem("treasureEvents", JSON.stringify(existing));

  console.log("💰 TREASURE BOX EVENT SAVED:", entry);
}

window.downloadTreasureLog = function () {
  const logs = localStorage.getItem("treasureEvents") || "[]";

  const blob = new Blob([logs], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "treasure-events.json";
  a.click();

  URL.revokeObjectURL(url);
};

window.clearTreasureLog = function () {
  localStorage.removeItem("treasureEvents");
  console.log("Treasure log cleared");
};


function getLocalTikTokEmote(name) {
  const key = String(name || "")
    .toLowerCase()
    .trim();

  const localEmotes = {
    "7551778175766055683": "icons/tiktok-emotes/your-emote.webp"
  };

  return localEmotes[key] || "";
}


function applyConfigToDocument() {
  const root = document.documentElement;
  maxMessages = cfg.layout.maxMessages;

  root.style.setProperty("--chat-left", px(cfg.layout.left));
  root.style.setProperty("--chat-bottom", px(cfg.layout.bottom));
  root.style.setProperty("--chat-row-gap", px(cfg.layout.rowGap));
  root.style.setProperty("--grouped-message-gap", px(cfg.layout.groupedMessageGap));
  root.style.setProperty("--chat-column-gap", px(cfg.layout.avatarGap ?? 10));

  root.style.setProperty("--font-family", cfg.style.fontFamily);

  root.style.setProperty(
    "--accent-font-family",
    cfg.style.accentFontFamily || cfg.style.fontFamily
  );

  root.style.setProperty(
    "--message-font-family",
    cfg.style.messageFontFamily || cfg.style.fontFamily
  );

  root.style.setProperty("--avatar-size", px(cfg.layout.avatarSize));
  root.style.setProperty("--avatar-size-gigantified", px(cfg.layout.avatarSizeGigantified));

  root.style.setProperty(
    "--chat-width",
    px(cfg.layout.fitToScreen ? "100%" : cfg.layout.chatWidth)
  );

  root.style.setProperty(
    "--max-message-width",
    px(
      cfg.layout.fitToScreen
        ? "var(--chat-content-width)"
        : cfg.layout.maxMessageWidth
    )
  );
  root.style.setProperty(
    "--message-bubble-width",
    px(cfg.layout.fitToScreen ? "var(--chat-content-width)" : "fit-content")
  );
  root.style.setProperty(
    "--name-bubble-width",
    px(cfg.layout.fitToScreen ? "var(--chat-content-width)" : "auto")
  );
  root.style.setProperty(
    "--bubble-stack-width",
    px(cfg.layout.fitToScreen ? "var(--chat-content-width)" : "auto")
  );
  root.style.setProperty(
    "--alert-bubble-width",
    px(cfg.layout.fitToScreen ? "var(--chat-content-width)" : "auto")
  );
  root.style.setProperty(
    "--alert-bubble-max-width",
    px(cfg.layout.fitToScreen ? "var(--chat-content-width)" : "340px")
  );
  root.style.setProperty(
    "--alert-bubble-min-width",
    px(cfg.layout.fitToScreen ? "0px" : "280px")
  );
  root.style.setProperty(
    "--tiktok-gift-card-width",
    px(cfg.layout.fitToScreen ? "var(--chat-content-width)" : "fit-content")
  );

  root.style.setProperty("--message-font-size", px(cfg.style.messageFontSize));
  root.style.setProperty("--title-font-size", px(cfg.style.titleFontSize));
  root.style.setProperty("--title-line-height", cfg.style.titleLineHeight ?? 1.05);
  root.style.setProperty("--message-line-height", cfg.style.messageLineHeight ?? 1.28);
  root.style.setProperty("--emote-only-font-size", px(cfg.style.emoteOnlyFontSize));
  root.style.setProperty("--gigantified-font-size", px(cfg.style.gigantifiedFontSize));

  root.style.setProperty("--bubble-radius", px(cfg.style.bubbleRadius));
  root.style.setProperty("--name-bubble-radius", px(cfg.style.nameBubbleRadius));
  root.style.setProperty("--name-tag-offset-x", px(cfg.style.nameTagOffsetX ?? 10));
  root.style.setProperty("--name-tag-overlap-y", px(cfg.style.nameTagOverlapY ?? 8));
  root.style.setProperty("--overlapped-message-top-padding", px(cfg.style.overlappedMessageTopPadding ?? 17));
  const overlappedTiltAmount = Number(cfg.style.overlappedTiltAmount ?? 3);
  root.style.setProperty("--overlapped-tilt-amount", `${overlappedTiltAmount}deg`);
  root.style.setProperty("--overlapped-tilt-amount-negative", `${overlappedTiltAmount * -1}deg`);
  root.style.setProperty("--name-bubble-layer-overlap", px(cfg.style.nameIconEdgeOverlap ?? 16));
  root.style.setProperty("--name-bubble-seam-curve", px(cfg.style.nameIconEdgeRadius ?? 19));
  root.style.setProperty("--message-text-color", cfg.style.messageTextColor || "#ffffff");
  root.style.setProperty("--title-text-color", cfg.style.titleTextColor || "#ffffff");
  root.style.setProperty("--custom-accent-color", cfg.style.accentColor || "#9146ff");
  Object.entries(getColorCssVariables(cfg.style.colors)).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });
  root.style.setProperty("--bubble-slant", px(cfg.style.bubbleSlant));
  root.style.setProperty("--bubble-notch", px(cfg.style.bubbleNotch));

  [...document.body.classList]
    .filter(name => name.startsWith("anim-"))
    .forEach(name => document.body.classList.remove(name));

  document.body.classList.add(`anim-${cfg.animation.preset || "normal"}`);

  [...document.body.classList]
    .filter(name => name.startsWith("anim-type-"))
    .forEach(name => document.body.classList.remove(name));

  document.body.classList.add(`anim-type-${cfg.animation.type || "default"}`);

  [...document.body.classList]
    .filter(name => name.startsWith("bubble-shape-"))
    .forEach(name => document.body.classList.remove(name));

  document.body.classList.add(`bubble-shape-${cfg.style.bubbleShape || "rounded"}`);
  [...document.body.classList]
    .filter(name => name.startsWith("bubble-layout-"))
    .forEach(name => document.body.classList.remove(name));

  const requestedBubbleLayout = String(cfg.style.bubbleLayout || "").toLowerCase();
  const bubbleLayout =
    ["stacked", "inline", "overlapped"].includes(requestedBubbleLayout)
      ? requestedBubbleLayout
      : (cfg.behaviour.inlineChat ? "inline" : "stacked");
  document.body.classList.add(`bubble-layout-${bubbleLayout}`);
  document.body.classList.toggle("name-icon-left", cfg.style.nameIconPosition === "left");
  document.body.classList.toggle("use-twitch-name-colors", !!cfg.style.useTwitchChatNameColor);

  document.body.classList.toggle("hide-alerts", !cfg.behaviour.showAlerts);
  document.body.classList.toggle("custom-accent", !!cfg.style.useCustomAccentColor);
  document.body.classList.toggle("fit-to-screen", !!cfg.layout.fitToScreen);
  document.body.classList.toggle("hide-chat-twitch", cfg.behaviour.chat?.twitch === false);
  document.body.classList.toggle("hide-chat-youtube", cfg.behaviour.chat?.youtube === false);
  document.body.classList.toggle("hide-chat-tiktok", cfg.behaviour.chat?.tiktok === false);
  document.body.classList.toggle("hide-chat-kick", cfg.behaviour.chat?.kick === false);
  document.body.classList.toggle("hide-avatars", !cfg.behaviour.showAvatars);
  document.body.classList.toggle("hide-badges", !cfg.behaviour.showBadges);
  document.body.classList.toggle("hide-platform-icons", !cfg.behaviour.showPlatformIcons);
  document.body.classList.toggle("hide-border-glow", !cfg.style.borderGlow);
  document.body.classList.toggle("hide-name-backgrounds", !cfg.style.showNameBackgrounds);
  document.body.classList.toggle("hide-message-backgrounds", !cfg.style.showMessageBackgrounds);
  document.body.classList.toggle("hide-alert-backgrounds", !cfg.style.showAlertBackgrounds);
  document.body.classList.toggle("hide-gift-backgrounds", !cfg.style.showGiftBackgrounds);
  document.body.classList.toggle("hide-media-backgrounds", !cfg.style.showMediaBackgrounds);
  document.body.classList.toggle("no-message-animations", cfg.animation.messages === false);
  document.body.classList.toggle("no-alert-animations", cfg.animation.alerts === false);
  document.body.classList.toggle("no-gift-animations", cfg.animation.gifts === false);
  document.body.classList.toggle("hide-avatar-glow", !cfg.style.showAvatarGlow);
  document.body.classList.toggle("hide-emote-glow", !cfg.style.showEmoteGlow);
  document.body.classList.toggle("hide-colored-text", !cfg.style.showColoredText);
  document.body.classList.toggle(
    "inline-chat",
    bubbleLayout === "inline" || (!!cfg.behaviour.inlineChat && bubbleLayout !== "overlapped")
  );
  document.body.classList.toggle("overlapped-card-shadow", !!cfg.style.overlappedCardShadow);
  document.body.classList.toggle("overlapped-random-tilt", !!cfg.style.overlappedRandomTilt);
  document.body.classList.toggle("show-timestamps", !!cfg.behaviour.showTimestamps);
  document.body.classList.toggle("monitor-mode", !!cfg.behaviour.monitorMode);
  document.documentElement.classList.toggle("monitor-mode", !!cfg.behaviour.monitorMode);
  document.body.classList.toggle("minimal-style", !!cfg.style.minimalStyle);
  document.body.classList.toggle("minimal-name-backgrounds", !!cfg.style.minimal?.nameBackgrounds);
  document.body.classList.toggle("minimal-message-backgrounds", !!cfg.style.minimal?.messageBackgrounds);
  document.body.classList.toggle("minimal-alert-backgrounds", !!cfg.style.minimal?.alertBackgrounds);
  document.body.classList.toggle("minimal-gift-backgrounds", !!cfg.style.minimal?.giftBackgrounds);
  document.body.classList.toggle("minimal-glow", !!cfg.style.minimal?.glow);
  document.body.classList.toggle("minimal-shine", !!cfg.style.minimal?.shine);
  document.body.classList.toggle("minimal-animations", cfg.style.minimal?.animations !== false);
  document.body.classList.toggle("scroll-down", cfg.behaviour.scrollDirection === "down");
  document.body.classList.toggle("auto-scroll-off", cfg.behaviour.autoScroll === false);
  document.body.classList.toggle(
    "no-animations",
    !cfg.animation.enabled || cfg.animation.preset === "none"
  );
  document.body.classList.toggle("no-emote-bounce", !cfg.gigantified.bounceEmotes);

  document.querySelectorAll(".msg").forEach(el => {
    applyPlatformVariables(el, el.dataset.platform, {
      kind: el.dataset.kind || (el.classList.contains("alert") ? "alert" : "chat"),
      platform: el.dataset.platform || "",
      alertType: el.dataset.alertType || "",
      styleType: el.dataset.styleType || "",
      special: [...el.classList]
        .find(name => name.startsWith("special-"))
        ?.replace("special-", "") || ""
    });
  });

  trimMessages();
}

function getColorCssVariables(colors = {}) {
  const text = colors.text || {};
  const surfaces = colors.surfaces || {};
  const effects = colors.effects || {};
  const rainbow = colors.rainbow || {};

  const pageBackground =
    cfg.style?.showPageBackground
      ? surfaces.pageBackground || "#000000"
      : "transparent";

  return {
    "--twitch-name-text-color": text.twitchName || "#ffe45f",
    "--youtube-name-text-color": text.youtubeName || "#ffd6dc",
    "--tiktok-name-text-color": text.tiktokName || "#061114",
    "--kick-name-text-color": text.kickName || "#ecffe8",
    "--muted-text-color": text.muted || "#d6d6e0",
    "--dark-text-color": text.dark || "#061114",
    "--stealth-text-color": text.stealth || "#ffffff",
    "--page-background-color": pageBackground,
    "--bubble-base-color": surfaces.bubbleBase || "#050510",
    "--bubble-highlight-color": surfaces.bubbleHighlight || "#ffffff",
    "--media-background-color": surfaces.mediaBackground || "#000000",
    "--link-preview-text-color": surfaces.linkPreviewText || "#ffffff",
    "--link-preview-meta-color": surfaces.linkPreviewMeta || "#d6d6e0",
    "--badge-background-color": surfaces.badgeBackground || "#000000",
    "--avatar-border-color": surfaces.avatarBorder || "#ffffff",
    "--avatar-fill-color": surfaces.avatarFill || "#ffffff",
    "--shadow-color": effects.shadow || surfaces.shadow || "#000000",
    "--emote-sparkle-color": effects.emoteSparkle || "#ffffff",
    "--gigantified-sparkle-color": effects.gigantifiedSparkle || "#ffd65a",
    "--highlight-glow-color": effects.highlightGlow || "#ff00c8",
    "--highlight-warm-glow-color": effects.highlightWarmGlow || "#ffb400",
    "--tiktok-red-color": effects.tiktokRed || "#fe2c55",
    "--tiktok-blue-color": effects.tiktokBlue || "#25f4ee",
    "--rainbow-color-1": rainbow.one || "#ff004c",
    "--rainbow-color-2": rainbow.two || "#ff8a00",
    "--rainbow-color-3": rainbow.three || "#fff700",
    "--rainbow-color-4": rainbow.four || "#00ff85",
    "--rainbow-color-5": rainbow.five || "#00c8ff",
    "--rainbow-color-6": rainbow.six || "#7a5cff",
    "--rainbow-color-7": rainbow.seven || "#ff00d4"
  };
}

window.getChatConfigValue = function (path) {
  return getDeepValue(cfg, path);
};

window.getChatConfigSnapshot = function () {
  return cloneConfigValue(cfg);
};

window.getChatDefaultConfigValue = function (path) {
  if (String(path || "").startsWith("style.typeStyles.special.rainbow.")) {
    const currentTypeDefaults = buildDefaultTypeStyles(cfg.style || DEFAULT_CONFIG.style);
    return cloneConfigValue(getDeepValue({ style: { typeStyles: currentTypeDefaults } }, path));
  }

  const styleDefault = getDeepValue({ style: DEFAULT_STYLE_PRESET }, path);

  if (styleDefault !== undefined) {
    return cloneConfigValue(styleDefault);
  }

  return cloneConfigValue(getDeepValue(DEFAULT_CONFIG, path));
};

let pendingConfigApplyFrame = 0;

function scheduleConfigApply() {
  if (pendingConfigApplyFrame) return;

  pendingConfigApplyFrame = requestAnimationFrame(() => {
    pendingConfigApplyFrame = 0;
    applyConfigToDocument();
  });
}

function applyConfigAfterWrite(options = {}) {
  if (options.skipApply) {
    return;
  }

  if (options.deferApply) {
    scheduleConfigApply();
    return;
  }

  if (pendingConfigApplyFrame) {
    cancelAnimationFrame(pendingConfigApplyFrame);
    pendingConfigApplyFrame = 0;
  }

  applyConfigToDocument();
}

function isDemoItem(item = {}) {
  return item.raw?.__demo === true;
}

function clearDemoMessagesForTimestampToggle() {
  const demoMessages = [...chat.querySelectorAll(".msg[data-demo='true']")];
  if (demoMessages.length === 0) return false;

  demoMessages.forEach(el => el.remove());
  currentGroup = null;

  return true;
}

window.applyChatConfigToDocument = function () {
  if (pendingConfigApplyFrame) {
    cancelAnimationFrame(pendingConfigApplyFrame);
    pendingConfigApplyFrame = 0;
  }

  applyConfigToDocument();
};

window.setChatConfigValue = function (path, value, options = {}) {
  const timestampsWereEnabled = !!cfg.behaviour.showTimestamps;
  const shouldSyncRainbowTypeStyle =
    isRainbowTypeDefaultSourcePath(path) &&
    !hasRainbowTypeStyleManualOverrides(cfg.style);

  setDeepValue(cfg, path, value);

  if (shouldSyncRainbowTypeStyle) {
    syncRainbowTypeStyleDefaults(cfg);
  }

  repairRainbowTypeStyle(cfg);

  syncSourceGroupTypes(path, value);
  syncAlertGroupTypes(path, value);

  if (path === "style.stealthMode" && value) {
    applyStealthPreset();
  }

  if (path === "style.minimalStyle" && value) {
    applyMinimalPresetTo(cfg);
  }

  if (path === "behaviour.autoScroll" && value) {
    resumeScrollTestAutoScroll(false);
    maybeAutoScrollToBottom();
  }

  if (path === "style.bubbleShape") {
    applyBubbleShapeDefaults(value);
  }

  applyConfigAfterWrite(options);

  if (path === "scrollTest.enabled") {
    if (value) {
      scrollTestStopped = false;
      startScrollTestMessages();
    } else {
      stopScrollTestMessages("Scroll test disabled");
    }
  }

  if (path === "scrollTest.intervalMs" && scrollTestTimer && !scrollTestStopped) {
    clearInterval(scrollTestTimer);
    scrollTestTimer = null;
    startScrollTestMessages();
  }

  if (path === "scrollTest.autoScroll" && !value) {
    resumeScrollTestAutoScroll(false);
  }

  if (isScrollTestFilterConfigPath(path)) {
    pruneHiddenMessages();
    restartActiveScrollTestMessages();
  }

  if (
    path === "behaviour.showTimestamps" &&
    value &&
    !timestampsWereEnabled &&
    clearDemoMessagesForTimestampToggle()
  ) {
    restartActiveScrollTestMessages({ sendImmediately: true });
  }
};

window.setChatConfigValues = function (entries, options = {}) {
  const timestampsWereEnabled = !!cfg.behaviour.showTimestamps;
  const shouldSyncRainbowTypeStyle =
    entries.some(([path]) => isRainbowTypeDefaultSourcePath(path)) &&
    !entries.some(([path]) => isRainbowTypeStylePath(path)) &&
    !hasRainbowTypeStyleManualOverrides(cfg.style);

  entries.forEach(([path, value]) => {
    setDeepValue(cfg, path, value);
    syncSourceGroupTypes(path, value);
    syncAlertGroupTypes(path, value);
  });

  if (shouldSyncRainbowTypeStyle) {
    syncRainbowTypeStyleDefaults(cfg);
  }

  repairRainbowTypeStyle(cfg);

  applyConfigAfterWrite(options);

  if (
    !timestampsWereEnabled &&
    !!cfg.behaviour.showTimestamps &&
    entries.some(([path]) => path === "behaviour.showTimestamps") &&
    clearDemoMessagesForTimestampToggle()
  ) {
    restartActiveScrollTestMessages({ sendImmediately: true });
  }
};

function applyStealthPreset() {
  applyStealthPresetTo(cfg);
  applyConfigToDocument();
}

function applyBubbleShapeDefaults(shape) {
  const defaults = {
    rounded: { bubbleRadius: 21, nameBubbleRadius: 20, bubbleSlant: 26, bubbleNotch: 23 },
    square: { bubbleRadius: 4, nameBubbleRadius: 4, bubbleSlant: 0, bubbleNotch: 0 },
    slant: { bubbleRadius: 12, nameBubbleRadius: 12, bubbleSlant: 26, bubbleNotch: 0 },
    notch: { bubbleRadius: 14, nameBubbleRadius: 14, bubbleSlant: 0, bubbleNotch: 20 }
  }[String(shape || "rounded")];

  if (!defaults) return;

  Object.entries(defaults).forEach(([key, value]) => {
    setDeepValue(cfg, `style.${key}`, value);
  });
}

function applyStealthPresetTo(target) {
  setDeepValue(target, "style.stealthMode", true);
  setDeepValue(target, "style.minimalStyle", false);
  setDeepValue(target, "style.minimal", cloneConfigValue(DEFAULT_CONFIG.style.minimal));
  setDeepValue(target, "style.showNameBackgrounds", false);
  setDeepValue(target, "style.showMessageBackgrounds", false);
  setDeepValue(target, "style.showAlertBackgrounds", false);
  setDeepValue(target, "style.showGiftBackgrounds", false);
  setDeepValue(target, "style.showMediaBackgrounds", false);
  setDeepValue(target, "style.showAvatarGlow", false);
  setDeepValue(target, "style.showEmoteGlow", false);
  setDeepValue(target, "style.showColoredText", false);
  setDeepValue(target, "style.borderGlow", false);
  setDeepValue(target, "animation.enabled", false);
  setDeepValue(target, "animation.preset", "none");
  setDeepValue(target, "behaviour.showPlatformIcons", false);
  setDeepValue(target, "behaviour.showBadges", false);
  setDeepValue(target, "layout.avatarSize", 30);
  setDeepValue(target, "layout.avatarGap", 12);
  setDeepValue(target, "style.typeStyles.special.rainbow.messageGlowEnabled", false);
}

function applyMinimalPresetTo(target) {
  setDeepValue(target, "style.stealthMode", false);
  setDeepValue(target, "style.minimalStyle", true);
  setDeepValue(target, "style.minimal", cloneConfigValue(DEFAULT_CONFIG.style.minimal));
  setDeepValue(target, "style.showNameBackgrounds", true);
  setDeepValue(target, "style.showMessageBackgrounds", true);
  setDeepValue(target, "style.showAlertBackgrounds", true);
  setDeepValue(target, "style.showGiftBackgrounds", true);
  setDeepValue(target, "style.showMediaBackgrounds", true);
  setDeepValue(target, "style.showAvatarGlow", true);
  setDeepValue(target, "style.showEmoteGlow", true);
  setDeepValue(target, "style.showColoredText", true);
  setDeepValue(target, "style.borderGlow", true);
  setDeepValue(target, "animation.enabled", true);
  setDeepValue(target, "animation.preset", "normal");
  setDeepValue(target, "behaviour.showPlatformIcons", true);
  setDeepValue(target, "behaviour.showBadges", true);
  setDeepValue(target, "layout.avatarSize", DEFAULT_CONFIG.layout.avatarSize);
  setDeepValue(target, "layout.avatarGap", DEFAULT_CONFIG.layout.avatarGap);
  setDeepValue(target, "style.typeStyles.special.rainbow.messageGlowEnabled", false);
  setDeepValue(target, "style.showEmoteGlow", false);
  setDeepValue(target, "style.showAvatarGlow", false);
}

function applyMinimalStylePreset() {
  applyMinimalPresetTo(cfg);
  applyConfigToDocument();
}

function applyDefaultStylePreset() {
  Object.entries(DEFAULT_STYLE_PRESET).forEach(([key, value]) => {
    setDeepValue(cfg, `style.${key}`, cloneConfigValue(value));
  });

  setDeepValue(cfg, "animation.enabled", true);
  setDeepValue(cfg, "animation.preset", "normal");
  setDeepValue(cfg, "behaviour.showPlatformIcons", true);
  setDeepValue(cfg, "behaviour.showBadges", true);
  setDeepValue(cfg, "layout.avatarSize", DEFAULT_CONFIG.layout.avatarSize);
  setDeepValue(cfg, "layout.avatarGap", DEFAULT_CONFIG.layout.avatarGap);

  applyConfigToDocument();
}

function applyMessageThemePreset(presetName) {
  applyMessageThemePresetTo(cfg, presetName);
  applyConfigToDocument();
}

function applyMessageThemePresetTo(target, presetName) {
  const preset = MESSAGE_THEME_PRESETS[presetName];

  if (!preset) return;

  const nextStyle = mergeConfig(DEFAULT_STYLE_PRESET, preset.style || {});
  nextStyle.stealthMode = false;
  nextStyle.minimalStyle = false;
  nextStyle.minimal = cloneConfigValue(DEFAULT_CONFIG.style.minimal);
  [
    "showNameBackgrounds",
    "showMessageBackgrounds",
    "showAlertBackgrounds",
    "showGiftBackgrounds",
    "showMediaBackgrounds",
    "showColoredText"
  ].forEach(key => {
    if (typeof preset.style?.[key] === "undefined") {
      nextStyle[key] = true;
    }
  });
  nextStyle.typeStyles = buildDefaultTypeStyles(nextStyle);
  applyMessageThemeTypeStyle(nextStyle.typeStyles, preset.typeStyle || {});

  Object.entries(nextStyle).forEach(([key, value]) => {
    setDeepValue(target, `style.${key}`, cloneConfigValue(value));
  });

  setDeepValue(target, "animation.enabled", true);
  setDeepValue(target, "animation.preset", preset.animation || "normal");
  setDeepValue(target, "behaviour.showPlatformIcons", preset.platformIcons ?? true);
  setDeepValue(target, "behaviour.showBadges", preset.badges ?? true);
  setDeepValue(target, "layout.avatarSize", preset.avatarSize ?? DEFAULT_CONFIG.layout.avatarSize);
  setDeepValue(target, "layout.avatarGap", preset.avatarGap ?? DEFAULT_CONFIG.layout.avatarGap);
}

function applyCompositionPreset(presetName) {
  applyCompositionPresetTo(cfg, presetName);
  applyConfigToDocument();
}

function applyCompositionPresetTo(target, presetName) {
  const preset = COMPOSITION_PRESETS[presetName];

  if (!preset) return;

  Object.entries(preset.style || {}).forEach(([key, value]) => {
    setDeepValue(target, `style.${key}`, cloneConfigValue(value));
  });

  Object.entries(preset.layout || {}).forEach(([key, value]) => {
    setDeepValue(target, `layout.${key}`, cloneConfigValue(value));
  });

  Object.entries(preset.behaviour || {}).forEach(([key, value]) => {
    setDeepValue(target, `behaviour.${key}`, cloneConfigValue(value));
  });
}

function applyMessageThemeTypeStyle(typeStyles, options) {
  const groups = Object.values(typeStyles || {});

  groups.forEach(types => {
    Object.values(types || {}).forEach(style => {
      const accent = style.messageBorderColor || style.titleBgColor || "#9146ff";
      const resolveColors = colors =>
        (colors || ["accent", "#10121e", "#06060c", "#08080f"])
          .map(color => color === "accent" ? accent : color);
      const bgColors = resolveColors(options.bg);
      const titleColors = resolveColors(options.titleBg || options.bg);
      const iconColors = resolveColors(options.titleIconBg || options.titleBg || options.bg);
      const alertColors = resolveColors(options.alertBg || options.bg);
      const giftColors = resolveColors(options.giftBg || options.alertBg || options.bg);
      const alphas = options.alphas || [0.13, 0.98, 1, 1];
      const cardAlphas = options.cardAlphas || alphas;
      const borderColor = options.borderColor || accent;
      const glowColor = options.glowColor || accent;

      applyGradientDefaults(style, "messageBg", bgColors, [0, options.secondStop ?? 36, 78, 100], {
        mode: options.bgMode || "radial",
        angle: options.bgAngle ?? 135,
        opacity: 1,
        alphas
      });
      applyGradientDefaults(style, "titleBg", titleColors, options.titleStops || [0, 100, 100, 100], {
        mode: options.cardMode || "linear",
        angle: options.cardAngle ?? 135,
        opacity: 1,
        alphas: cardAlphas
      });
      applyGradientDefaults(style, "titleIconBg", iconColors, options.titleIconStops || options.titleStops || [0, 100, 100, 100], {
        mode: options.cardMode || "linear",
        angle: options.cardAngle ?? 135,
        opacity: 1,
        alphas: cardAlphas
      });
      applyGradientDefaults(style, "alertBg", alertColors, options.alertStops || [0, 100, 100, 100], {
        mode: options.cardMode || "linear",
        angle: options.cardAngle ?? 135,
        opacity: 1,
        alphas: cardAlphas
      });
      applyGradientDefaults(style, "giftBg", giftColors, options.giftStops || options.alertStops || [0, 100, 100, 100], {
        mode: options.cardMode || "linear",
        angle: options.cardAngle ?? 135,
        opacity: 1,
        alphas: cardAlphas
      });
      ["avatarBorder", "titleBorder", "messageBorder", "alertBorder", "giftBorder"].forEach(prefix => {
        style[`${prefix}Color`] = borderColor;
        applySolidGradientDefault(style, prefix, borderColor, { opacity: style[`${prefix}Opacity`] });
      });
      ["avatarGlow", "titleGlow", "messageGlow", "alertGlow", "giftGlow"].forEach(prefix => {
        style[`${prefix}Color`] = glowColor;
        applySolidGradientDefault(style, prefix, glowColor, { opacity: style[`${prefix}Opacity`] });
      });

      if (typeof options.glowOpacity !== "undefined") {
        style.avatarGlowOpacity = options.glowOpacity;
        style.titleGlowOpacity = options.glowOpacity;
        style.messageGlowOpacity = options.glowOpacity;
        style.alertGlowOpacity = options.glowOpacity;
        style.giftGlowOpacity = options.glowOpacity;
        ["avatarGlow", "titleGlow", "messageGlow", "alertGlow", "giftGlow"].forEach(prefix => {
          applySolidGradientDefault(style, prefix, style[`${prefix}Color`] || glowColor, { opacity: options.glowOpacity });
        });
      }

      if (typeof options.borderOpacity !== "undefined") {
        style.avatarBorderOpacity = options.borderOpacity;
        style.titleBorderOpacity = options.borderOpacity;
        style.messageBorderOpacity = options.borderOpacity;
        style.alertBorderOpacity = options.borderOpacity;
        style.giftBorderOpacity = options.borderOpacity;
        ["avatarBorder", "titleBorder", "messageBorder", "alertBorder", "giftBorder"].forEach(prefix => {
          applySolidGradientDefault(style, prefix, style[`${prefix}Color`] || borderColor, { opacity: options.borderOpacity });
        });
      }
    });
  });
}

window.applyChatStylePreset = function (preset) {
  if (MESSAGE_THEME_PRESETS[preset]) {
    applyMessageThemePreset(preset);
    return;
  }

  if (COMPOSITION_PRESETS[preset]) {
    applyCompositionPreset(preset);
    return;
  }

  if (preset === "stealth") applyStealthPreset();
  if (preset === "default") applyDefaultStylePreset();
  if (preset === "minimal") applyMinimalStylePreset();
};

window.getChatDefaultConfigSnapshot = function () {
  const baseline = cloneConfigValue(DEFAULT_CONFIG);
  baseline.style = mergeConfig(DEFAULT_STYLE_PRESET, baseline.style || {});
  baseline.style.typeStyles = buildDefaultTypeStyles(baseline.style);

  return baseline;
};

function applyUrlPresetToTarget(target, preset) {
  if (MESSAGE_THEME_PRESETS[preset]) {
    applyMessageThemePresetTo(target, preset);
    return true;
  }

  if (COMPOSITION_PRESETS[preset]) {
    applyCompositionPresetTo(target, preset);
    return true;
  }

  if (preset === "stealth") {
    applyStealthPresetTo(target);
    return true;
  }

  if (preset === "minimal") {
    applyMinimalPresetTo(target);
    return true;
  }

  return false;
}

window.getChatPresetConfigValue = function (preset, path) {
  const baseline = window.getChatDefaultConfigSnapshot();

  if (!applyUrlPresetToTarget(baseline, preset)) {
    return undefined;
  }

  return cloneConfigValue(getDeepValue(baseline, path));
};

window.getChatPresetConfigSnapshot = function (preset) {
  const baseline = window.getChatDefaultConfigSnapshot();

  if (!applyUrlPresetToTarget(baseline, preset)) {
    return undefined;
  }

  return baseline;
};

function isRainbowTypeStylePath(path) {
  return String(path || "").startsWith("style.typeStyles.special.rainbow.");
}

function isRainbowTypeDefaultSourcePath(path) {
  const value = String(path || "");

  return (
    value.startsWith("style.colors.rainbow.") ||
    value === "style.colors.effects.highlightGlow" ||
    value === "style.colors.effects.highlightWarmGlow" ||
    value === "style.colors.effects.tiktokRed" ||
    value === "style.colors.surfaces.avatarBorder"
  );
}

function hasRainbowTypeStyleManualOverrides(styleConfig = {}) {
  const current = styleConfig?.typeStyles?.special?.rainbow;

  if (!current) return false;

  const defaults = buildDefaultTypeStyles(styleConfig).special?.rainbow;
  return hasTypeStyleOverrides(current, defaults);
}

function syncRainbowTypeStyleDefaults(target) {
  const defaults = buildDefaultTypeStyles(target.style || {}).special?.rainbow;

  if (!defaults) return;

  setDeepValue(target, "style.typeStyles.special.rainbow", cloneConfigValue(defaults));
}

function isLegacyRainbowPurpleValue(value) {
  const normalized = normalizeCssColorToHex(value);

  return [
    "#9146ff",
    "#8d05c3",
    "#5524aa",
    "#4928a5",
    "#32157a"
  ].includes(normalized);
}

function normalizeCssColorToHex(value) {
  const text = String(value || "").trim().toLowerCase();

  if (/^#[0-9a-f]{3}$/.test(text)) {
    return `#${text[1]}${text[1]}${text[2]}${text[2]}${text[3]}${text[3]}`;
  }

  if (/^#[0-9a-f]{6}$/.test(text)) {
    return text;
  }

  const rgb = text.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/);

  if (!rgb) return text;

  return `#${rgb
    .slice(1, 4)
    .map(channel => Math.max(0, Math.min(255, Math.round(Number(channel) || 0)))
      .toString(16)
      .padStart(2, "0"))
    .join("")}`;
}

function repairRainbowTypeStyle(target) {
  const rainbowStyle = target.style?.typeStyles?.special?.rainbow;

  if (!rainbowStyle) return;

  const defaults = buildDefaultTypeStyles(target.style || {}).special?.rainbow;

  if (!defaults) return;

  const poisoned =
    isLegacyRainbowPurpleValue(rainbowStyle.titleBgColor) ||
    isLegacyRainbowPurpleValue(rainbowStyle.titleBgColor2) ||
    isLegacyRainbowPurpleValue(rainbowStyle.titleBgColor3) ||
    isLegacyRainbowPurpleValue(rainbowStyle.titleBgColor4) ||
    isLegacyRainbowPurpleValue(rainbowStyle.titleIconBgColor) ||
    isLegacyRainbowPurpleValue(rainbowStyle.titleIconBgColor2) ||
    isLegacyRainbowPurpleValue(rainbowStyle.titleIconBgColor3) ||
    isLegacyRainbowPurpleValue(rainbowStyle.titleIconBgColor4) ||
    isLegacyRainbowPurpleValue(rainbowStyle.titleGlowColor) ||
    isLegacyRainbowPurpleValue(rainbowStyle.titleBorderColor) ||
    isLegacyRainbowPurpleValue(rainbowStyle.avatarGlowColor) ||
    isLegacyRainbowPurpleValue(rainbowStyle.messageGlowColor);

  if (!poisoned) return;

  [
    "avatarGlow",
    "titleGlow",
    "titleBorder",
    "titleBg",
    "titleIconBg",
    "messageGlow"
  ].forEach(prefix => {
    getTypeGradientStyleKeys(prefix).forEach(key => {
      rainbowStyle[key] = cloneConfigValue(defaults[key]);
    });
  });
}

function syncAlertGroupTypes(path, value) {
  const match = String(path || "").match(/^behaviour\.alerts\.(twitch|youtube|tiktok)\.enabled$/);

  if (!match) return;

  const group = match[1];

  ALERT_GROUP_TYPES[group].forEach(type => {
    setDeepValue(cfg, `behaviour.alerts.${group}.${type}`, !!value);
  });
}

function syncSourceGroupTypes(path, value) {
  const match = String(path || "").match(/^behaviour\.sources\.(twitch|youtube|tiktok|kick)$/);

  if (!match) return;

  const group = match[1];

  setDeepValue(cfg, `behaviour.chat.${group}`, !!value);
  if (!ALERT_GROUP_TYPES[group]) return;

  setDeepValue(cfg, `behaviour.alerts.${group}.enabled`, !!value);

  ALERT_GROUP_TYPES[group].forEach(type => {
    setDeepValue(cfg, `behaviour.alerts.${group}.${type}`, !!value);
  });
}

window.sendStackedMessageTest = function () {
  const twitchAvatar = fallbackAvatar("Twitch", "StackedTest");

  [
    "Stacked message test 1",
    "Stacked message test 2",
    "Stacked message test 3"
  ].forEach(message => {
    handleStreamerBotEvent({
      event: { source: "Twitch", type: "ChatMessage" },
      data: {
        __demo: true,
        userName: "StackedTestPig",
        login: "stackedtestpig",
        displayName: "StackedTestPig",
        message,
        profileImageUrl: twitchAvatar,
        isModerator: true,
        badges: [{ name: "Moderator", text: "MOD" }]
      }
    });
  });
};

function handleAutoScrollContainerScroll() {
  if (cfg.behaviour.autoScroll === false && !cfg.scrollTest?.autoScroll) return;
  if (Date.now() < autoScrollIgnoreUntil) return;

  if (isNearPageBottom()) {
    resumeScrollTestAutoScroll(false);
  } else {
    pauseScrollTestAutoScroll();
  }
}

function handleAutoScrollManualInput() {
  if (cfg.behaviour.autoScroll === false && !cfg.scrollTest?.autoScroll) return;

  autoScrollIgnoreUntil = 0;
  pauseScrollTestAutoScroll();
}

window.handleAutoScrollContainerScroll = handleAutoScrollContainerScroll;
window.handleAutoScrollManualInput = handleAutoScrollManualInput;
window.addEventListener("scroll", handleAutoScrollContainerScroll, { passive: true });
["wheel", "touchstart", "pointerdown"].forEach(eventName => {
  window.addEventListener(eventName, handleAutoScrollManualInput, { passive: true });
});

function connect() {
  showConnectionToast(
    "streamerbot",
    "Connecting to Streamer.bot...",
    "#9146ff"
  );

  ws = new WebSocket(SB_WS);

  ws.onopen = () => {
    console.log("Connected to Streamer.bot WebSocket");

    showConnectionToast(
      "streamerbot",
      "Streamer.bot connected",
      "#2cff8a",
      1800
    );

    ws.send(JSON.stringify({
      request: "Subscribe",
      id: "kinggumption-multichat-subscribe",
      events: SUBSCRIPTIONS
    }));
  };

  ws.onclose = () => {
    console.log("Streamer.bot disconnected. Reconnecting...");

    showConnectionToast(
      "streamerbot",
      "Streamer.bot disconnected — reconnecting...",
      "#9146ff"
    );

    setTimeout(connect, cfg.streamerbot.reconnectMs);
  };

  ws.onmessage = (event) => {
    let payload;

    try {
      payload = JSON.parse(event.data);
    } catch {
      return;
    }

    console.log("SB EVENT:", payload);
    handleStreamerBotEvent(payload);
  };

  ws.onerror = (err) => {
    console.error("Streamer.bot WebSocket error:", err);

    showConnectionToast(
      "streamerbot",
      "Streamer.bot connection error",
      "#ff3355"
    );
  };
}


window.testChat = function (platform = "twitch", message = "Test message") {

  const sourceMap = {
    twitch: "Twitch",
    youtube: "YouTube",
    tiktok: "TikTok",
    kick: "Kick"
  };

  const payload = {
    event: {
      source: sourceMap[platform] || "Twitch",

      type:
        platform === "youtube"
          ? "Message"
          : platform === "kick"
            ? "ChatMessage"
          : "ChatMessage"
    },

    data: {
      platform,
      userName: `${platform.toLocaleLowerCase()}tester`,
      login: `${platform.toLowerCase()}tester`,
      displayName: `${platform.toLocaleLowerCase()}tester`,
      message,
      profileImageUrl: "",
      isOwner: platform === "youtube",
      isModerator: platform !== "youtube",
      isSubscriber: platform === "twitch",
      badges: [],
      __demo: true
    }
  };

  console.log("TEST CHAT:", payload);

  handleStreamerBotEvent(payload);
};

function startScrollTestMessages(options = {}) {
  if (!cfg.scrollTest?.enabled || scrollTestTimer) return;

  const { sendImmediately = true } = options;
  const fixtures = createScrollTestFixtures().filter(shouldSendScrollTestFixture);
  let index = 0;

  if (fixtures.length === 0) {
    console.log("Scroll test messages skipped: no enabled fixture types");
    return;
  }

  const send = () => {
    if (scrollTestStopped) return;

    fixtures[index % fixtures.length]();

    index += 1;
  };

  if (sendImmediately) {
    send();
  }

  scrollTestTimer = setInterval(send, Number(cfg.scrollTest.intervalMs) || 1300);
}

function createScrollTestFixtures() {
  const twitchBadges = [
    { name: "Broadcaster", text: "BROAD" },
    { name: "Moderator", text: "MOD" },
    { name: "VIP", text: "VIP" },
    { name: "Subscriber", text: "SUB" },
    { name: "Founder", text: "FOUND" }
  ];
  const twitchAvatar = fallbackAvatar("Twitch", "Demo");
  const youtubeAvatar = fallbackAvatar("YouTube", "Demo");
  const tiktokAvatar = fallbackAvatar("TikTok", "Demo");
  const kickAvatar = fallbackAvatar("Kick", "Demo");

  const sb = (source, type, data, options = {}) => {
    const payloadData = {
      __demo: true,
      ...data
    };
    const demoItem = getScrollTestStreamerBotItem(source, type, payloadData);
    const send = () => handleStreamerBotEvent({
      event: { source, type },
      data: payloadData
    });

    assignScrollTestFixtureMeta(send, [demoItem], {
      source: normaliseDemoSource(source),
      requires: options.requires || []
    });
    return send;
  };

  const tik = (event, data, options = {}) => {
    const payloadData = {
      __demo: true,
      ...data
    };
    const demoItem = getScrollTestTikFinityItem(event);
    const send = () => handleTikFinityEvent({
      event,
      data: payloadData
    });

    assignScrollTestFixtureMeta(send, [demoItem], {
      source: "tiktok",
      requires: options.requires || []
    });
    return send;
  };
  const burst = (...events) => {
    const send = () => events.forEach(sendEvent => sendEvent());

    assignScrollTestFixtureMeta(send, events.flatMap(event => event.demoItems || []), {
      source: events[0]?.demoSource || "other",
      grouped: true
    });
    return send;
  };

  return interleaveScrollTestFixtures([
    sb("Twitch", "ChatMessage", {
      userName: "BroadcasterPig",
      login: "broadcasterpig",
      displayName: "BroadcasterPig",
      message: "Broadcaster badge and owner-level image permission",
      profileImageUrl: twitchAvatar,
      isBroadcaster: true,
      badges: [twitchBadges[0]]
    }),
    sb("Twitch", "ChatMessage", {
      userName: "ModPig",
      login: "modpig",
      displayName: "ModPig",
      message: "Moderator badge with Tenor GIF https://tenor.com/view/oh-wow-you-dont-say-michael-office-wow-michael-scott-gif-11124235989547302113",
      profileImageUrl: twitchAvatar,
      isModerator: true,
      badges: [twitchBadges[1]]
    }, { requires: ["imageEmbeds"] }),
    sb("Twitch", "ChatMessage", {
      userName: "VipPig",
      login: "vippig",
      displayName: "VipPig",
      message: "VIP badge represented in the name bubble",
      profileImageUrl: twitchAvatar,
      badges: [twitchBadges[2]]
    }),
    sb("Twitch", "ChatMessage", {
      userName: "SubPig",
      login: "subpig",
      displayName: "SubPig",
      message: "Subscriber and founder badge stack",
      profileImageUrl: twitchAvatar,
      isSubscriber: true,
      badges: [twitchBadges[3], twitchBadges[4]]
    }),
    sb("Twitch", "SharedChatMessage", {
      userName: "NeighborPig",
      login: "neighborpig",
      displayName: "NeighborPig",
      message: "Shared chat message should say which chat it came from",
      profileImageUrl: twitchAvatar,
      sourceRoom: {
        displayName: "CozyChannel"
      },
      badges: [twitchBadges[2]]
    }),
    burst(
      sb("Twitch", "ChatMessage", {
        userName: "StackedTwitchPig",
        login: "stackedtwitchpig",
        displayName: "StackedTwitchPig",
        message: "Stacked message 1 from the same Twitch user",
        profileImageUrl: twitchAvatar,
        isModerator: true,
        badges: [twitchBadges[1]]
      }),
      sb("Twitch", "ChatMessage", {
        userName: "StackedTwitchPig",
        login: "stackedtwitchpig",
        displayName: "StackedTwitchPig",
        message: "Stacked message 2 should attach beneath it",
        profileImageUrl: twitchAvatar,
        isModerator: true,
        badges: [twitchBadges[1]]
      }),
      sb("Twitch", "ChatMessage", {
        userName: "StackedTwitchPig",
        login: "stackedtwitchpig",
        displayName: "StackedTwitchPig",
        message: "Stacked message 3 tests repeated bubbles",
        profileImageUrl: twitchAvatar,
        isModerator: true,
        badges: [twitchBadges[1]]
      })
    ),
    sb("Twitch", "ChatMessage", {
      userName: "EmotePig",
      login: "emotepig",
      displayName: "EmotePig",
      message: "Kappa",
      profileImageUrl: twitchAvatar,
      isModerator: true,
      badges: [twitchBadges[1]],
      parts: [
        {
          type: "emote",
          text: "Kappa",
          imageUrl: "icons/platforms/twitch-white.png"
        }
      ]
    }),
    sb("Twitch", "PowerUp", {
      userName: "EmotePig",
      login: "emotepig",
      displayName: "EmotePig",
      rewardType: "gigantify_an_emote",
      message_text: "Kappa",
      gigantifiedEmoteUrl: "icons/platforms/twitch-white.png",
      profileImageUrl: twitchAvatar,
      badges: [twitchBadges[1]]
    }, { requires: ["gigantified"] }),
    sb("Twitch", "RewardRedemption", {
      userName: "RainbowPig",
      displayName: "RainbowPig",
      rewardTitle: "Highlight My Message",
      input: "Highlighted/rainbow message state"
    }),
    sb("Twitch", "RewardRedemption", {
      userName: "RewardPig",
      displayName: "RewardPig",
      rewardTitle: "Hydrate",
      reward: {
        cost: 500
      }
    }),
    ...["default", "primary", "blue", "green", "orange", "purple"].map(color =>
      sb("Twitch", "Announcement", {
        userName: "AnnouncementPig",
        displayName: "AnnouncementPig",
        text: `${color.charAt(0).toUpperCase() + color.slice(1)} Twitch announcement styling`,
        color,
        badges: [twitchBadges[0]]
      })
    ),
    sb("Twitch", "Follow", {
      userName: "NewFollowerPig",
      displayName: "NewFollowerPig"
    }),
    sb("Twitch", "Sub", {
      userName: "SubAlertPig",
      displayName: "SubAlertPig",
      months: 1
    }),
    sb("Twitch", "ReSub", {
      userName: "ResubPig",
      displayName: "ResubPig",
      months: 12
    }),
    sb("Twitch", "Cheer", {
      userName: "BitsPig",
      displayName: "BitsPig",
      bits: 500
    }),
    sb("Twitch", "Raid", {
      userName: "RaidPig",
      displayName: "RaidPig",
      viewers: 42
    }),
    sb("Twitch", "WatchStreak", {
      userName: "StreakPig",
      displayName: "StreakPig",
      streak_count: 5,
      systemMessage: "StreakPig watched 5 consecutive streams this month and sparked a watch streak!"
    }),
    sb("Twitch", "HypeTrainStart", {
      userName: "HypePig",
      displayName: "HypePig",
      level: 1,
      systemMessage: "A hype train started"
    }),
    sb("Twitch", "CharityDonation", {
      userName: "CharityPig",
      displayName: "CharityPig",
      charity: {
        amount: {
          value: "10.00",
          currency: "GBP"
        }
      },
      systemMessage: "CharityPig donated to the campaign"
    }),
    sb("Twitch", "GiftBomb", {
      userName: "GiftBombPig",
      displayName: "GiftBombPig",
      total: 5
    }),
    sb("Twitch", "GiftSub", {
      userName: "GiftSubPig",
      displayName: "GiftSubPig",
      amount: 1
    }),
    sb("YouTube", "Message", {
      displayName: "OwnerPig",
      message: "YouTube owner badge plus visible URL https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      profileImageUrl: youtubeAvatar,
      isOwner: true
    }, { requires: ["linkPreviews"] }),
    sb("YouTube", "Message", {
      displayName: "ModMemberPig",
      message: "YouTube moderator/member/verified badges",
      profileImageUrl: youtubeAvatar,
      isModerator: true,
      isMember: true,
      isVerified: true
    }),
    sb("YouTube", "SuperChat", {
      displayName: "SuperChatPig",
      message: "Super chat alert body",
      amountDisplayString: "GBP 5.00",
      profileImageUrl: youtubeAvatar
    }),
    sb("YouTube", "SuperSticker", {
      displayName: "StickerPig",
      amountDisplayString: "$2.00",
      profileImageUrl: youtubeAvatar
    }),
    sb("YouTube", "NewSponsor", {
      displayName: "MemberPig",
      profileImageUrl: youtubeAvatar
    }),
    sb("YouTube", "PollStarted", {
      displayName: "Poll Pig",
      title: "What should we play next?",
      question: "What should we play next?",
      profileImageUrl: youtubeAvatar
    }),
    sb("YouTube", "BroadcastStarted", {
      displayName: "Channel Pig",
      title: "YouTube stream is live",
      profileImageUrl: youtubeAvatar
    }),
    sb("Kick", "ChatMessage", {
      user: {
        name: "Kick Chat Pig",
        login: "kickchatpig",
        profilePicture: kickAvatar,
        role: 1,
        isSubscribed: false,
        badges: []
      },
      text: "Kick standard chat message",
      messageId: "kick-demo-chat-1"
    }),
    sb("Kick", "ChatMessage", {
      user: {
        name: "Kick VIP Pig",
        login: "kickvippig",
        profilePicture: kickAvatar,
        role: 2,
        isSubscribed: true,
        badges: [{ name: "VIP", text: "VIP" }]
      },
      text: "Kick VIP/subscriber message with the platform logo and green styling",
      messageId: "kick-demo-chat-2"
    }),
    burst(
      sb("Kick", "ChatMessage", {
        user: {
          name: "Stacked Kick Pig",
          login: "stackedkickpig",
          profilePicture: kickAvatar,
          role: 3,
          isSubscribed: true,
          badges: [{ name: "Moderator", text: "MOD" }]
        },
        text: "Kick stacked message 1",
        messageId: "kick-stacked-1"
      }),
      sb("Kick", "ChatMessage", {
        user: {
          name: "Stacked Kick Pig",
          login: "stackedkickpig",
          profilePicture: kickAvatar,
          role: 3,
          isSubscribed: true,
          badges: [{ name: "Moderator", text: "MOD" }]
        },
        text: "Kick stacked message 2",
        messageId: "kick-stacked-2"
      }),
      sb("Kick", "ChatMessage", {
        user: {
          name: "Stacked Kick Pig",
          login: "stackedkickpig",
          profilePicture: kickAvatar,
          role: 3,
          isSubscribed: true,
          badges: [{ name: "Moderator", text: "MOD" }]
        },
        text: "Kick stacked message 3",
        messageId: "kick-stacked-3"
      })
    ),
    sb("Kick", "Follow", {
      user: {
        name: "Kick Follow Pig",
        login: "kickfollowpig",
        profilePicture: kickAvatar,
        role: 1,
        isSubscribed: false
      },
      timestamp: new Date().toISOString()
    }),
    sb("Kick", "Subscription", {
      user: {
        name: "Kick Sub Pig",
        login: "kicksubpig",
        profilePicture: kickAvatar,
        role: 1,
        isSubscribed: true
      },
      duration: 1,
      subscribedAt: new Date().toISOString()
    }),
    sb("Kick", "Resubscription", {
      user: {
        name: "Kick Resub Pig",
        login: "kickresubpig",
        profilePicture: kickAvatar,
        role: 1,
        isSubscribed: true
      },
      duration: 8,
      subscribedAt: new Date().toISOString()
    }),
    sb("Kick", "GiftSubscription", {
      user: {
        name: "Kick Gift Pig",
        login: "kickgiftpig",
        profilePicture: kickAvatar,
        role: 1,
        isSubscribed: true
      },
      recipient: {
        name: "Lucky Kick Pig",
        login: "luckykickpig",
        profilePicture: kickAvatar,
        role: 1,
        isSubscribed: true
      },
      subscribedAt: new Date().toISOString()
    }),
    sb("Kick", "MassGiftSubscription", {
      user: {
        name: "Kick Mass Gift Pig",
        login: "kickmassgiftpig",
        profilePicture: kickAvatar,
        role: 1,
        isSubscribed: true
      },
      recipients: [
        { name: "Gifted Kick Pig 1", login: "giftedkickpig1" },
        { name: "Gifted Kick Pig 2", login: "giftedkickpig2" },
        { name: "Gifted Kick Pig 3", login: "giftedkickpig3" }
      ],
      subscribedAt: new Date().toISOString()
    }),
    sb("Kick", "RewardRedemption", {
      user: {
        name: "Kick Reward Pig",
        login: "kickrewardpig",
        profilePicture: kickAvatar,
        role: 1,
        isSubscribed: true
      },
      reward: { title: "Hydrate" },
      input: "Kick reward redemption preview",
      timestamp: new Date().toISOString()
    }),
    sb("Kick", "StreamOnline", {
      user: {
        name: "Kick Live Pig",
        login: "kicklivepig",
        profilePicture: kickAvatar
      },
      title: "Kick stream is online",
      timestamp: new Date().toISOString()
    }),
    sb("Streamlabs", "Donation", {
      username: "StreamlabsDonor",
      amount: 12.34,
      avatar: "",
      message: "Donation/service alert styling"
    }),
    sb("StreamElements", "Tip", {
      username: "StreamElementsDonor",
      amount: 5,
      avatar: "",
      message: "StreamElements tip alert"
    }),
    sb("Ko-fi", "Donation", {
      username: "KofiDonor",
      amount: 3,
      avatar: "",
      message: "Ko-fi themed donation alert"
    }),
    sb("TipeeeStream", "Donation", {
      username: "TipeeeDonor",
      amount: 8,
      avatar: "",
      message: "TipeeeStream donation alert"
    }),
    sb("Fourthwall", "Donation", {
      username: "FourthwallDonor",
      amount: 15,
      avatar: "",
      message: "Fourthwall donation alert"
    }),
    sb("Patreon", "PledgeCreated", {
      username: "PatreonPatron",
      amount: 7,
      avatar: "",
      message: "Patreon pledge alert"
    }),
    sb("DonorDrive", "Donation", {
      username: "DonorDriveDonor",
      amount: 20,
      avatar: "",
      message: "DonorDrive donation alert"
    }),
    tik("chat", {
      nickname: "TikTok Chat Pig",
      uniqueId: "tiktokchatpig",
      profilePictureUrl: tiktokAvatar,
      comment: "TikTok standard chat message"
    }),
    tik("chat", {
      nickname: "Grouped Pig",
      uniqueId: "groupedpig",
      profilePictureUrl: tiktokAvatar,
      comment: "First grouped TikTok message"
    }),
    tik("chat", {
      nickname: "Grouped Pig",
      uniqueId: "groupedpig",
      profilePictureUrl: tiktokAvatar,
      comment: "Second grouped TikTok message"
    }),
    burst(
      tik("chat", {
        nickname: "Stacked TikTok Pig",
        uniqueId: "stackedtiktokpig",
        profilePictureUrl: tiktokAvatar,
        comment: "TikTok stacked message 1"
      }),
      tik("chat", {
        nickname: "Stacked TikTok Pig",
        uniqueId: "stackedtiktokpig",
        profilePictureUrl: tiktokAvatar,
        comment: "TikTok stacked message 2"
      }),
      tik("chat", {
        nickname: "Stacked TikTok Pig",
        uniqueId: "stackedtiktokpig",
        profilePictureUrl: tiktokAvatar,
        comment: "TikTok stacked message 3"
      })
    ),
    tik("chat", {
      nickname: "TikTok Emote Pig",
      uniqueId: "tiktokemotepig",
      profilePictureUrl: tiktokAvatar,
      comment: "[wow][laugh][rockycool][rosiecute][sageclever]",
      emotes: [
        { emoteImageUrl: "icons/tt-emotes/wow.png", emoteId: "wow" },
        { emoteImageUrl: "icons/tt-emotes/laugh.png", emoteId: "laugh" },
        { emoteImageUrl: "icons/tt-emotes/rockycool.png", emoteId: "rockycool" },
        { emoteImageUrl: "icons/tt-emotes/rosiecute.png", emoteId: "rosiecute" },
        { emoteImageUrl: "icons/tt-emotes/sageclever.png", emoteId: "sageclever" }
      ]
    }),
    tik("gift", {
      nickname: "Tier 1 Gift Pig",
      uniqueId: "tier1giftpig",
      profilePictureUrl: tiktokAvatar,
      giftName: "Rose",
      repeatCount: 1,
      diamondCount: 1,
      giftType: 2
    }),
    tik("gift", {
      nickname: "Tier 4 Gift Pig",
      uniqueId: "tier4giftpig",
      profilePictureUrl: tiktokAvatar,
      giftName: "Mega Pig Gift",
      repeatCount: 3,
      diamondCount: 1000,
      giftType: 2
    }),
    tik("follow", {
      nickname: "TikTok Follow Pig",
      uniqueId: "tiktokfollowpig",
      profilePictureUrl: tiktokAvatar
    }),
    tik("subscribe", {
      nickname: "TikTok Subscriber Pig",
      uniqueId: "tiktoksubscriberpig",
      profilePictureUrl: tiktokAvatar
    }),
    tik("envelope", {
      nickname: "Treasure Pig",
      uniqueId: "treasurepig",
      profilePictureUrl: tiktokAvatar,
      coins: 20
    }),
    tik("share", {
      nickname: "Share Pig",
      uniqueId: "sharepig",
      profilePictureUrl: tiktokAvatar,
      message: "shared the LIVE"
    }),
    tik("member", {
      nickname: "Join Pig",
      uniqueId: "joinpig",
      profilePictureUrl: tiktokAvatar,
      action: "joined"
    }),
    tik("questionNew", {
      nickname: "Question Pig",
      uniqueId: "questionpig",
      profilePictureUrl: tiktokAvatar,
      question: "Can we see the score?"
    }),
    tik("chat", {
      nickname: "LongNamePigWithAnExtremelyLongTikTokUsername",
      uniqueId: "longnamepig",
      profilePictureUrl: tiktokAvatar,
      comment: "This is a long wrapping message so widths, names, and fit-to-screen can be inspected without guessing."
    }),
    sb("Twitch", "ChatMessage", {
      userName: "ImagePig",
      login: "imagepig",
      displayName: "ImagePig",
      message: "Direct image embed https://placehold.co/640x360.png",
      profileImageUrl: twitchAvatar,
      isModerator: true,
      badges: [twitchBadges[1]]
    }, { requires: ["imageEmbeds"] }),
    sb("Twitch", "ChatMessage", {
      userName: "VideoPig",
      login: "videopig",
      displayName: "VideoPig",
      message: "Direct video embed https://media.tenor.com/AvrrJb-Kx4kAAAPo/shook-distraught.mp4",
      profileImageUrl: twitchAvatar,
      isModerator: true,
      badges: [twitchBadges[1]]
    }, { requires: ["imageEmbeds"] })
  ]);
}

function assignScrollTestFixtureMeta(send, items, options = {}) {
  send.demoSource = options.source || normaliseDemoSource(items[0]?.platform);
  send.demoItems = items.filter(Boolean);
  send.demoRequires = options.requires || [];
  send.demoGrouped = !!options.grouped;
}

function getScrollTestStreamerBotItem(source, type, data) {
  const platform = normaliseScrollTestPlatform(source);
  const alertType = getScrollTestAlertType(source, type);

  if (alertType) {
    return {
      kind: alertType.startsWith("tiktok.gifts") ? "tiktokGift" : "alert",
      platform,
      alertType
    };
  }

  return normaliseEvent(source, type, data) || {
    kind: "chat",
    platform
  };
}

function getScrollTestTikFinityItem(event) {
  const type = String(event || "").toLowerCase();

  if (type.includes("chat") || type.includes("comment") || type.includes("emote")) {
    return {
      kind: "chat",
      platform: "TikTok"
    };
  }

  if (type === "envelope" || type.includes("treasure")) {
    return {
      kind: "tiktokGift",
      platform: "TikTok",
      alertType: "tiktok.treasureBoxes"
    };
  }

  if (type.includes("gift")) {
    return {
      kind: "tiktokGift",
      platform: "TikTok",
      alertType: "tiktok.gifts"
    };
  }

  if (type.includes("like")) {
    return {
      kind: "alert",
      platform: "TikTok",
      alertType: "tiktok.likes",
      title: "TikTok likes"
    };
  }

  if (type.includes("follow")) {
    return {
      kind: "alert",
      platform: "TikTok",
      alertType: "tiktok.follows"
    };
  }

  if (type.includes("subscribe") || type.includes("sub")) {
    return {
      kind: "alert",
      platform: "TikTok",
      alertType: "tiktok.subscribers"
    };
  }

  if (type.includes("share")) {
    return {
      kind: "alert",
      platform: "TikTok",
      alertType: "tiktok.shares"
    };
  }

  if (type.includes("member") || type.includes("join")) {
    return {
      kind: "alert",
      platform: "TikTok",
      alertType: "tiktok.joins"
    };
  }

  if (type.includes("question")) {
    return {
      kind: "alert",
      platform: "TikTok",
      alertType: "tiktok.questions"
    };
  }

  if (type.includes("goal")) {
    return {
      kind: "alert",
      platform: "TikTok",
      alertType: "tiktok.goals"
    };
  }

  if (type.includes("poll")) {
    return {
      kind: "alert",
      platform: "TikTok",
      alertType: "tiktok.polls"
    };
  }

  if (type.includes("battle") || type.includes("linkmic")) {
    return {
      kind: "alert",
      platform: "TikTok",
      alertType: "tiktok.battles"
    };
  }

  if (type.includes("streamend") || type.includes("liveintro") || type.includes("roommessage")) {
    return {
      kind: "alert",
      platform: "TikTok",
      alertType: "tiktok.stream"
    };
  }

  return null;
}

function normaliseScrollTestPlatform(source) {
  const key = String(source || "").toLowerCase().replace(/[^a-z0-9]/g, "");

  if (key === "youtube") return "YouTube";
  if (key === "tiktok" || key === "tikfinity") return "TikTok";
  if (key === "kick") return "Kick";
  if (key === "streamlabs") return "Streamlabs";
  if (key === "streamelements") return "StreamElements";
  if (key === "kofi") return "Ko-fi";
  if (key === "tipeeestream") return "TipeeeStream";
  if (key === "fourthwall") return "Fourthwall";
  if (key === "patreon") return "Patreon";
  if (key === "donordrive") return "DonorDrive";

  return "Twitch";
}

function getScrollTestAlertType(source, type) {
  const sourceKey = String(source || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const typeKey = String(type || "").toLowerCase();

  if (sourceKey === "twitch") {
    if (typeKey === "announcement") return "twitch.announcements";
    if (typeKey === "rewardredemption") return "twitch.channelPointRedemptions";
    if (typeKey === "cheer") return "twitch.cheers";
    if (typeKey === "follow") return "twitch.follows";
    if (typeKey === "sub" || typeKey === "resub") return "twitch.subs";
    if (typeKey === "giftsub" || typeKey === "giftbomb") return "twitch.giftSubs";
    if (typeKey === "raid") return "twitch.raids";
    if (typeKey === "watchstreak") {
      return cfg.behaviour.alerts?.twitch?.watchStreaks === false
        ? ""
        : getTwitchWatchStreakAlertType();
    }
    return "";
  }

  if (sourceKey === "youtube") {
    if (typeKey === "superchat") return "youtube.superChats";
    if (typeKey === "supersticker") return "youtube.superStickers";
    if (
      typeKey === "newsponsor" ||
      typeKey === "membermilestone" ||
      typeKey === "membershipgift" ||
      typeKey === "giftmembershipreceived"
    ) {
      return "youtube.members";
    }
    if (typeKey === "jewelsgifted") return "youtube.gifts";
    if (typeKey === "pollstarted" || typeKey === "pollupdated" || typeKey === "pollclosed") return "youtube.polls";
    if (
      typeKey.includes("broadcast") ||
      typeKey === "presentviewers" ||
      typeKey === "statisticsupdated"
    ) {
      return "youtube.stream";
    }
    if (typeKey === "userbanned" || typeKey === "usertimedout" || typeKey.includes("sponsoronly")) return "youtube.moderation";
    return "";
  }

  if (sourceKey === "kick") {
    if (typeKey === "follow") return "kick.follows";
    if (typeKey === "subscription" || typeKey === "resubscription") return "kick.subs";
    if (typeKey === "giftsubscription" || typeKey === "massgiftsubscription") return "kick.giftSubs";
    if (typeKey === "rewardredemption") return "kick.rewardRedemptions";
    if (typeKey.includes("stream") || typeKey.includes("channel") || typeKey === "viewercountupdate" || typeKey === "presentviewers") return "kick.stream";
    if (typeKey === "userbanned" || typeKey === "usertimedout") return "kick.moderation";
    return "";
  }

  const donationKey = getDonationAlertKey(source);

  if (
    [
      "streamlabs",
      "streamelements",
      "kofi",
      "tipeeestream",
      "fourthwall",
      "patreon",
      "donordrive"
    ].includes(donationKey)
  ) {
    return `donations.${donationKey}`;
  }

  return "";
}

function shouldSendScrollTestFixture(fixture) {
  if (fixture.demoGrouped && !cfg.behaviour.groupConsecutiveMessages) return false;

  if (fixture.demoRequires?.includes("imageEmbeds") && !cfg.behaviour.showImageEmbeds) {
    return false;
  }

  if (
    fixture.demoRequires?.includes("imageEmbeds") &&
    !(fixture.demoItems || []).some(item => item.kind === "chat" && canEmbedImage(item))
  ) {
    return false;
  }

  if (fixture.demoRequires?.includes("linkPreviews") && !cfg.behaviour.showLinkPreviews) {
    return false;
  }

  if (fixture.demoRequires?.includes("gigantified") && !cfg.gigantified.enabled) {
    return false;
  }

  const items = fixture.demoItems || [];

  if (items.length === 0) return true;

  return items.every(shouldSendScrollTestItem);
}

function shouldSendScrollTestItem(item) {
  if (item.kind === "chat") return shouldShowChat(item);
  if (item.kind === "alert" || item.kind === "tiktokGift") return shouldShowAlert(item);

  return true;
}

function normaliseDemoSource(source) {
  const key = String(source || "").toLowerCase();

  if (key === "twitch") return "twitch";
  if (key === "youtube") return "youtube";
  if (key === "kick") return "kick";
  if (key === "tiktok" || key === "tikfinity") return "tiktok";

  return "other";
}

function interleaveScrollTestFixtures(fixtures) {
  const buckets = {
    twitch: [],
    youtube: [],
    kick: [],
    tiktok: [],
    other: []
  };

  fixtures.forEach(fixture => {
    const key = fixture.demoSource || "other";
    (buckets[key] || buckets.other).push(fixture);
  });

  const order = ["twitch", "youtube", "kick", "tiktok", "other"];
  const output = [];

  while (order.some(key => buckets[key].length > 0)) {
    order.forEach(key => {
      const next = buckets[key].shift();
      if (next) output.push(next);
    });
  }

  return output;
}

function stopScrollTestMessages(reason = "Real message received") {
  if (scrollTestStopped) return;

  scrollTestStopped = true;

  if (scrollTestTimer) {
    clearInterval(scrollTestTimer);
    scrollTestTimer = null;
  }

  console.log(`Scroll test messages stopped: ${reason}`);
}

function restartActiveScrollTestMessages(options = {}) {
  if (!cfg.scrollTest?.enabled || scrollTestStopped) return;

  if (scrollTestTimer) {
    clearInterval(scrollTestTimer);
    scrollTestTimer = null;
  }

  startScrollTestMessages({ sendImmediately: options.sendImmediately === true });
}

function isScrollTestFilterConfigPath(path) {
  return [
    "behaviour.chat.",
    "behaviour.sources.",
    "behaviour.showAlerts",
    "behaviour.alerts.",
    "behaviour.imageEmbeds.",
    "behaviour.showImageEmbeds",
    "behaviour.showLinkPreviews",
    "behaviour.groupConsecutiveMessages",
    "gigantified.enabled"
  ].some(prefix => path.startsWith(prefix));
}

window.restartScrollTestMessages = function () {
  if (!cfg.scrollTest?.enabled) {
    console.warn("Scroll test messages are disabled.");
    return;
  }

  if (scrollTestTimer) {
    clearInterval(scrollTestTimer);
    scrollTestTimer = null;
  }

  scrollTestStopped = false;
  resumeScrollTestAutoScroll();
  startScrollTestMessages();
};

window.stopScrollTestMessages = stopScrollTestMessages;

window.testAll = function () {
  testChat("twitch", "Testing Twitch chat");
  testChat("youtube", "Testing YouTube chat");
  testChat("tiktok", "Testing TikTok chat");
  testChat("kick", "Testing Kick chat");
  testChat("twitch", "testing https://www.youtube.com/watch?v=dQw4w9WgXcQ");

  handleStreamerBotEvent({
    event: { source: "Twitch", type: "RewardRedemption" },
    data: {
      userName: "RainbowPig",
      displayName: "RainbowPig",
      rewardTitle: "Highlight My Message",
      input: "THIS SHOULD BE RAINBOW"
    }
  });

  handleStreamerBotEvent({
    event: { source: "Twitch", type: "RewardRedemption" },
    data: {
      userName: "RewardPig",
      displayName: "RewardPig",
      rewardTitle: "Hydrate",
      reward: {
        cost: 500
      }
    }
  });

  handleStreamerBotEvent({
    event: { source: "Twitch", type: "Follow" },
    data: {
      userName: "NewFollowerPig",
      displayName: "NewFollowerPig"
    }
  });

  handleStreamerBotEvent({
    event: { source: "Twitch", type: "Sub" },
    data: {
      userName: "SubPig",
      displayName: "SubPig",
      months: 1
    }
  });

  handleStreamerBotEvent({
    event: { source: "Twitch", type: "ReSub" },
    data: {
      userName: "LoyalPig",
      displayName: "LoyalPig",
      months: 12
    }
  });

  handleStreamerBotEvent({
    event: { source: "Twitch", type: "GiftSub" },
    data: {
      userName: "GiftSubPig",
      displayName: "GiftSubPig",
      amount: 1
    }
  });

  handleStreamerBotEvent({
    event: { source: "Twitch", type: "GiftBomb" },
    data: {
      userName: "GiftBombPig",
      displayName: "GiftBombPig",
      total: 5
    }
  });

  handleStreamerBotEvent({
    event: { source: "Twitch", type: "Cheer" },
    data: {
      userName: "BitsPig",
      displayName: "BitsPig",
      bits: 500
    }
  });

  ["default", "primary", "blue", "green", "orange", "purple"].forEach(color => {
    handleStreamerBotEvent({
      event: { source: "Twitch", type: "Announcement" },
      data: {
        userName: "AnnouncementPig",
        displayName: "AnnouncementPig",
        text: `This is a ${color} announcement`,
        color
      }
    });
  });

  handleStreamerBotEvent({
    event: { source: "Twitch", type: "Raid" },
    data: {
      userName: "RaidPig",
      displayName: "RaidPig",
      viewers: 42
    }
  });

  handleStreamerBotEvent({
    event: { source: "Twitch", type: "WatchStreak" },
    data: {
      userName: "StreakPig",
      displayName: "StreakPig",
      streak_count: 5,
      systemMessage: "StreakPig watched 5 consecutive streams this month and sparked a watch streak!"
    }
  });

  handleStreamerBotEvent({
    event: { source: "YouTube", type: "SuperChat" },
    data: {
      displayName: "SuperChatPig",
      message: "Here is some money!",
      amountDisplayString: "£5.00"
    }
  });

  handleStreamerBotEvent({
    event: { source: "YouTube", type: "SuperSticker" },
    data: {
      displayName: "StickerPig",
      amountDisplayString: "$2.00"
    }
  });

  handleStreamerBotEvent({
    event: { source: "YouTube", type: "NewSponsor" },
    data: {
      displayName: "MemberPig"
    }
  });

  handleStreamerBotEvent({
    event: { source: "Streamlabs", type: "Donation" },
    data: {
      username: "StreamlabsDonor",
      amount: 12.34,
      avatar: "",
      message: "Amazing content!"
    }
  });

  handleStreamerBotEvent({
    event: { source: "StreamElements", type: "Tip" },
    data: {
      username: "StreamElementsDonor",
      amount: 5,
      avatar: "",
      message: "Love the stream!"
    }
  });

  handleStreamerBotEvent({
    event: { source: "Ko-fi", type: "Donation" },
    data: {
      username: "KofiDonor",
      amount: 3,
      avatar: "",
      message: "Keep it up!"
    }
  });

  handleStreamerBotEvent({
    event: { source: "TipeeeStream", type: "Donation" },
    data: {
      username: "TipeeeDonor",
      amount: 8,
      avatar: "",
      message: "Big love!"
    }
  });

  handleStreamerBotEvent({
    event: { source: "Fourthwall", type: "Donation" },
    data: {
      username: "FourthwallDonor",
      amount: 15,
      avatar: "",
      message: "Great overlay!"
    }
  });

  handleStreamerBotEvent({
    event: { source: "Patreon", type: "PledgeCreated" },
    data: {
      username: "PatreonPatron",
      amount: 7,
      avatar: "",
      message: "Pledge support!"
    }
  });

  handleStreamerBotEvent({
    event: { source: "DonorDrive", type: "Donation" },
    data: {
      username: "DonorDriveDonor",
      amount: 20,
      avatar: "",
      message: "Happy to help!"
    }
  });

  handleStreamerBotEvent({
    event: { source: "TikTok", type: "Gift" },
    data: {
      nickname: "Gift Pig",
      giftName: "Rose",
      repeatCount: 10
    }
  });

  handleTikFinityEvent({
    event: "follow",
    data: {
      nickname: "TikTok Follow Pig",
      uniqueId: "tiktokfollowpig",
      profilePictureUrl: ""
    }
  });

  handleTikFinityEvent({
    event: "subscribe",
    data: {
      nickname: "TikTok Subscriber Pig",
      uniqueId: "tiktoksubscriberpig"
    }
  });

  handleTikFinityEvent({
    event: "envelope",
    data: {
      nickname: "Treasure Pig",
      uniqueId: "treasurepig",
      coins: 20
    }
  });

  handleTikFinityEvent({
    event: "chat",
    data: {
      nickname: "Emote Pig",
      uniqueId: "emotepig",
      comment: " ",
      emotes: [
        {
          emoteId: "7551778175766055683",
          emoteImageUrl: "icons/platforms/tiktok.png"
        }
      ]
    }
  });



  // TikTok fan club emote
  handleTikFinityEvent({
    event: "chat",
    data: {
      nickname: "Emote Pig",
      uniqueId: "emotepig",
      comment: " ",
      emotes: [
        {
          emoteId: "7551778175766055683",
          emoteImageUrl:
            "icons/icons/tiktok.png"
        }
      ]
    }
  });

  // grouped messages
  handleTikFinityEvent({
    event: "chat",
    data: {
      nickname: "Grouped Pig",
      uniqueId: "groupedpig",
      comment: "First grouped message"
    }
  });

  handleTikFinityEvent({
    event: "chat",
    data: {
      nickname: "Grouped Pig",
      uniqueId: "groupedpig",
      comment: "Second grouped message"
    }
  });

  // long wrapped username
  handleTikFinityEvent({
    event: "chat",
    data: {
      nickname:
        "ThisIsAnExtremelyLongTikTokUsernamePig",
      uniqueId: "longnamepig",
      comment: "Testing wrapped usernames"
    }
  });

  // long wrapped message
  handleTikFinityEvent({
    event: "chat",
    data: {
      nickname: "Long Message Pig",
      uniqueId: "longmessagepig",

      comment:
        "This is a very long message designed to test wrapping behaviour and spacing consistency when OBS scales the browser source down very small."
    }
  });

  // emote only message
  handleTikFinityEvent({
    event: "chat",
    data: {
      nickname: "Emoji Pig",
      uniqueId: "emojipig",
      comment: "😂😂😂😂😂"
    }
  });

  // multiple alerts stacked
  handleTikFinityEvent({
    event: "follow",
    data: {
      nickname: "Alert Pig 1",
      uniqueId: "alertpig1"
    }
  });

  handleTikFinityEvent({
    event: "follow",
    data: {
      nickname: "Alert Pig 2",
      uniqueId: "alertpig2"
    }
  });

  handleTikFinityEvent({
    event: "envelope",
    data: {
      nickname: "Treasure Pig",
      uniqueId: "treasurepig",
      coins: 20
    }
  });

  handleTikFinityEvent({
    event: "chat",
    data: {
      nickname: "Delete Test Pig",
      uniqueId: "deletetestpig",
      userId: "delete-test-user-1",
      msgId: "delete-test-message-1",
      comment: "This message should disappear"
    }
  });

  setTimeout(() => {
    handleTikFinityEvent({
      event: "imDelete",
      data: {
        deleteMsgIdsList: ["delete-test-message-1"],
        deleteUserIdsList: []
      }
    });
  }, 1500);

  handleTikFinityEvent({
    event: "chat",
    data: {
      nickname: "Timeout Test Pig",
      uniqueId: "timeouttestpig",
      userId: "timeout-test-user-1",
      msgId: "timeout-test-message-1",
      comment: "Message 1 from timeout user"
    }
  });

  handleTikFinityEvent({
    event: "chat",
    data: {
      nickname: "Timeout Test Pig",
      uniqueId: "timeouttestpig",
      userId: "timeout-test-user-1",
      msgId: "timeout-test-message-2",
      comment: "Message 2 from timeout user"
    }
  });

  setTimeout(() => {
    handleTikFinityEvent({
      event: "imDelete",
      data: {
        deleteMsgIdsList: [],
        deleteUserIdsList: ["timeout-test-user-1"]
      }
    });
  }, 2500);

  // TikTok gift tier tests
  handleTikFinityEvent({
    event: "gift",
    data: {
      nickname: "Tier 1 Pig",
      uniqueId: "tier1pig",
      profilePictureUrl: "",
      giftName: "Rose",
      repeatCount: 1,
      diamondCount: 1,
      giftType: 2
    }
  });

  handleTikFinityEvent({
    event: "gift",
    data: {
      nickname: "Tier 2 Pig",
      uniqueId: "tier2pig",
      profilePictureUrl: "",
      giftName: "Super GG",
      repeatCount: 1,
      diamondCount: 100,
      giftType: 2
    }
  });

  handleTikFinityEvent({
    event: "gift",
    data: {
      nickname: "Tier 3 Pig",
      uniqueId: "tier3pig",
      profilePictureUrl: "",
      giftName: "Big Pig Gift",
      repeatCount: 1,
      diamondCount: 500,
      giftType: 2
    }
  });

  handleTikFinityEvent({
    event: "gift",
    data: {
      nickname: "Tier 4 Pig",
      uniqueId: "tier4pig",
      profilePictureUrl: "",
      giftName: "Mega Pig Gift",
      repeatCount: 1,
      diamondCount: 1000,
      giftType: 2
    }
  });

  // TikTok LIVE emote text test
  handleTikFinityEvent({
    event: "chat",
    data: {
      nickname: "TikTok Emote Pig",
      uniqueId: "tiktokemotepig",
      comment: "[wow][laugh][rockycool][rosiecute][sageclever]",
      emotes: [
        { emoteImageUrl: "icons/tt-emotes/wow.png", emoteId: "wow" },
        { emoteImageUrl: "icons/tt-emotes/laugh.png", emoteId: "laugh" },
        { emoteImageUrl: "icons/tt-emotes/rockycool.png", emoteId: "rockycool" },
        { emoteImageUrl: "icons/tt-emotes/rosiecute.png", emoteId: "rosiecute" },
        { emoteImageUrl: "icons/tt-emotes/sageclever.png", emoteId: "sageclever" }
      ]
    }
  });

  handleTikFinityEvent({
    event: "chat",
    data: {
      nickname: "Image Embed Pig",
      uniqueId: "imageembedpig",
      comment: "https://placehold.co/640x360.png"
    }
  });

  handleTikFinityEvent({
    event: "chat",
    data: {
      nickname: "Video Embed Pig",
      uniqueId: "videoembedpig",
      comment:
        "testing https://images-ext-1.discordapp.net/external/BhntKXHZVeVODjUiKNEZ7b-FvVMAvP-TXWOHfDjg1ew/https/media.tenor.com/AvrrJb-Kx4kAAAPo/shook-distraught.mp4"
    }
  });
};

connect();

if (cfg.tikfinity?.enabled) {
  connectTikFinity();
}

startScrollTestMessages();

function connectTikFinity() {
  showConnectionToast(
    "tikfinity",
    "Connecting to TikFinity...",
    "#25f4ee"
  );

  tkWs = new WebSocket(TIKFINITY_WS);

  tkWs.onopen = () => {
    console.log("Connected to TikFinity Event API");

    showConnectionToast(
      "tikfinity",
      "TikFinity connected",
      "#2cff8a",
      1800
    );
  };

  tkWs.onclose = () => {
    console.log("TikFinity disconnected. Reconnecting...");

    showConnectionToast(
      "tikfinity",
      "TikFinity disconnected — reconnecting...",
      "#25f4ee"
    );

    setTimeout(connectTikFinity, cfg.tikfinity.reconnectMs || 2000);
  };

  tkWs.onmessage = (event) => {
    let payload;

    try {
      payload = JSON.parse(event.data);
    } catch {
      return;
    }

    console.log("TikFinity EVENT:", payload);
    handleTikFinityEvent(payload);
  };

  tkWs.onerror = (err) => {
    console.error("TikFinity WebSocket error:", err);

    showConnectionToast(
      "tikfinity",
      "TikFinity connection error",
      "#ff3355"
    );
  };
}

function handleStreamerBotEvent(payload) {
  if (!payload.event || !payload.data) return;

  const source = payload.event.source;
  const type = payload.event.type;
  const data = payload.data;

  if (handleModerationEvent(source, type, data)) return;

  const item = normaliseEvent(source, type, data);

  if (!item) {
    console.log("Unhandled event:", source, type, data);
    return;
  }

  if (!data.__demo) {
    stopScrollTestMessages("Streamer.bot event received");
  }

  const isAnnouncement =
    String(item.special || "").startsWith("announcement");

  if (!isAnnouncement && shouldIgnoreUser(item.user)) {
    return;
  }

  if (item.kind === "chat") addMessage(item);
  if (item.kind === "alert") addAlert(item);
  if (item.kind === "tiktokGift") addTikTokGift(item);
}

function handleTikFinityEvent(payload) {
  if (!payload || !payload.event) return;

  const type = String(payload.event || "").toLowerCase();
  const data = payload.data || {};
  const messageId = getMessageId(data);

  if (!data.__demo && isTikFinityContentEvent(type)) {
    stopScrollTestMessages("TikFinity event received");
  }

  if (type.includes("imdelete") || type.includes("im_delete")) {
    const deletedMessageIds =
      data.deleteMsgIdsList ||
      data.deleteMsgIds ||
      [];

    const deletedUserIds =
      data.deleteUserIdsList ||
      data.deleteUserIds ||
      [];

    deletedMessageIds.forEach(id => {
      deleteMessageById(String(id));
    });

    deletedUserIds.forEach(userId => {
      deleteTikTokMessagesByUserKey(userId);
    });

    return;
  }

  if (
    type.includes("ban") ||
    type.includes("block") ||
    type.includes("timeout") ||
    type.includes("mute")
  ) {
    getTikTokUserKeys(data).forEach(key => deleteTikTokMessagesByUserKey(key));
    deleteMessagesByUser(getUser(data));
    return;
  }

  if (
    type.includes("envelope") ||
    type.includes("treasure") ||
    type.includes("treasurebox")
  ) {
    logTreasureEvent(payload);
  }

  if (type.includes("emote")) {
    const user = getUser(data);

    const emote =
      data.emoteList?.[0] ||
      data.emotes?.[0] ||
      data.emote ||
      {};
    console.log("EMOTE DATA:", emote);
    console.log("FULL EMOTE PAYLOAD:", data);

    const imageUrl =
      emote.emoteImageUrl ||
      emote.imageUrl ||
      emote.imageURL ||
      emote.url ||
      emote.emoteUrl ||
      emote.emoteURL ||
      emote.image?.url ||
      emote.image?.urls?.[0] ||
      data.imageUrl ||
      data.url ||
      "";

    const emoteName =
      emote.name ||
      emote.emoteName ||
      emote.emoteId ||
      emote.id ||
      data.emoteName ||
      data.name ||
      "TikTok emote";

    const localEmoteUrl =
      getLocalTikTokEmote(emoteName);

    const finalImageUrl =
      isRenderableEmoteImageUrl(imageUrl)
        ? imageUrl
        : localEmoteUrl;

    addMessage({
      kind: "chat",
      platform: "TikTok",

      user,

      text: finalImageUrl
        ? ""
        : `[${emoteName}]`,

      parts: finalImageUrl
        ? [{
          type: "emote",
          imageUrl: finalImageUrl,
          text: emoteName
        }]
        : [],

      messageId: messageId || `${Date.now()}-${Math.random()}`,

      avatar: getAvatar(data, "TikTok", user),

      badges: [],

      emoteOnly: !!finalImageUrl,
      gigantified: false,

      raw: data
    });

    return;
  }

  if (type.includes("chat") || type.includes("comment")) {
    const user = getUser(data);

    const text =
      data.comment ||
      data.message ||
      data.text ||
      "";

    if (shouldIgnoreUser(user)) return;

    const tiktokEmotes =
      Array.isArray(data.emotes)
        ? data.emotes
        : [];

    if (tiktokEmotes.length > 0) {
      const parts = tiktokEmotes.map(emote => ({
        type: "emote",

        imageUrl: isRenderableEmoteImageUrl(emote.emoteImageUrl)
          ? emote.emoteImageUrl
          : getLocalTikTokEmote(emote.emoteId),

        text:
          emote.emoteId ||
          "TikTok emote"
      }));

      addMessage({
        kind: "chat",
        platform: "TikTok",
        user,

        text: "",
        parts,

        messageId: messageId || `${Date.now()}-${Math.random()}`,

        avatar: getAvatar(data, "TikTok", user),
        badges: [],
        gigantified: false,
        emoteOnly: true,
        raw: data
      });

      return;
    }

    addMessage({
      kind: "chat",
      platform: "TikTok",
      user,
      text,
      parts: [],

      messageId: messageId || `${Date.now()}-${Math.random()}`,

      avatar: getAvatar(data, "TikTok", user),

      badges: [],
      gigantified: false,
      emoteOnly:
        isEmoteOnlyMessage(text, []),

      raw: data
    });

    return;
  }

  if (type === "envelope") {
    logTreasureEvent(payload);

    const user = getUser(data);

    if (shouldIgnoreUser(user)) return;

    addTikTokGift({
      kind: "tiktokGift",
      platform: "TikTok",
      alertType: "tiktok.treasureBoxes",
      user,

      giftName: `a Treasure Box with ${data.coins || 0} coins`,

      count: "",

      avatar: "icons/tiktok-images/CoinChest.webp",

      giftImage: "icons/tiktok-images/CoinChest.webp",

      raw: data
    });

    return;
  }

  if (type.includes("gift")) {
    const item = normaliseTikTok("Gift", data);

    if (!item) return;
    if (shouldIgnoreUser(item.user)) return;

    addTikTokGift(item);
    return;
  }

  if (type.includes("like")) {
    const user = getUser(data);

    if (shouldIgnoreUser(user)) return;

    addAlert({
      kind: "alert",
      platform: "TikTok",
      alertType: "tiktok.likes",
      title: "TikTok likes",
      text: `${user} sent ${data.likeCount || data.likes || 1} likes`,
      avatar: getAvatar(data, "TikTok", user),
      raw: data
    });

    return;
  }



  if (type.includes("follow")) {
    const user = getUser(data);

    if (shouldIgnoreUser(user)) return;

    addAlert({
      kind: "alert",
      platform: "TikTok",
      alertType: "tiktok.follows",
      title: "TikTok follow",
      text: user,

      avatar:
        data.profilePictureUrl ||
        data.profilePictureURL ||
        data.profilePicture ||
        data.userDetails?.profilePictureUrls?.[0] ||
        fallbackAvatar("TikTok", user),

      raw: data
    });

    return;
  }

  if (type.includes("subscribe") || type.includes("sub")) {
    const user = getUser(data);

    if (shouldIgnoreUser(user)) return;

    addAlert({
      kind: "alert",
      platform: "TikTok",
      alertType: "tiktok.subscribers",
      title: "TikTok subscriber",
      text: user,
      raw: data
    });

    return;
  }

  const normalized = normaliseTikTok(type, data);

  if (normalized) {
    if (shouldIgnoreUser(normalized.user)) return;
    if (normalized.kind === "chat") addMessage(normalized);
    if (normalized.kind === "alert") addAlert(normalized);
    if (normalized.kind === "tiktokGift") addTikTokGift(normalized);
    return;
  }

  console.log("Unhandled TikFinity event:", type, data);
}

function isTikFinityContentEvent(type) {
  return [
    "chat",
    "comment",
    "emote",
    "gift",
    "like",
    "follow",
    "subscribe",
    "sub",
    "envelope",
    "treasure",
    "share",
    "member",
    "join",
    "question",
    "goal",
    "poll",
    "battle",
    "linkmic",
    "streamend",
    "liveintro",
    "roommessage"
  ].some(value => type.includes(value));
}

function normaliseEvent(source, type, data) {
  if (source === "Twitch") return normaliseTwitch(type, data);
  if (source === "YouTube") return normaliseYouTube(type, data);

  const normalizedSource = String(source || "").toLowerCase();

  if (normalizedSource === "kick") return normaliseKick(type, data);

  if (
    normalizedSource === "streamlabs" ||
    normalizedSource === "streamelements" ||
    normalizedSource === "stream-elements" ||
    normalizedSource === "ko-fi" ||
    normalizedSource === "kofi" ||
    normalizedSource === "tipeee-stream" ||
    normalizedSource === "tipeeestream" ||
    normalizedSource === "fourthwall" ||
    normalizedSource === "patreon" ||
    normalizedSource === "donordrive"
  ) {
    return normaliseDonationEvent(source, type, data);
  }

  if (
    source === "TikTok" ||
    source === "TikFinity" ||
    source === "Custom"
  ) {
    return normaliseTikTok(type, data);
  }

  return null;
}

function normaliseKick(type, data) {
  const kickUser = data.user || data.sender || data.author || {};
  const recipient = data.recipient || {};
  const recipients = Array.isArray(data.recipients) ? data.recipients : [];
  const user = getKickUserName(kickUser, getUser(data));
  const text = getText(data);
  const parts = getParts(data);
  const messageId = getMessageId(data);
  const lowerType = String(type || "").toLowerCase();

  if (
    !lowerType ||
    lowerType.includes("chat") ||
    lowerType.includes("message") ||
    lowerType.includes("firstword")
  ) {
    return {
      kind: "chat",
      platform: "Kick",
      user,
      login: kickUser.login || user,
      text,
      parts,
      messageId,
      avatar: kickUser.profilePicture || getAvatar(data, "Kick", user),
      badges: getKickBadges(kickUser, data),
      color: kickUser.color || data.color || null,
      timestamp: data.timestamp || "",
      raw: data
    };
  }

  if (lowerType.includes("follow")) {
    return {
      kind: "alert",
      platform: "Kick",
      alertType: "kick.follows",
      title: "Kick follow",
      text: user,
      avatar: kickUser.profilePicture || getAvatar(data, "Kick", user),
      timestamp: data.timestamp || "",
      raw: data
    };
  }

  if (lowerType.includes("massgift")) {
    const count = recipients.length || data.count || data.amount || 1;
    return {
      kind: "alert",
      platform: "Kick",
      alertType: "kick.giftSubs",
      title: "Kick gift subs",
      text: `${user} gifted ${count} subscription${Number(count) === 1 ? "" : "s"}`,
      avatar: kickUser.profilePicture || getAvatar(data, "Kick", user),
      timestamp: data.subscribedAt || data.timestamp || "",
      raw: data
    };
  }

  if (lowerType.includes("giftsubscription") || lowerType.includes("gift")) {
    const recipientName = getKickUserName(recipient, "a viewer");
    return {
      kind: "alert",
      platform: "Kick",
      alertType: "kick.giftSubs",
      title: "Kick gift sub",
      text: `${user} gifted a subscription to ${recipientName}`,
      avatar: kickUser.profilePicture || getAvatar(data, "Kick", user),
      timestamp: data.subscribedAt || data.timestamp || "",
      raw: data
    };
  }

  if (lowerType.includes("resubscription") || lowerType.includes("subscription")) {
    const months = Number(data.duration || kickUser.monthsSubscribed || 0);
    return {
      kind: "alert",
      platform: "Kick",
      alertType: "kick.subs",
      title: lowerType.includes("resubscription") ? "Kick resub" : "Kick sub",
      text: months > 1 ? `${user} - ${months} months` : user,
      avatar: kickUser.profilePicture || getAvatar(data, "Kick", user),
      timestamp: data.subscribedAt || data.timestamp || "",
      raw: data
    };
  }

  if (lowerType.includes("rewardredemption") || lowerType.includes("reward")) {
    const reward =
      data.reward?.title ||
      data.reward?.name ||
      data.rewardTitle ||
      data.rewardName ||
      data.title ||
      "Kick reward";
    const input = data.input || data.message || data.text || "";

    return {
      kind: "alert",
      platform: "Kick",
      alertType: "kick.rewardRedemptions",
      title: `${user} redeemed ${reward}`,
      text: input || "Reward redeemed",
      avatar: kickUser.profilePicture || getAvatar(data, "Kick", user),
      timestamp: data.timestamp || "",
      raw: data
    };
  }

  if (lowerType.includes("stream") || lowerType.includes("channelupdate") || lowerType.includes("viewer") || lowerType.includes("presentviewers")) {
    return createGenericPlatformAlert("Kick", type, data, "kick.stream");
  }

  if (lowerType.includes("ban") || lowerType.includes("timeout")) {
    return createGenericPlatformAlert("Kick", type, data, "kick.moderation");
  }

  return createGenericPlatformAlert("Kick", type, data, "kick.system");
}

function createGenericPlatformAlert(platform, type, data, alertType) {
  const user = getUser(data);

  return {
    kind: "alert",
    platform,
    alertType,
    title: getPlatformEventTitle(platform, type),
    text: getPlatformEventText(type, data, user),
    amount: getPlatformAmountText(data),
    avatar: getAvatar(data, platform, user),
    login: data.user?.login || data.user_login || data.login || user,
    raw: data
  };
}

function getPlatformEventTitle(platform, type) {
  const title = String(type || "event")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return `${platform} ${title || "event"}`;
}

function getPlatformEventText(type, data = {}, user = "Unknown User") {
  const explicit =
    data.systemMessage ||
    data.message?.systemMessage ||
    data.message?.text ||
    (typeof data.message === "string" ? data.message : "") ||
    data.comment ||
    data.text ||
    data.content ||
    data.title ||
    data.description ||
    data.poll?.title ||
    data.pollBasicInfo?.title ||
    data.goal?.description ||
    data.details?.questionText ||
    data.questionText ||
    "";

  if (explicit) return String(explicit);

  const target =
    data.targetUserName ||
    data.targetUser?.name ||
    data.targetUser?.displayName ||
    data.recipientUserName ||
    data.recipient?.name ||
    data.recipient?.displayName ||
    "";

  const amount = getPlatformAmountText(data);
  return [user, target && target !== user ? `to ${target}` : "", amount ? `(${amount})` : ""]
    .filter(Boolean)
    .join(" ") || getPlatformEventTitle("", type).trim();
}

function getPlatformAmountText(data = {}) {
  const amount =
    data.amount ||
    data.displayString ||
    data.amountDisplayString ||
    data.viewerCount ||
    data.viewers ||
    data.memberCount ||
    data.likeCount ||
    data.likes ||
    data.total ||
    data.count ||
    data.repeatCount ||
    data.contributeCount ||
    data.contributeScore ||
    data.diamondCount ||
    data.envelopeInfo?.diamondCount ||
    "";

  return amount ? String(amount) : "";
}

function getKickUserName(user = {}, fallback = "Kick Viewer") {
  if (typeof user === "string") return user || fallback;

  return (
    user.name ||
    user.displayName ||
    user.login ||
    user.username ||
    fallback
  );
}

function getKickBadges(user = {}, data = {}) {
  const badges = [
    ...(Array.isArray(user.badges) ? user.badges : []),
    ...(Array.isArray(data.badges) ? data.badges : [])
  ];
  const normalized = badges.map(badge => ({
    name: badge.name || badge.id || badge.info || "",
    text: badge.imageUrl ? "" : badge.name || badge.id || "",
    imageUrl: badge.imageUrl || ""
  }));

  if (user.isVerified) normalized.push({ name: "Verified", text: "✓" });
  if (user.isSubscribed) normalized.push({ name: "Subscriber", text: "SUB" });

  const role = Number(user.role);
  if (role === 2) normalized.push({ name: "VIP", text: "VIP" });
  if (role === 3) normalized.push({ name: "Moderator", text: "MOD" });
  if (role === 4) normalized.push({ name: "Broadcaster", text: "OWNER" });

  return normalized;
}

function normaliseTwitch(type, data) {
  const user = getUser(data);
  const text = getText(data);
  const parts = getParts(data);
  const messageId = getMessageId(data);

  switch (type) {
    case "ChatMessage":
    case "Message":
    case "Chat":
    case "FirstWord":
    case "SharedChatMessage": {
      const mentioned = cfg.behaviour.highlightMentions !== false && hasTwitchMention(text, data);
      const highlighted =
        cfg.highlight.enabled &&
        (isHighlightedMessage(data) || mentioned);

      const isEmoteMessage =
        isEmoteOnlyMessage(text, parts);

      const gigantified =
        cfg.gigantified.enabled &&
        isGigantifiedMessage(data, text, parts);

      return {
        kind: "chat",
        platform: "Twitch",
        user,
        login: data.user?.login || user,
        text,
        parts,
        messageId,
        avatar: fallbackAvatar("Twitch", user),
        badges: getBadges(data),
        color: data.user?.color || data.color || null,
        special: highlighted ? "highlight" : null,
        styleType: highlighted ? "rainbow" : null,
        sharedChannel: getSharedChatChannel(data, type),
        gigantified,
        emoteOnly: isEmoteMessage,
        raw: data
      };
    }

    case "Announcement": {
      const announcementColor =
        data.color ||
        data.announcementColor ||
        data.announcement?.color ||
        data.tags?.["announcement-color"] ||
        "primary";

      return {
        kind: "alert",
        platform: "Twitch",
        alertType: `twitch.announcements.${String(announcementColor).toLowerCase()}`,
        title: "Announcement",
        user,
        login: data.user?.login || user,
        text: data.text || text || data.systemMessage || "",
        parts,
        messageId,
        avatar: fallbackAvatar("Twitch", user),
        badges: getBadges(data),
        special: `announcement-${String(announcementColor).toLowerCase()}`,
        gigantified: false,
        emoteOnly: isEmoteOnlyMessage(text, parts),
        raw: data
      };
    }

    case "RewardRedemption": {
      const rewardTitle =
        data.reward?.title ||
        data.rewardName ||
        data.rewardTitle ||
        data.reward?.name ||
        data.title ||
        "";

      const input =
        data.input ||
        data.userInput ||
        data.message ||
        data.text ||
        data.rawInput ||
        "";

      const isHighlight =
        cfg.highlight.enabled &&
        rewardTitle.toLowerCase().includes("highlight");

      if (!shouldShowAlert({
        kind: "alert",
        platform: "Twitch",
        alertType: "twitch.channelPointRedemptions"
      })) {
        return null;
      }

      if (isHighlight) {
        return {
          kind: "chat",
          platform: "Twitch",
          user,
          text: input || "Highlighted a message",
          parts: [],
          messageId,
          avatar: data.profileImageUrl || data.user?.profileImageUrl || fallbackAvatar("Twitch", user),
          login: data.user_login || user,
          badges: getBadges(data),
          special: "highlight",
          styleType: "rainbow",
          gigantified: false,
          emoteOnly: false,
          raw: data
        };
      }

      return {
        kind: "alert",
        platform: "Twitch",
        alertType: "twitch.channelPointRedemptions",
        title: rewardTitle || "Channel point redemption",
        text: `${user} redeemed ${rewardTitle}`,
        amount: data.reward?.cost ? `${data.reward.cost}` : "",
        avatar: fallbackAvatar("Twitch", data.user_login || user),
        login: data.user_login || user,
        raw: data
      };
    }

    case "AutomaticRewardRedemption":
    case "PowerUp":
    case "CustomPowerUpRedemption": {
      console.log("POWER UP EVENT:", data);

      const rewardType =
        data.reward_type ||
        data.rewardType ||
        data.reward?.type ||
        data.type ||
        "";

      const emoteUrl =
        data.gigantified_emote?.imageUrl ||
        data.gigantifiedEmote?.imageUrl ||
        data.gigantifiedEmoteUrl ||
        data.gigantifiedEmoteURL ||
        "";

      if (
        String(rewardType).toLowerCase() === "gigantify_an_emote" &&
        emoteUrl
      ) {
        const powerUser =
          data.user_name ||
          data.userName ||
          data.username ||
          data.login ||
          data.user?.name ||
          data.user?.login ||
          user;

        const powerLogin =
          data.user_login ||
          data.user?.login ||
          data.login ||
          data.userName ||
          data.username ||
          powerUser;

        const emoteText =
          data.message_text ||
          data.gigantified_emote?.name ||
          "";

        const cacheKey =
          `${String(powerUser).toLowerCase()}|${String(emoteText).toLowerCase()}`;

        const cached =
          recentTwitchEmoteDetails.get(cacheKey);

        removeLastPlainTwitchEmoteMessage(powerUser);

        const originalMessageId =
          data.messageId ||
          data.message?.id ||
          data.message?.messageId ||
          data.msgId ||
          data.id;

        if (originalMessageId) {
          deleteMessageById(originalMessageId);
        }

        return {
          kind: "chat",
          platform: "Twitch",
          user: cached?.user || powerUser,
          login: cached?.login || powerLogin,
          text: "",
          parts: [
            {
              type: "emote",
              imageUrl: emoteUrl,
              text: "Gigantified emote"
            }
          ],
          messageId: originalMessageId || messageId,
          avatar: cached?.avatar || fallbackAvatar("Twitch", powerLogin),
          badges: cached?.badges || getBadges(data),
          color: cached?.color || data.user?.color || data.color || null,
          special: null,
          gigantified: true,
          emoteOnly: true,
          raw: data
        };
      }

      return null;
    }

    case "Cheer": {
      const bits =
        Number(data.bits || data.amount || 0);

      return {
        kind: "alert",
        platform: "Twitch",
        alertType: "twitch.cheers",
        title: `${user} cheered`,
        text: `${bits} bits`,
        raw: data
      };
    }

    case "CoinCheer":
    case "HypeChat":
    case "HypeChatLevel":
      return createTwitchAlert(type, data, { alertType: "twitch.hype" });

    case "HypeTrainStart":
    case "HypeTrainUpdate":
    case "HypeTrainLevelUp":
    case "HypeTrainEnd":
      return createTwitchAlert(type, data, { alertType: "twitch.hypeTrain" });

    case "Follow":
      return {
        kind: "alert",
        platform: "Twitch",
        alertType: "twitch.follows",
        title: "New follower",
        text: user,
        raw: data
      };

    case "Sub":
    case "ReSub":
      return {
        kind: "alert",
        platform: "Twitch",
        alertType: "twitch.subs",
        title: type === "ReSub" ? "Resub" : "New sub",
        text: `${user}${data.months ? ` — ${data.months} months` : ""}`,
        raw: data
      };

    case "GiftPaidUpgrade":
    case "PrimePaidUpgrade":
    case "PayItForward":
      return createTwitchAlert(type, data, { alertType: "twitch.upgrades" });

    case "GiftSub":
    case "GiftBomb":
      return {
        kind: "alert",
        platform: "Twitch",
        alertType: "twitch.giftSubs",
        title: "Gift sub",
        text: `${user} gifted ${data.total || data.amount || 1}`,
        raw: data
      };

    case "Raid":
    case "RaidStart":
    case "RaidSend":
    case "RaidCancelled":
      return {
        kind: "alert",
        platform: "Twitch",
        alertType: "twitch.raids",
        title: getTwitchEventTitle(type),
        text: type === "Raid"
          ? `${user} raided with ${data.viewers || 0} viewers`
          : getTwitchEventText(type, data, user),
        raw: data
      };

    case "WatchStreak": {
      if (cfg.behaviour.alerts?.twitch?.watchStreaks === false) {
        return null;
      }

      const count =
        data.streak_count ||
        data.streakCount ||
        data.count ||
        data.months ||
        0;

      const systemMessage =
        data.systemMessage ||
        data.message?.systemMessage ||
        "";

      return {
        kind: "alert",
        platform: "Twitch",
        alertType: getTwitchWatchStreakAlertType(),
        title: "Watch streak",
        text: systemMessage || `${user} shared a ${count || "new"} stream watch streak`,
        amount: count ? `${count}` : "",
        avatar: data.user?.profileImageUrl || fallbackAvatar("Twitch", user),
        login: data.user?.login || data.user_login || user,
        badges: getBadges(data),
        raw: data
      };
    }

    case "CharityStarted":
    case "CharityDonation":
    case "CharityProgress":
    case "CharityCompleted":
      return createTwitchAlert(type, data, { alertType: "twitch.charity" });

    case "GoalBegin":
    case "GoalProgress":
    case "GoalEnd":
    case "CommunityGoalContribution":
    case "CommunityGoalEnded":
      return createTwitchAlert(type, data, { alertType: "twitch.goals" });

    case "PollCreated":
    case "PollUpdated":
    case "PollCompleted":
    case "PollArchived":
    case "PollTerminated":
      return createTwitchAlert(type, data, { alertType: "twitch.polls" });

    case "PredictionCreated":
    case "PredictionUpdated":
    case "PredictionLocked":
    case "PredictionCompleted":
    case "PredictionCanceled":
      return createTwitchAlert(type, data, { alertType: "twitch.predictions" });

    case "SharedChatAnnouncement":
    case "SharedChatCommunitySubGift":
    case "SharedChatGiftPaidUpgrade":
    case "SharedChatPayItForward":
    case "SharedChatPrimePaidUpgrade":
    case "SharedChatRaid":
    case "SharedChatResub":
    case "SharedChatSessionBegin":
    case "SharedChatSessionEnd":
    case "SharedChatSessionUpdate":
    case "SharedChatSub":
    case "SharedChatSubGift":
    case "SharedChatUserBanned":
    case "SharedChatUserTimedout":
    case "SharedChatUserUnbanned":
    case "SharedChatUserUntimedout":
      return createTwitchAlert(type, data, {
        alertType: "twitch.sharedChat",
        sharedChannel: getSharedChatChannel(data, type)
      });

    case "ShoutoutCreated":
    case "ShoutoutReceived":
      return createTwitchAlert(type, data, { alertType: "twitch.shoutouts" });

    case "StreamOnline":
    case "StreamOffline":
    case "StreamUpdate":
    case "StreamUpdateGameOnConnect":
    case "BroadcastUpdate":
    case "UpcomingAd":
    case "AdRun":
    case "ViewerCountUpdate":
      return createTwitchAlert(type, data, { alertType: "twitch.stream" });

    case "ChatCleared":
    case "ChatEmoteModeOff":
    case "ChatEmoteModeOn":
    case "ChatFollowerModeChanged":
    case "ChatFollowerModeOff":
    case "ChatFollowerModeOn":
    case "ChatSlowModeChanged":
    case "ChatSlowModeOff":
    case "ChatSlowModeOn":
    case "ChatSubscriberModeOff":
    case "ChatSubscriberModeOn":
    case "ChatUniqueModeOff":
    case "ChatUniqueModeOn":
    case "ModeratorAdded":
    case "ModeratorRemoved":
    case "ShieldModeBegin":
    case "ShieldModeEnd":
    case "SuspiciousUserMessage":
    case "SuspiciousUserUpdate":
    case "UnbanRequestApproved":
    case "UnbanRequestCreated":
    case "UnbanRequestDenied":
    case "UserUnbanned":
    case "UserUntimedOut":
    case "VipAdded":
    case "VipRemoved":
    case "WarnedUser":
    case "WarningAcknowledged":
      return createTwitchAlert(type, data, { alertType: "twitch.moderation" });

    default:
      return createTwitchAlert(type, data, { alertType: getTwitchAlertTypeForEvent(type) });
  }
}

function getTwitchWatchStreakAlertType() {
  const fallback = "watchStreaks";
  const route = String(cfg.behaviour.alertRoutes?.twitch?.watchStreaks || fallback);
  const allowed = [
    "watchStreaks",
    "announcements",
    "channelPointRedemptions",
    "cheers",
    "follows",
    "subs",
    "giftSubs",
    "raids",
    "upgrades",
    "hype",
    "hypeTrain",
    "charity",
    "goals",
    "polls",
    "predictions",
    "sharedChat",
    "shoutouts",
    "stream",
    "moderation",
    "system"
  ];

  return `twitch.${allowed.includes(route) ? route : fallback}`;
}

function createTwitchAlert(type, data, options = {}) {
  const user = getUser(data);

  return {
    kind: "alert",
    platform: "Twitch",
    alertType: options.alertType || getTwitchAlertTypeForEvent(type),
    title: options.title || getTwitchEventTitle(type),
    text: options.text || getTwitchEventText(type, data, user),
    amount: options.amount || getTwitchAmountText(data),
    avatar: getAvatar(data, "Twitch", user),
    login: data.user?.login || data.user_login || data.login || user,
    badges: getBadges(data),
    sharedChannel: options.sharedChannel || getSharedChatChannel(data, type),
    raw: data
  };
}

function getTwitchAlertTypeForEvent(type) {
  const key = String(type || "").toLowerCase();

  if (key.includes("hypechat") || key.includes("coincheer")) return "twitch.hype";
  if (key.includes("hypetrain")) return "twitch.hypeTrain";
  if (key.includes("charity")) return "twitch.charity";
  if (key.includes("goal")) return "twitch.goals";
  if (key.includes("poll")) return "twitch.polls";
  if (key.includes("prediction")) return "twitch.predictions";
  if (key.includes("sharedchat")) return "twitch.sharedChat";
  if (key.includes("shoutout")) return "twitch.shoutouts";
  if (key.includes("stream") || key.includes("broadcast") || key.includes("ad") || key.includes("viewer")) return "twitch.stream";
  if (key.includes("upgrade") || key.includes("payitforward")) return "twitch.upgrades";
  if (
    key.includes("mod") ||
    key.includes("ban") ||
    key.includes("timeout") ||
    key.includes("warn") ||
    key.includes("shield") ||
    key.includes("suspicious") ||
    key.includes("permitted") ||
    key.includes("blockedterms") ||
    key.includes("automod") ||
    key.includes("chat")
  ) {
    return "twitch.moderation";
  }

  return "twitch.system";
}

function getTwitchEventTitle(type) {
  const words = String(type || "Twitch event")
    .replace(/^SharedChat/, "Shared Chat ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();

  return words || "Twitch event";
}

function getTwitchEventText(type, data = {}, user = "Unknown Pig") {
  const explicit =
    data.systemMessage ||
    data.message?.systemMessage ||
    data.message?.text ||
    (typeof data.message === "string" ? data.message : "") ||
    data.text ||
    data.status ||
    data.title ||
    data.reward?.title ||
    data.poll?.title ||
    data.prediction?.title ||
    data.goal?.description ||
    "";

  if (explicit) return String(explicit);

  const target =
    data.targetUserName ||
    data.targetUser?.displayName ||
    data.targetUser?.name ||
    data.recipientUserName ||
    data.recipient?.displayName ||
    data.recipient?.name ||
    "";

  const amount = getTwitchAmountText(data);
  const channel = getSharedChatChannel(data, type);
  const pieces = [user];

  if (target && target !== user) pieces.push(`to ${target}`);
  if (amount) pieces.push(`(${amount})`);
  if (channel) pieces.push(`from ${channel}`);

  return pieces.join(" ") || getTwitchEventTitle(type);
}

function getTwitchAmountText(data = {}) {
  const rawAmount =
    data.amount ||
    data.bits ||
    data.viewers ||
    data.viewerCount ||
    data.total ||
    data.count ||
    data.months ||
    data.level ||
    data.streak_count ||
    data.streakCount ||
    data.charity?.amount ||
    data.contribution?.amount ||
    "";

  const amount =
    rawAmount && typeof rawAmount === "object"
      ? rawAmount.value || rawAmount.amount || rawAmount.valueInCents || ""
      : rawAmount;

  const currency =
    data.currency ||
    data.charity?.amount?.currency ||
    data.amount?.currency ||
    "";

  if (!amount) return "";
  return currency ? `${amount} ${currency}` : String(amount);
}

function hasTwitchMention(text, data = {}) {
  if (data.isMentioned || data.mentioned || data.message?.isMentioned) return true;

  return /(^|\s)@[a-z0-9_]{2,25}\b/i.test(String(text || ""));
}

function getSharedChatChannel(data = {}, type = "") {
  const channel =
    data.sourceRoom?.displayName ||
    data.sourceRoom?.name ||
    data.sourceRoom?.login ||
    data.sourceRoom?.userName ||
    data.sourceRoom?.userLogin ||
    data.sourceRoom?.broadcasterUserName ||
    data.sourceRoom?.broadcasterUserLogin ||
    data.sourceRoom?.broadcasterDisplayName ||
    data.sourceRoom?.channelName ||
    data.sourceRoom?.channelLogin ||
    data.sourceRoom?.channelDisplayName ||
    data.sourceRoom?.id ||
    data.room?.displayName ||
    data.room?.name ||
    data.room?.login ||
    data.sharedChat?.channelName ||
    data.sharedChat?.channelDisplayName ||
    data.sharedChat?.sourceChannelName ||
    data.sharedChat?.sourceChannelDisplayName ||
    data.sharedChat?.viewerChannel ||
    data.sharedChat?.sourceRoom?.displayName ||
    data.sharedChat?.sourceRoom?.name ||
    data.sourceChannel ||
    data.sourceChannelName ||
    data.sourceChannelDisplayName ||
    data.sourceBroadcasterUserName ||
    data.sourceBroadcasterUserLogin ||
    data.sourceBroadcasterDisplayName ||
    data.source_broadcaster_user_name ||
    data.source_broadcaster_user_login ||
    data.source_broadcaster_user_id ||
    data.tags?.["source-room-name"];

  if (channel) return String(channel);
  return String(type || "").startsWith("SharedChat") ? "shared chat" : "";
}

function normaliseYouTube(type, data) {
  const user = getUser(data);
  const text = getText(data);
  const parts = getParts(data);
  const messageId = getMessageId(data);

  switch (type) {
    case "Message":
    case "FirstWords":
      return {
        kind: "chat",
        platform: "YouTube",
        user,
        text,
        parts,
        messageId,
        avatar: getAvatar(data, "YouTube", user),
        badges: getYouTubeBadges(data),
        gigantified: cfg.gigantified.enabled && isGigantifiedMessage(data, text, parts),
        emoteOnly: isEmoteOnlyMessage(text, parts),
        raw: data
      };

    case "SuperChat":
      return {
        kind: "alert",
        platform: "YouTube",
        alertType: "youtube.superChats",
        title: "Super Chat",
        text: `${user}: ${text}`,
        amount: data.amount || data.displayString || data.amountDisplayString,
        raw: data
      };

    case "SuperSticker":
      return {
        kind: "alert",
        platform: "YouTube",
        alertType: "youtube.superStickers",
        title: "Super Sticker",
        text: user,
        amount: data.amount || data.displayString || data.amountDisplayString,
        raw: data
      };

    case "NewSponsor":
    case "MemberMileStone":
    case "GiftMembershipReceived":
    case "MembershipGift":
    case "NewSubscriber":
      return {
        kind: "alert",
        platform: "YouTube",
        alertType: "youtube.members",
        title: "YouTube member",
        text: user,
        raw: data
      };

    case "JewelsGifted":
      return createGenericPlatformAlert("YouTube", type, data, "youtube.gifts");

    case "PollStarted":
    case "PollUpdated":
    case "PollClosed":
      return createGenericPlatformAlert("YouTube", type, data, "youtube.polls");

    case "BroadcastAdded":
    case "BroadcastEnded":
    case "BroadcastMonitoringEnded":
    case "BroadcastMonitoringStarted":
    case "BroadcastRemoved":
    case "BroadcastStarted":
    case "BroadcastUpdated":
    case "PresentViewers":
    case "StatisticsUpdated":
      return createGenericPlatformAlert("YouTube", type, data, "youtube.stream");

    case "NewSponsorOnlyEnded":
    case "NewSponsorOnlyStarted":
    case "UserBanned":
    case "UserTimedout":
      return createGenericPlatformAlert("YouTube", type, data, "youtube.moderation");

    default:
      return createGenericPlatformAlert("YouTube", type, data, "youtube.system");
  }
}

function normaliseDonationEvent(source, type, data) {
  const normalizedSource = String(source || "").toLowerCase();

  let user = getUser(data);
  let message = getText(data);

  const rawAmount =
    data.tipAmount ||
    data.donationAmount ||
    data.charityDonationAmount ||
    data.merchAmount ||

    // Patreon sends cents
    (
      typeof data.attributes?.currently_entitled_amount_cents !== "undefined"
        ? Number(data.attributes.currently_entitled_amount_cents) / 100
        : ""
    ) ||
    (
      typeof data.attributes?.will_pay_amount_cents !== "undefined"
        ? Number(data.attributes.will_pay_amount_cents) / 100
        : ""
    ) ||

    data.amount ||
    data.total ||
    data.value ||
    data.currencyAmount ||
    data.fw?.amount ||
    data.fw?.donation ||
    data.displayString ||
    data.amountDisplayString ||
    data.formattedAmount ||
    data.formatted_amount ||
    data.formattedValue ||
    "";

  const currency =
    data.tipCurrency ||
    data.donationCurrency ||
    data.charityDonationCurrency ||
    data.merchCurrency ||
    data.currency ||
    data.currencyCode ||
    data.currencySymbol ||
    data.currencyType ||
    data.fw?.currency ||
    cfg.donations?.defaultCurrency ||
    "USD";

  const currencySymbols = {
    USD: "$",
    GBP: "£",
    EUR: "€",
    AUD: "$",
    CAD: "$",
    NZD: "$",
    JPY: "¥",
    CNY: "¥",
    INR: "₹",
    RUB: "₽",
    KRW: "₩",
    SEK: "kr",
    NOK: "kr",
    DKK: "kr",
    CHF: "CHF"
  };

  const normalizedCurrency = String(currency).toUpperCase();

  const symbol =
    currencySymbols[normalizedCurrency] ||
    currency ||
    "";

  let amount = "";

  if (rawAmount !== "" && typeof rawAmount !== "undefined") {
    const alreadyFormatted =
      typeof rawAmount === "string" &&
      /[$£€¥₹₩]|CHF|kr/i.test(rawAmount);

    amount = alreadyFormatted
      ? rawAmount
      : `${symbol}${rawAmount}`;
  }

  // Provider-specific user/message overrides
  if (normalizedSource === "ko-fi" || normalizedSource === "kofi") {
    user =
      data.from ||
      data.from_name ||
      data.username ||
      data.displayName ||
      user;

    message =
      data.message ||
      data.note ||
      data.text ||
      message;
  }

  if (normalizedSource === "patreon") {
    user =
      data.attributes?.full_name ||
      data.user?.attributes?.full_name ||
      data.user?.full_name ||
      data.username ||
      user;

    message =
      data.attributes?.note ||
      data.message ||
      message;
  }

  // Safety fallback for providers that return a user object
  if (typeof user === "object") {
    user =
      user.displayName ||
      user.username ||
      user.name ||
      "Unknown User";
  }

  let action = "donated";

  if (
    normalizedSource === "stream-elements" ||
    normalizedSource === "streamelements"
  ) {
    action = "tipped";
  }

  if (normalizedSource === "patreon") {
    action = "pledged";
  }

  let title = `${user} ${action}`;

  if (amount) {
    title += ` ${amount}`;
  }

  if (
    (normalizedSource === "ko-fi" || normalizedSource === "kofi") &&
    data.tier
  ) {
    title += ` — ${data.tier}`;
  }

  const messageId =
    data.messageId ||
    data.id ||
    data.txId ||
    data.transactionId ||
    "";

  return {
    kind: "alert",
    platform: source || "Donation",
    alertType: `donations.${getDonationAlertKey(source)}`,
    title,
    text:
      message &&
      message !== type
        ? message
        : "Thank you for your support!",
    amount,
    messageId,
    avatar:
      getDonationPlatformLogo(source) ||
      getAvatar(data, source || "Donation", user),
    raw: data
  };
}

function normaliseTikTok(type, data) {
  const lowerType = String(type).toLowerCase();
  const user = getUser(data);
  const text = getText(data);
  const parts = getParts(data);
  const messageId = getMessageId(data);

  if (lowerType.includes("chat") || lowerType.includes("comment") || data.comment) {
    return {
      kind: "chat",
      platform: "TikTok",
      user,
      text,
      parts,
      messageId,
      avatar: getAvatar(data, "TikTok", user),
      badges: [],
      gigantified: cfg.gigantified.enabled && isGigantifiedMessage(data, text, parts),
      emoteOnly: isEmoteOnlyMessage(text, parts),
      raw: data
    };
  }

  if (lowerType.includes("gift") || data.giftName) {
    const count = data.repeatCount || data.repeat || 1;
    const giftName = data.giftName || data.gift?.name || "gift";

    return {
      kind: "tiktokGift",

      platform: "TikTok",
      alertType: "tiktok.gifts",

      user,

      giftName,

      count,

      groupId: data.groupId,

      avatar: getAvatar(data, "TikTok", user),

      giftImage:
        data.giftPictureUrl ||
        data.giftPictureURL ||
        data.giftImageUrl ||
        data.giftImageURL ||
        data.giftPicture ||
        data.giftImage ||
        data.imageUrl ||
        data.imageURL ||
        data.pictureUrl ||
        data.pictureURL ||
        data.gift?.imageUrl ||
        data.gift?.imageURL ||
        data.gift?.pictureUrl ||
        data.gift?.pictureURL ||
        data.extendedGiftInfo?.imageUrl ||
        data.extendedGiftInfo?.imageURL ||
        data.extendedGiftInfo?.pictureUrl ||
        data.extendedGiftInfo?.pictureURL ||
        "",

      raw: data
    };
  }

  if (lowerType.includes("follow")) {
    return {
      kind: "alert",
      platform: "TikTok",
      alertType: "tiktok.follows",
      title: "TikTok follow",
      text: user,
      raw: data
    };
  }

  if (lowerType.includes("like") || data.likeCount || data.likes) {
    return {
      kind: "alert",
      platform: "TikTok",
      alertType: "tiktok.likes",
      title: "TikTok likes",
      text: `${user} sent ${data.likeCount || data.likes || 1} likes`,
      avatar: getAvatar(data, "TikTok", user),
      raw: data
    };
  }

  if (lowerType.includes("share")) {
    return createGenericPlatformAlert("TikTok", type, data, "tiktok.shares");
  }

  if (lowerType.includes("member") || lowerType.includes("join")) {
    return createGenericPlatformAlert("TikTok", type, data, "tiktok.joins");
  }

  if (lowerType.includes("question")) {
    return createGenericPlatformAlert("TikTok", type, data, "tiktok.questions");
  }

  if (lowerType.includes("goal")) {
    return createGenericPlatformAlert("TikTok", type, data, "tiktok.goals");
  }

  if (lowerType.includes("poll")) {
    return createGenericPlatformAlert("TikTok", type, data, "tiktok.polls");
  }

  if (lowerType.includes("battle") || lowerType.includes("linkmic")) {
    return createGenericPlatformAlert("TikTok", type, data, "tiktok.battles");
  }

  if (lowerType.includes("roomuser") || lowerType.includes("viewer")) {
    return null;
  }

  if (lowerType.includes("streamend") || lowerType.includes("liveintro") || lowerType.includes("roommessage")) {
    return createGenericPlatformAlert("TikTok", type, data, "tiktok.stream");
  }

  return createGenericPlatformAlert("TikTok", type, data, "tiktok.system");
}

function addMessage(item) {
  if (!shouldShowChat(item)) return;

  const text = item.text || "";

  const blockedPrefixes =
    Array.isArray(cfg.filters?.blockedPrefixes)
      ? cfg.filters.blockedPrefixes
      : [];

  if (
    blockedPrefixes.some(prefix =>
      text.startsWith(prefix)
    )
  ) {
    return;
  }

  if (!item.text && (!item.parts || item.parts.length === 0)) return;

  const group = findGroupForItem(item);
  const bubble = createMessageBubble(item);

  if (group) {
    group.el.classList.add("grouped");
    group.stack.appendChild(bubble);
    group.lastAt = Date.now();
    group.count += 1;

    indexMessage(item, bubble);
    trimMessages();
    maybeAutoScrollToBottom();
    maybeRemoveLater(bubble);

    return;
  }

  const el = document.createElement("div");
  el.dataset.createdAt = Date.now();

  if (item.platform === "Twitch" && item.emoteOnly && !item.gigantified) {
    const key = `${String(item.user).toLowerCase()}|${String(item.text).toLowerCase()}`;

    recentTwitchEmoteDetails.set(key, {
      user: item.user,
      login: item.login,
      avatar: item.avatar,
      badges: item.badges,
      color: item.color,
      el
    });

    setTimeout(() => recentTwitchEmoteDetails.delete(key), 3000);
  }

  el.className = `msg platform-${item.platform.toLowerCase()}`;
  el.dataset.kind = item.kind || "chat";
  el.dataset.platform = item.platform || "";
  el.dataset.alertType = item.alertType || "";
  el.dataset.styleType = item.styleType || "";
  if (isDemoItem(item)) el.dataset.demo = "true";

  applyPlatformVariables(el, item.platform, item);

  if (item.special) el.classList.add(`special-${item.special}`);
  if (item.sharedChannel) el.classList.add("shared-chat");
  if (item.gigantified) el.classList.add("gigantified");
  if (item.emoteOnly) el.classList.add("emote-only");
  if (item.platform === "Twitch" && item.color) {
    el.classList.add("has-twitch-name-color");
    el.style.setProperty("--twitch-chat-name-color", item.color);
  }

  const avatarId = `avatar-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const platformIcon = getPlatformIcon(item.platform);
  const platformIconHtml = platformIcon
    ? `<img class="platform-icon" src="${escapeAttr(platformIcon)}" alt="">`
    : "";
  if (!platformIcon) el.classList.add("no-platform-icon");

  el.innerHTML = `
    <div class="avatar-wrap">
      <img id="${avatarId}" class="avatar" src="${escapeAttr(item.avatar)}">
    </div>

    <div class="bubble-stack">
      <div class="name-bubble">
        <span class="bubble-glow title-glow-layer" aria-hidden="true"></span>
        ${renderTimestamp(item)}
        <span class="badges">${renderBadges(item.badges)}</span>
        <span class="name-stack">
          <span class="name">${escapeHtml(item.user)}</span>
          ${item.sharedChannel ? `<span class="shared-chat-label">via ${escapeHtml(item.sharedChannel)}</span>` : ""}
        </span>
        ${platformIconHtml}
      </div>
    </div>
  `;

  const stack = el.querySelector(".bubble-stack");
  stack.appendChild(bubble);

  chat.appendChild(el);

  currentGroup = {
    key: getGroupKey(item),
    el,
    stack,
    user: item.user,
    platform: item.platform,
    special: item.special || "",
    gigantified: !!item.gigantified,
    lastAt: Date.now(),
    count: 1
  };

  indexMessage(item, bubble);

  if (item.platform === "TikTok") {
    indexTikTokMessage(item);
  }

  trimMessages();
  maybeAutoScrollToBottom();
  maybeRemoveLater(el);

  if (item.platform === "Twitch" && item.login && cfg.behaviour.twitchAvatarsViaDecApi) {
    enrichTwitchAvatar(item.login, avatarId);
  }
}

function createMessageBubble(item) {
  const canEmbed = canEmbedImage(item);
  const mediaEmbed =
    cfg.behaviour.showImageEmbeds && canEmbed
      ? getMediaEmbed(item.text)
      : null;
  const linkPreview =
    !mediaEmbed &&
      cfg.behaviour.showLinkPreviews &&
      canEmbed
      ? getYouTubeLinkPreview(item.text)
      : null;
  const hiddenEmbedUrl = mediaEmbed?.url || "";
  const contentItem =
    hiddenEmbedUrl
      ? {
        ...item,
        text: removeMediaEmbedUrl(item.text, hiddenEmbedUrl),
        parts: removeMediaEmbedUrlFromParts(item.parts, hiddenEmbedUrl)
      }
      : item;
  const contentHtml = renderMessageContent(contentItem);

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.dataset.createdAt = Date.now();

  if (item.emoteOnly) {
    bubble.classList.add("emote-only");
  }

  if (item.messageId) {
    bubble.dataset.messageId = item.messageId;
  }

  bubble.innerHTML = `
    <span class="bubble-glow message-glow-layer" aria-hidden="true"></span>
    ${contentHtml ? `<div class="text">${contentHtml}</div>` : ""}
    ${mediaEmbed ? renderMediaEmbed(mediaEmbed) : ""}
    ${linkPreview ? renderLinkPreview(linkPreview) : ""}
  `;

  hydrateEmoteImageFallbacks(bubble);

  const previewCard = bubble.querySelector("[data-youtube-preview]");
  if (previewCard && linkPreview) {
    hydrateYouTubePreview(previewCard, linkPreview);
  }

  bubble
    .querySelectorAll("img.embed, video.embed, iframe.embed")
    .forEach(media => {
      media.addEventListener("load", maybeAutoScrollToBottom, { once: true });
      media.addEventListener("loadedmetadata", maybeAutoScrollToBottom, { once: true });
      media.addEventListener("canplay", maybeAutoScrollToBottom, { once: true });
    });

  return bubble;
}

function renderTimestamp(item = {}) {
  if (!cfg.behaviour.showTimestamps) return "";

  const date = item.timestamp ? new Date(item.timestamp) : new Date();
  if (Number.isNaN(date.getTime())) return "";

  const format = String(cfg.behaviour.timestampFormat || "time").toLowerCase();
  const text = format === "datetime"
    ? date.toLocaleString([], { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" })
    : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return `<span class="timestamp">${escapeHtml(text)}</span>`;
}

function findGroupForItem(item) {
  if (!cfg.behaviour.groupConsecutiveMessages) return null;
  if (!currentGroup) return null;
  if (item.special) return null;
  if (item.gigantified) return null;
  if (currentGroup.key !== getGroupKey(item)) return null;
  if (Date.now() - currentGroup.lastAt > cfg.behaviour.groupWindowMs) return null;
  if (!document.body.contains(currentGroup.el)) return null;

  return currentGroup;
}

function getGroupKey(item) {
  return [
    String(item.platform || "").toLowerCase(),
    String(item.user || "").toLowerCase(),
    item.special || "",
    item.gigantified ? "gigantic" : "normal"
  ].join("|");
}

function shouldShowChat(item) {
  return shouldShowSourcePlatform(item) && shouldShowChatPlatform(item);
}

function shouldShowSourcePlatform(item) {
  const key = String(item.platform || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  return cfg.behaviour.sources?.[key] !== false;
}

function shouldShowChatPlatform(item) {
  const key = String(item.platform || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  return cfg.behaviour.chat?.[key] !== false;
}

function shouldShowPlatform(item) {
  return shouldShowSourcePlatform(item);
}

function shouldShowAlert(item) {
  if (!cfg.behaviour.showAlerts) return false;
  if (!shouldShowSourcePlatform(item)) return false;
  if (!shouldShowAlertPlatform(item)) return false;

  const path = String(item.alertType || "")
    .split(".")
    .filter(Boolean);

  if (path.length === 0) return true;

  const [group, type] = path;
  const groupSetting = cfg.behaviour.alerts?.[group];

  if (groupSetting === false) return false;

  if (groupSetting && typeof groupSetting === "object") {
    if (groupSetting.enabled === false) return false;
    if (type && groupSetting[type] === false) return false;
  }

  let setting = cfg.behaviour.alerts;

  for (const part of path) {
    setting = setting?.[part];
  }

  return setting !== false;
}

function shouldShowAlertPlatform(item) {
  const alertGroup = getAlertGroup(item);

  if (!alertGroup) return shouldShowPlatform(item);

  const groupSetting = cfg.behaviour.alerts?.[alertGroup];

  if (groupSetting === false) return false;
  if (groupSetting && typeof groupSetting === "object" && groupSetting.enabled === false) {
    return false;
  }

  return true;
}

function getAlertGroup(item) {
  const alertGroup = String(item.alertType || "").split(".").filter(Boolean)[0];

  if (alertGroup) return alertGroup;

  const platform = String(item.platform || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  if (platform === "twitch") return "twitch";
  if (platform === "youtube") return "youtube";
  if (platform === "tiktok") return "tiktok";
  if (platform === "kick") return "kick";
  if (
    [
      "streamlabs",
      "streamelements",
      "kofi",
      "kofi",
      "tipeeestream",
      "tipeeestream",
      "fourthwall",
      "patreon",
      "donordrive"
    ].includes(platform)
  ) {
    return "donations";
  }

  return "";
}

function pruneHiddenMessages() {
  document.querySelectorAll(".msg").forEach(el => {
    const item = {
      kind: el.dataset.kind || (el.classList.contains("alert") ? "alert" : "chat"),
      platform:
        el.dataset.platform ||
        [...el.classList]
          .find(name => name.startsWith("platform-"))
          ?.replace("platform-", "") ||
        "",
      alertType: el.dataset.alertType || ""
    };

    const visible =
      item.kind === "alert" || item.kind === "tiktokGift"
        ? shouldShowAlert(item)
        : shouldShowChat(item);

    if (!visible) {
      el.remove();
    }
  });
}

function addAlert(item) {
  if (!shouldShowAlert(item)) return;

  const el = document.createElement("div");
  el.className = `msg alert platform-${item.platform.toLowerCase()}`;
  el.dataset.kind = item.kind || "alert";
  el.dataset.platform = item.platform || "";
  el.dataset.alertType = item.alertType || "";
  if (isDemoItem(item)) el.dataset.demo = "true";

  applyPlatformVariables(el, item.platform, item);

  if (item.special) {
    el.classList.add(`special-${item.special}`);
  }

  if (item.sharedChannel) {
    el.classList.add("shared-chat");
  }

  if (cfg.behaviour.compactAlerts) {
    el.classList.add("compact-alert");
  }

  const platformIcon = getPlatformIcon(item.platform);
  const platformIconHtml = platformIcon
    ? `<img class="platform-icon" src="${escapeAttr(platformIcon)}" alt="">`
    : "";
  if (!platformIcon) el.classList.add("no-platform-icon");

  el.innerHTML = `
    <div class="avatar-wrap">
      <img class="avatar" src="${escapeAttr(
    item.avatar || fallbackAvatar(item.platform, item.text || item.title)
  )}">
    </div>

    <div class="bubble-stack">
      <span class="bubble-glow alert-glow-layer" aria-hidden="true"></span>
      <div class="name-bubble">
        <span class="bubble-glow title-glow-layer" aria-hidden="true"></span>
        ${renderTimestamp(item)}
        <span class="name">${escapeHtml(item.title)}</span>
        ${item.sharedChannel ? `<span class="shared-chat-label">via ${escapeHtml(item.sharedChannel)}</span>` : ""}
        ${platformIconHtml}
      </div>

      <div class="message-bubble">
        <span class="bubble-glow message-glow-layer" aria-hidden="true"></span>
        <div class="text">${renderMessageContent({
    text: item.text || "",
    parts: item.parts || []
  })}</div>
      </div>
    </div>
  `;

  hydrateEmoteImageFallbacks(el);

  chat.appendChild(el);

  const avatarImg = el.querySelector(".avatar");

  if (
    item.platform === "Twitch" &&
    item.login &&
    cfg.behaviour.twitchAvatarsViaDecApi &&
    avatarImg
  ) {
    getTwitchAvatar(item.login).then(url => {
      if (url) avatarImg.src = url;
    });
  }

  currentGroup = null;

  trimMessages();
  maybeAutoScrollToBottom();
  maybeRemoveLater(el);
}

function addTikTokGift(item) {
  if (!shouldShowAlert(item)) return;

  const key = item.groupId
    ? `combo:${item.groupId}`
    : `single:${Date.now()}-${Math.random()}`;

  const existing =
    renderedTikTokGiftCards.get(key);

  const giftType = Number(
    item.raw?.giftType ??
    item.raw?.gift?.gift_type ??
    0
  );

  const isStreakableGift =
    giftType === 1;

  const isRepeatEnd =
    item.raw?.repeatEnd === true ||
    item.raw?.repeat_end === true ||
    item.raw?.gift?.repeat_end === true ||
    item.raw?.gift?.repeat_end === 1;

  // STREAK GIFTS
  // wait until repeatEnd
  if (isStreakableGift && !isRepeatEnd) {
    pendingTikTokCombos.set(key, item);
    return;
  }

  // final streak event
  let finalItem = item;

  if (isStreakableGift) {
    finalItem =
      pendingTikTokCombos.get(key) || item;

    pendingTikTokCombos.delete(key);
  }

  // update existing rendered card
  if (existing && document.body.contains(existing.el)) {
    existing.item = finalItem;

    if (existing.countEl) {
      existing.countEl.textContent =
        `x${escapeHtml(finalItem.count || 1)}`;
    }

    return;
  }

  renderTikTokGift(finalItem, key);
}

function renderTikTokGift(item, key) {
  const existing =
    renderedTikTokGiftCards.get(key);

  if (existing && document.body.contains(existing.el)) {
    return;
  }

  const baseCoins = Number(
    item.raw?.diamondCount ||
    item.raw?.gift?.diamond_count ||
    item.raw?.gift?.diamondCount ||
    item.raw?.coins ||
    0
  );

  const repeatCount = Number(
    item.raw?.repeatCount ||
    item.raw?.repeat_count ||
    item.count ||
    1
  );

  const giftCoins = baseCoins * repeatCount;

  let giftTier = "gift-tier-1";

  if (giftCoins >= 5000) giftTier = "gift-tier-4";
  else if (giftCoins >= 1000) giftTier = "gift-tier-3";
  else if (giftCoins >= 100) giftTier = "gift-tier-2";

  const el = document.createElement("div");

  el.className =
    `msg tiktok-gift platform-tiktok ${giftTier}`;
  el.dataset.kind = item.kind || "tiktokGift";
  el.dataset.platform = item.platform || "TikTok";
  el.dataset.alertType = item.alertType || "";
  if (isDemoItem(item)) el.dataset.demo = "true";

  applyPlatformVariables(el, "TikTok", item);

  el.innerHTML = `
    <div class="avatar-wrap">
      <img
        class="avatar"
        src="${escapeAttr(item.avatar)}"
      >
    </div>

    <div class="tiktok-gift-card">
      <span class="bubble-glow gift-glow-layer" aria-hidden="true"></span>
      <div class="tiktok-gift-info">
        <div class="tiktok-gift-user">
          ${escapeHtml(item.user)}
        </div>

        <div class="tiktok-gift-text">
          sent ${escapeHtml(item.giftName)}
        </div>
      </div>

      ${item.giftImage
      ? `
          <img
            class="tiktok-gift-image"
            src="${escapeAttr(item.giftImage)}"
          >
        `
      : ""}

      ${item.count
      ? `
          <div class="tiktok-gift-count">
            x${escapeHtml(item.count)}
          </div>
        `
      : ""}
    </div>
  `;

  chat.appendChild(el);

  renderedTikTokGiftCards.set(key, {
    el,
    item,
    countEl:
      el.querySelector(".tiktok-gift-count")
  });

  currentGroup = null;

  trimMessages();
  maybeAutoScrollToBottom();
  maybeRemoveLater(el);
}

function handleModerationEvent(source, type, data) {
  if (source !== "Twitch" && source !== "YouTube") return false;

  const lowerType = String(type || "").toLowerCase();

  if (
    lowerType.includes("messagedeleted") ||
    lowerType.includes("message_deleted") ||
    lowerType.includes("deletemessage") ||
    lowerType.includes("chatmessagedeleted")
  ) {
    const messageId =
      data.messageId ||
      data.targetMessageId ||
      data.id ||
      data.message?.id ||
      data.message?.messageId;

    if (messageId) {
      deleteMessageById(messageId);
      return true;
    }
  }

  if (
    lowerType.includes("userbanned") ||
    lowerType.includes("usertimedout") ||
    lowerType.includes("usertimedout") ||
    lowerType.includes("timeout") ||
    lowerType.includes("ban")
  ) {
    const user =
      data.userName ||
      data.login ||
      data.user?.login ||
      data.user?.name ||
      data.targetUserName ||
      data.targetUser?.login ||
      data.targetUser?.name;

    if (user) {
      deleteMessagesByUser(user);
      return true;
    }
  }

  if (lowerType.includes("clearchat")) {
    chat.innerHTML = "";
    messageIndex.clear();
    currentGroup = null;
    return true;
  }

  return false;
}

function deleteMessageById(messageId) {
  const bubble = messageIndex.get(String(messageId));

  if (!bubble) return;

  const row = bubble.closest(".msg");

  if (row) {
    row.remove();
  }

  messageIndex.delete(String(messageId));
}

function indexTikTokMessage(item) {
  const messageId = String(item.messageId || "");
  if (!messageId) return;

  getTikTokUserKeys(item.raw || {})
    .concat([item.user])
    .map(key => String(key || "").trim())
    .filter(Boolean)
    .forEach(key => {
      if (!tiktokUserMessageIndex.has(key)) {
        tiktokUserMessageIndex.set(key, new Set());
      }

      tiktokUserMessageIndex.get(key).add(messageId);
    });
}

function getTikTokUserKeys(data = {}) {
  const user = data.user || data.author || data.sender || {};

  return [
    data.userId,
    data.userID,
    data.user_id,
    data.uniqueId,
    data.uniqueID,
    data.unique_id,
    data.secUid,
    data.secUID,
    data.sec_uid,
    data.nickname,
    data.userName,
    data.username,
    data.displayName,
    user.userId,
    user.userID,
    user.id,
    user.uniqueId,
    user.uniqueID,
    user.unique_id,
    user.secUid,
    user.secUID,
    user.nickname,
    user.displayName,
    user.userName,
    user.username
  ]
    .map(value => String(value || "").trim())
    .filter(Boolean);
}

function deleteTikTokMessagesByUserKey(userKey) {
  const key = String(userKey || "").trim();
  if (!key) return;

  const ids = tiktokUserMessageIndex.get(key);

  if (!ids) {
    deleteMessagesByUser(key);
    return;
  }

  ids.forEach(id => {
    deleteMessageById(String(id));
  });

  tiktokUserMessageIndex.delete(key);
}

function deleteMessagesByUser(user) {
  const normalisedUser = String(user || "").toLowerCase();

  document.querySelectorAll(".msg").forEach(row => {
    const name = row.querySelector(".name")?.textContent || "";

    if (name.toLowerCase() === normalisedUser) {
      row.remove();
    }
  });

  currentGroup = null;
}

function removeLastPlainTwitchEmoteMessage(user) {
  const bubbles = [
    ...chat.querySelectorAll(".msg.platform-twitch:not(.gigantified) .message-bubble.emote-only")
  ];

  const matching = bubbles.filter(bubble => {
    const row = bubble.closest(".msg");
    const name =
      row?.querySelector(".name")?.textContent?.trim()?.toLowerCase();

    return name === String(user || "").toLowerCase();
  });

  const last = matching[matching.length - 1];

  if (!last) return;

  const age =
    Date.now() - Number(last.dataset.createdAt || 0);

  if (age > 1500) return;

  const row = last.closest(".msg");

  if (row?.querySelectorAll(".message-bubble").length > 1) {
    last.remove();
  } else {
    row?.remove();
  }

  currentGroup = null;
}

function indexMessage(item, bubble) {
  if (!item.messageId) return;

  messageIndex.set(String(item.messageId), bubble);
}

function applyPlatformVariables(el, platform, item = null) {
  item = {
    ...(item || {}),
    styleType: item?.styleType || el?.dataset?.styleType || "",
    alertType: item?.alertType || el?.dataset?.alertType || "",
    kind: item?.kind || el?.dataset?.kind || ""
  };

  if (item?.styleType === "rainbow") {
    repairRainbowTypeStyle(cfg);
  }

  const key = String(platform || "").toLowerCase();
  const platformConfig = cfg.platforms[key];

  const color =
    cfg.style?.useCustomAccentColor
      ? cfg.style.accentColor || "#9146ff"
      : getMessageTypeColor(item, key) || platformConfig?.color;
  const typeStyle =
    cfg.style?.useCustomAccentColor
      ? getAccentTypeStyle(color)
      : getMessageTypeStyle(item, key);
  const defaultTypeStyle = getDefaultMessageTypeStyle(item, key);

  if (!color && !platformConfig) return;

  el.style.setProperty("--platform-color", color || platformConfig.color);
  el.style.setProperty(
    "--platform-glow",
    color
      ? `color-mix(in srgb, ${color} 58%, transparent)`
      : platformConfig.glow
  );

  applyTypeStyleVariables(el, typeStyle, color || platformConfig.color, defaultTypeStyle);
}

window.applyPreviewPlatformVariables = applyPlatformVariables;

window.debugRainbowTypeStyle = function () {
  const el = document.querySelector("#typeStyleModalPreview .msg[data-style-type='rainbow']");
  const style = el ? getComputedStyle(el) : null;

  return {
    specialRainbowColor: cfg.style?.colors?.special?.rainbow,
    rainbowOne: cfg.style?.colors?.rainbow?.one,
    typeStyle: cloneConfigValue(cfg.style?.typeStyles?.special?.rainbow),
    inlineStyle: el?.getAttribute("style") || "",
    computedVars: style
      ? {
          platformColor: style.getPropertyValue("--platform-color").trim(),
          titleBgGradient: style.getPropertyValue("--title-bg-gradient").trim(),
          titleIconBgGradient: style.getPropertyValue("--title-icon-bg-gradient").trim(),
          messageBorderGradient: style.getPropertyValue("--message-border-gradient").trim(),
          messageBgGradient: style.getPropertyValue("--message-bg-gradient").trim()
        }
      : null
  };
};

function getMessageTypeColor(item, platformKey = "") {
  const colors = cfg.style?.colors || {};
  const key = platformKey || String(item?.platform || "").toLowerCase();

  if (!item) return "";

  const alertParts = String(item.alertType || "").split(".").filter(Boolean);
  const alertGroup = alertParts[0] || "";
  const alertType = alertParts[1] || "";

  if (item.styleType) {
    if (item.styleType === "rainbow") {
      return colors.rainbow?.one || "#ff004c";
    }

    return colors.special?.[item.styleType] || "";
  }

  if (alertGroup === "donations") {
    return colors.donations?.[alertType] || "";
  }

  if (alertGroup && alertType) {
    return colors[alertGroup]?.[alertType] || "";
  }

  if (item.kind === "chat" || !item.kind) {
    return colors[key]?.chat || "";
  }

  if (item.kind === "tiktokGift") {
    return colors.tiktok?.gifts || "";
  }

  return "";
}

function getAccentTypeStyle(color) {
  const accent = color || cfg.style?.accentColor || "#9146ff";
  const style = { ...DEFAULT_TYPE_STYLE };

  [
    "avatarGlow",
    "avatarBorder",
    "titleGlow",
    "titleBorder",
    "titleBg",
    "titleIconBg",
    "messageGlow",
    "messageBorder",
    "alertGlow",
    "alertBorder",
    "alertBg",
    "giftGlow",
    "giftBorder",
    "giftBg"
  ].forEach(prefix => {
    applySolidGradientDefault(style, prefix, accent, {
      opacity: style[`${prefix}Opacity`] ?? 1
    });
  });

  applyGradientDefaults(
    style,
    "messageBg",
    [accent, "#10121e", "#06060c", "#08080f"],
    [0, 36, 78, 100],
    { mode: "radial", alphas: [0.22, 0.98, 1, 1] }
  );

  return style;
}

function getMessageTypeStyle(item, platformKey = "") {
  const typeStyles = cfg.style?.typeStyles || {};
  const key = platformKey || String(item?.platform || "").toLowerCase();

  if (!item) return null;

  const alertParts = String(item.alertType || "").split(".").filter(Boolean);
  const alertGroup = alertParts[0] || "";
  const alertType = alertParts[1] || "";
  const alertVariant = alertParts[2] || "";

  if (item.styleType) {
    return typeStyles.special?.[item.styleType] || null;
  }

  if (alertGroup === "donations") {
    return typeStyles.donations?.[alertType] || null;
  }

  if (alertGroup === "twitch" && alertType === "announcements" && alertVariant) {
    return typeStyles.twitch?.[getAnnouncementTypeStyleKey(alertVariant)] ||
      typeStyles.twitch?.announcements ||
      null;
  }

  if (alertGroup && alertType) {
    return typeStyles[alertGroup]?.[alertType] || null;
  }

  if (item.kind === "chat" || !item.kind) {
    return typeStyles[key]?.chat || null;
  }

  if (item.kind === "tiktokGift") {
    return typeStyles.tiktok?.gifts || null;
  }

  return null;
}

function getDefaultMessageTypeStyle(item, platformKey = "") {
  const defaults = DEFAULT_STYLE_PRESET.typeStyles || buildDefaultTypeStyles(DEFAULT_CONFIG.style);
  const currentDefaults = buildDefaultTypeStyles(cfg.style || DEFAULT_CONFIG.style);
  const key = platformKey || String(item?.platform || "").toLowerCase();

  if (!item) return null;

  const alertParts = String(item.alertType || "").split(".").filter(Boolean);
  const alertGroup = alertParts[0] || "";
  const alertType = alertParts[1] || "";
  const alertVariant = alertParts[2] || "";

  if (item.styleType) {
    return currentDefaults.special?.[item.styleType] || null;
  }

  if (alertGroup === "donations") {
    return defaults.donations?.[alertType] || null;
  }

  if (alertGroup === "twitch" && alertType === "announcements" && alertVariant) {
    return defaults.twitch?.[getAnnouncementTypeStyleKey(alertVariant)] ||
      defaults.twitch?.announcements ||
      null;
  }

  if (alertGroup && alertType) {
    return defaults[alertGroup]?.[alertType] || null;
  }

  if (item.kind === "chat" || !item.kind) {
    return defaults[key]?.chat || null;
  }

  if (item.kind === "tiktokGift") {
    return defaults.tiktok?.gifts || null;
  }

  return null;
}

function getAnnouncementTypeStyleKey(value) {
  const key = String(value || "primary").toLowerCase();
  const suffix = key.charAt(0).toUpperCase() + key.slice(1);

  return `announcements${suffix}`;
}

function applyTypeStyleVariables(el, typeStyle, fallbackColor, defaultTypeStyle = null) {
  const style = {
    ...DEFAULT_TYPE_STYLE,
    ...(typeStyle || {})
  };
  const base = fallbackColor || "#9146ff";
  const avatarGlowEnabled = style.avatarGlowEnabled !== false;
  const titleGlowEnabled = style.titleGlowEnabled !== false;
  const messageGlowEnabled = style.messageGlowEnabled !== false;
  const alertGlowEnabled = style.alertGlowEnabled !== false;
  const giftGlowEnabled = style.giftGlowEnabled !== false;
  const avatarBorderEnabled = style.avatarBorderEnabled !== false;
  const titleBorderEnabled = style.titleBorderEnabled !== false;
  const messageBorderEnabled = style.messageBorderEnabled !== false;
  const alertBorderEnabled = style.alertBorderEnabled !== false;
  const giftBorderEnabled = style.giftBorderEnabled !== false;
  const hasOverrides = hasTypeStyleOverrides(typeStyle, defaultTypeStyle);
  const hasTitleGlowOverrides = hasTypeStyleKeyOverrides(typeStyle, defaultTypeStyle, [
    "titleGlowEnabled",
    ...getTypeGradientStyleKeys("titleGlow")
  ]);
  const hasTitleBorderOverrides = hasTypeStyleKeyOverrides(typeStyle, defaultTypeStyle, [
    "titleBorderEnabled",
    ...getTypeGradientStyleKeys("titleBorder")
  ]);
  const hasAvatarGlowOverrides = hasTypeStyleKeyOverrides(typeStyle, defaultTypeStyle, [
    "avatarGlowEnabled",
    ...getTypeGradientStyleKeys("avatarGlow")
  ]);
  const hasAvatarBorderOverrides = hasTypeStyleKeyOverrides(typeStyle, defaultTypeStyle, [
    "avatarBorderEnabled",
    ...getTypeGradientStyleKeys("avatarBorder")
  ]);
  const hasTitleBgOverrides = hasTypeStyleKeyOverrides(typeStyle, defaultTypeStyle, [
    ...getTypeGradientStyleKeys("titleBg"),
    ...getTypeGradientStyleKeys("titleIconBg")
  ]);
  const hasMessageGlowOverrides = hasTypeStyleKeyOverrides(typeStyle, defaultTypeStyle, [
    "messageGlowEnabled",
    ...getTypeGradientStyleKeys("messageGlow")
  ]);
  const hasMessageBorderOverrides = hasTypeStyleKeyOverrides(typeStyle, defaultTypeStyle, [
    "messageBorderEnabled",
    ...getTypeGradientStyleKeys("messageBorder")
  ]);
  const hasMessageBgOverrides = hasTypeStyleKeyOverrides(typeStyle, defaultTypeStyle, [
    ...getTypeGradientStyleKeys("messageBg")
  ]);
  const hasAlertGlowOverrides = hasTypeStyleKeyOverrides(typeStyle, defaultTypeStyle, [
    "alertGlowEnabled",
    ...getTypeGradientStyleKeys("alertGlow")
  ]);
  const hasAlertBorderOverrides = hasTypeStyleKeyOverrides(typeStyle, defaultTypeStyle, [
    "alertBorderEnabled",
    ...getTypeGradientStyleKeys("alertBorder")
  ]);
  const hasAlertBgOverrides = hasTypeStyleKeyOverrides(typeStyle, defaultTypeStyle, [
    ...getTypeGradientStyleKeys("alertBg")
  ]);
  const hasGiftGlowOverrides = hasTypeStyleKeyOverrides(typeStyle, defaultTypeStyle, [
    "giftGlowEnabled",
    ...getTypeGradientStyleKeys("giftGlow")
  ]);
  const hasGiftBorderOverrides = hasTypeStyleKeyOverrides(typeStyle, defaultTypeStyle, [
    "giftBorderEnabled",
    ...getTypeGradientStyleKeys("giftBorder")
  ]);
  const hasGiftBgOverrides = hasTypeStyleKeyOverrides(typeStyle, defaultTypeStyle, [
    ...getTypeGradientStyleKeys("giftBg")
  ]);
  const isTikTokGiftCard = el.classList.contains("tiktok-gift");
  const giftBgPrefix = hasGiftBgOverrides || !hasAlertBgOverrides
    ? "giftBg"
    : "alertBg";
  const giftBgOpacity = hasGiftBgOverrides || !hasAlertBgOverrides
    ? style.giftBgOpacity
    : style.alertBgOpacity;

  el.classList.toggle("type-style-custom", hasOverrides);
  el.classList.toggle("type-style-avatar-glow", hasAvatarGlowOverrides);
  el.classList.toggle("type-style-avatar-border", hasAvatarBorderOverrides);
  el.classList.toggle("type-style-title-glow", hasTitleGlowOverrides);
  el.classList.toggle("type-style-title-border", hasTitleBorderOverrides);
  el.classList.toggle("type-style-title-bg", hasTitleBgOverrides);
  el.classList.toggle("type-style-message-glow", hasMessageGlowOverrides);
  el.classList.toggle("type-style-message-border", hasMessageBorderOverrides);
  el.classList.toggle("type-style-message-bg", hasMessageBgOverrides);
  el.classList.toggle("type-style-alert-glow", hasAlertGlowOverrides && el.classList.contains("alert"));
  el.classList.toggle("type-style-alert-border", hasAlertBorderOverrides && el.classList.contains("alert"));
  el.classList.toggle("type-style-alert-bg", hasAlertBgOverrides && el.classList.contains("alert"));
  el.classList.toggle("type-style-gift-glow", hasGiftGlowOverrides && isTikTokGiftCard);
  el.classList.toggle("type-style-gift-border", hasGiftBorderOverrides && isTikTokGiftCard);
  el.classList.toggle("type-style-gift-bg", (hasGiftBgOverrides || hasAlertBgOverrides) && isTikTokGiftCard);
  applyGlowVars(el, style, "avatarGlow", "--avatar-glow-color", "--avatar-glow-gradient", base, style.avatarGlowOpacity, avatarGlowEnabled);
  if (avatarBorderEnabled) {
    el.style.setProperty("--avatar-border-width", "3px");
    applyTypeSolidColorVar(el, style, "avatarBorder", "--avatar-border-color", "#ffffff", style.avatarBorderOpacity);
  } else {
    el.style.setProperty("--avatar-border-width", "0px");
    el.style.setProperty("--avatar-border-color", "transparent");
  }
  applyGlowVars(el, style, "titleGlow", "--title-glow-color", "--title-glow-gradient", base, style.titleGlowOpacity, titleGlowEnabled);
  if (titleBorderEnabled) {
    el.style.setProperty("--title-border-width", "2px");
    applyTypeSolidColorVar(el, style, "titleBorder", "--title-border-color", base, style.titleBorderOpacity);
  } else {
    el.style.setProperty("--title-border-width", "0px");
    el.style.setProperty("--title-border-color", "transparent");
  }
  setRgbaCssVar(el, "--title-bg-color", style.titleBgColor || base, style.titleBgOpacity);
  setRgbaCssVar(el, "--title-bg-color-2", style.titleBgColor2 || style.titleBgColor || base, style.titleBgOpacity);
  setRgbaCssVar(el, "--title-icon-bg-color", style.titleIconBgColor || style.titleBgColor || base, style.titleBgOpacity);
  setRgbaCssVar(el, "--title-icon-bg-color-2", style.titleIconBgColor2 || style.titleIconBgColor || style.titleBgColor2 || style.titleBgColor || base, style.titleBgOpacity);
  applyTypeGradientVar(el, style, "titleBg", "--title-bg-gradient", base, style.titleBgOpacity);
  applyTypeGradientVar(el, style, "titleIconBg", "--title-icon-bg-gradient", style.titleBgColor || base, style.titleBgOpacity);
  applyGlowVars(el, style, "messageGlow", "--message-glow-color", "--message-glow-gradient", base, style.messageGlowOpacity, messageGlowEnabled);
  if (messageBorderEnabled) {
    el.style.setProperty("--message-border-width", "2px");
    applyTypeSolidColorVar(el, style, "messageBorder", "--message-border-color", base, style.messageBorderOpacity);
    applyTypeGradientVar(el, style, "messageBorder", "--message-border-gradient", base, style.messageBorderOpacity);
  } else {
    el.style.setProperty("--message-border-width", "0px");
    el.style.setProperty("--message-border-color", "transparent");
    el.style.setProperty("--message-border-gradient", "linear-gradient(90deg, transparent 0%, transparent 100%)");
  }
  setRgbaCssVar(el, "--message-bg-color", style.messageBgColor || base, style.messageBgOpacity);
  applyTypeGradientVar(el, style, "messageBg", "--message-bg-gradient", base, style.messageBgOpacity);
  if (el.dataset.styleType === "rainbow") {
    applyRainbowAnimationVariables(el, style, base);
  }
  applyGlowVars(el, style, "alertGlow", "--alert-glow-color", "--alert-glow-gradient", base, style.alertGlowOpacity, alertGlowEnabled);
  if (alertBorderEnabled) {
    el.style.setProperty("--alert-border-width", "2px");
    applyTypeSolidColorVar(el, style, "alertBorder", "--alert-border-color", base, style.alertBorderOpacity);
    applyTypeGradientVar(el, style, "alertBorder", "--alert-border-gradient", base, style.alertBorderOpacity);
  } else {
    el.style.setProperty("--alert-border-width", "0px");
    el.style.setProperty("--alert-border-color", "transparent");
    el.style.setProperty("--alert-border-gradient", "linear-gradient(90deg, transparent 0%, transparent 100%)");
  }
  setRgbaCssVar(el, "--alert-bg-color", style.alertBgColor || base, style.alertBgOpacity);
  applyTypeGradientVar(el, style, "alertBg", "--alert-bg-gradient", base, style.alertBgOpacity);
  applyGlowVars(el, style, "giftGlow", "--gift-glow-color", "--gift-glow-gradient", base, style.giftGlowOpacity, giftGlowEnabled);
  if (giftBorderEnabled) {
    el.style.setProperty("--gift-border-width", "2px");
    applyTypeSolidColorVar(el, style, "giftBorder", "--gift-border-color", base, style.giftBorderOpacity);
    applyTypeGradientVar(el, style, "giftBorder", "--gift-border-gradient", base, style.giftBorderOpacity);
  } else {
    el.style.setProperty("--gift-border-width", "0px");
    el.style.setProperty("--gift-border-color", "transparent");
    el.style.setProperty("--gift-border-gradient", "linear-gradient(90deg, transparent 0%, transparent 100%)");
  }
  setRgbaCssVar(el, "--gift-bg-color", style[`${giftBgPrefix}Color`] || base, giftBgOpacity);
  applyTypeGradientVar(el, style, giftBgPrefix, "--gift-bg-gradient", base, giftBgOpacity);
}

function applyRainbowAnimationVariables(el, style, fallbackColor) {
  const colors = TYPE_GRADIENT_SUFFIXES
    .map(suffix => style[`titleBgColor${suffix}`])
    .filter(Boolean);
  const fallback = [
    cfg.style?.colors?.rainbow?.one,
    cfg.style?.colors?.rainbow?.two,
    cfg.style?.colors?.rainbow?.three,
    cfg.style?.colors?.rainbow?.four,
    cfg.style?.colors?.rainbow?.five,
    cfg.style?.colors?.rainbow?.six,
    cfg.style?.colors?.rainbow?.seven
  ].filter(Boolean);
  const palette = colors.length ? colors : fallback;

  for (let index = 0; index < 7; index += 1) {
    const color = palette[index] || palette[palette.length - 1] || fallbackColor || "#ff00d4";
    el.style.setProperty(`--rainbow-color-${index + 1}`, color);
  }
}

function hasTypeStyleOverrides(typeStyle, defaultTypeStyle = null) {
  return hasTypeStyleKeyOverrides(typeStyle, defaultTypeStyle, Object.keys(DEFAULT_TYPE_STYLE));
}

function hasTypeStyleKeyOverrides(typeStyle, defaultTypeStyle = null, keys = []) {
  if (!typeStyle) return false;
  const defaults = {
    ...DEFAULT_TYPE_STYLE,
    ...(defaultTypeStyle || {})
  };

  return keys.some(key => {
    const value = typeStyle[key];
    const defaultValue = defaults[key];

    if (value === undefined || value === null || value === "") return false;

    return !areTypeStyleValuesEqual(value, defaultValue);
  });
}

function areTypeStyleValuesEqual(value, defaultValue) {
  const valueText = String(value).trim();
  const defaultText = String(defaultValue).trim();
  const valueHex = valueText.match(/^#?([0-9a-f]{6})$/i);
  const defaultHex = defaultText.match(/^#?([0-9a-f]{6})$/i);

  if (valueHex && defaultHex) {
    return valueHex[1].toLowerCase() === defaultHex[1].toLowerCase();
  }

  if (valueText === "" || defaultText === "") {
    return valueText === defaultText;
  }

  const valueNumber = Number(value);
  const defaultNumber = Number(defaultValue);

  if (Number.isFinite(valueNumber) && Number.isFinite(defaultNumber)) {
    return valueNumber === defaultNumber;
  }

  return valueText === defaultText;
}

function setRgbaCssVar(el, name, color, opacity) {
  el.style.setProperty(name, toRgba(color, opacity));
}

function applyTypeSolidColorVar(el, style, prefix, cssVar, fallbackColor, opacity = 1) {
  el.style.setProperty(
    cssVar,
    buildTypeGradientSolidColor(style, prefix, fallbackColor, opacity)
  );
}

function applyTypeGradientVar(el, style, prefix, cssVar, fallbackColor, opacity = 1) {
  el.style.setProperty(
    cssVar,
    buildTypeGradient(style, prefix, fallbackColor, opacity)
  );
}

function applyGlowVars(el, style, prefix, colorVar, gradientVar, fallbackColor, opacity = 1, enabled = true) {
  if (!enabled) {
    el.style.setProperty(colorVar, "transparent");
    el.style.setProperty(gradientVar, "linear-gradient(90deg, transparent 0%, transparent 100%)");
    return;
  }

  const color = toRgba(style[`${prefix}Color`] || style[`${prefix}Color2`] || fallbackColor, opacity);
  el.style.setProperty(colorVar, color);
  el.style.setProperty(gradientVar, `linear-gradient(90deg, ${color} 0%, ${color} 100%)`);
}

function getTypeGradientStyleKeys(prefix) {
  return [
    `${prefix}Enabled`,
    `${prefix}Mode`,
    `${prefix}Angle`,
    ...TYPE_GRADIENT_SUFFIXES.map(suffix => `${prefix}Color${suffix}`),
    ...TYPE_GRADIENT_SUFFIXES.map(suffix => `${prefix}Color${suffix}Stop`),
    ...TYPE_GRADIENT_SUFFIXES.map(suffix => `${prefix}Color${suffix}Alpha`),
    `${prefix}Opacity`
  ];
}

function buildTypeGradient(style, prefix, fallbackColor, opacity = 1) {
  const angle = clampNumber(style[`${prefix}Angle`], 0, 360);
  const mode = String(style[`${prefix}Mode`] || "linear").toLowerCase();
  const points = [];

  TYPE_GRADIENT_SUFFIXES.forEach((suffix, index) => {
    const color = style[`${prefix}Color${suffix}`];

    if (index > 1 && !color) return;

    points.push({
      color: color || points.at(-1)?.color || fallbackColor,
      stop: clampNumber(style[`${prefix}Color${suffix}Stop`], 0, 100),
      alpha:
        style[`${prefix}Color${suffix}Alpha`] === "" ||
        style[`${prefix}Color${suffix}Alpha`] === undefined
          ? opacity
          : clampNumber(style[`${prefix}Color${suffix}Alpha`], 0, 1)
    });
  });

  if (points.length === 1) {
    points.push({ color: points[0].color, stop: 100 });
  }

  const colorStops = points
    .map(point => `${toRgba(point.color, point.alpha)} ${point.stop}%`)
    .join(", ");

  if (mode === "radial") {
    return `radial-gradient(circle at top left, ${colorStops})`;
  }

  return `linear-gradient(${angle}deg, ${colorStops})`;
}

function buildTypeGradientSolidColor(style, prefix, fallbackColor, opacity = 1) {
  const firstColor = style[`${prefix}Color`] || style[`${prefix}Color2`] || fallbackColor;
  const firstAlpha =
    style[`${prefix}ColorAlpha`] === "" ||
    style[`${prefix}ColorAlpha`] === undefined
      ? opacity
      : clampNumber(style[`${prefix}ColorAlpha`], 0, 1);

  return toRgba(firstColor, firstAlpha);
}

function toRgba(color, opacity = 1) {
  const alpha = clampNumber(opacity, 0, 1);
  const text = String(color || "").trim();
  const hex = text.match(/^#?([0-9a-f]{6})$/i);

  if (!hex) return text || `rgba(255,255,255,${alpha})`;

  const value = hex[1];
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);

  return `rgba(${r},${g},${b},${alpha})`;
}

function clampNumber(value, min, max) {
  const number = Number(value);

  if (!Number.isFinite(number)) return min;

  return Math.min(max, Math.max(min, number));
}

function getPlatformIcon(platform) {
  const key = String(platform || "").toLowerCase();

  if (key === "twitch") return "icons/platforms/twitch-white.png";
  if (key === "youtube") return "icons/platforms/youtube.png";
  if (key === "tiktok") return "icons/platforms/tiktok.png";
  if (key === "kick") return "icons/platforms/kick.png";

  return "";
}

function getDonationPlatformLogo(platform) {
  const key = String(platform || "").toLowerCase();

  const simpleIcons = {
    kofi: "https://cdn.simpleicons.org/kofi/FF5E5B",
    "ko-fi": "https://cdn.simpleicons.org/kofi/FF5E5B",

    streamlabs: "https://cdn.simpleicons.org/streamlabs/80F5D2",

    patreon: "https://cdn.simpleicons.org/patreon/FF424D"
  };

  const faviconFallbacks = {
    streamelements:
      "https://icons.duckduckgo.com/ip3/streamelements.com.ico",

    "stream-elements":
      "https://icons.duckduckgo.com/ip3/streamelements.com.ico",

    fourthwall:
      "https://icons.duckduckgo.com/ip3/fourthwall.com.ico",

    donordrive:
      "https://icons.duckduckgo.com/ip3/donordrive.com.ico",

    tipeeestream:
      "https://icons.duckduckgo.com/ip3/tipeeestream.com.ico",

    "tipeee-stream":
      "https://icons.duckduckgo.com/ip3/tipeeestream.com.ico"
  };

  return (
    simpleIcons[key] ||
    faviconFallbacks[key] ||
    ""
  );
}

function getDonationAlertKey(platform) {
  const key = String(platform || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  if (key === "streamlabs") return "streamlabs";
  if (key === "streamelements") return "streamelements";
  if (key === "kofi") return "kofi";
  if (key === "tipeeestream") return "tipeeestream";
  if (key === "fourthwall") return "fourthwall";
  if (key === "patreon") return "patreon";
  if (key === "donordrive") return "donordrive";

  return key || "other";
}

function maybeRemoveLater(el) {
  const ms = Number(cfg.behaviour.removeMessagesAfterMs || 0);

  if (ms > 0) {
    setTimeout(() => {
      if (cfg.behaviour.hideAfterFade !== false) {
        el.classList.add("removing");
        setTimeout(() => el.remove(), 320);
      } else {
        el.remove();
      }
    }, ms);
  }
}

function renderMessageContent(item) {
  if (Array.isArray(item.parts) && item.parts.length > 0) {
    return renderParts(item.parts);
  }

  return renderTextWithThirdPartyEmotes(item.text || "");
}

function hydrateEmoteImageFallbacks(root) {
  root.querySelectorAll("img.emote").forEach(img => {
    img.addEventListener("error", () => {
      const fallback = img.alt || "";

      if (!fallback) {
        img.remove();
        return;
      }

      img.replaceWith(document.createTextNode(fallback));
      maybeAutoScrollToBottom();
    }, { once: true });
  });
}

function renderParts(parts) {
  return parts.map(part => {
    const type = String(part.type || "").toLowerCase();

    const text =
      part.text ||
      part.name ||
      part.value ||
      part.emoji ||
      part.alt ||
      "";

    const url =
      part.imageUrl ||
      part.imageURL ||
      part.url ||
      part.emoteUrl ||
      part.emoteURL ||
      part.image ||
      part.src ||
      "";

    if (
      isRenderableEmoteImageUrl(url) &&
      (
        type.includes("emote") ||
        type.includes("emoji") ||
        part.imageUrl ||
        part.emoteUrl ||
        part.url
      )
    ) {
      return `<img class="emote" src="${escapeAttr(url)}" alt="${escapeAttr(text || "emote")}">`;
    }

    return renderTextWithThirdPartyEmotes(text || url);
  }).join("");
}

function isRenderableEmoteImageUrl(value) {
  const text = String(value || "").trim();

  if (!text) return false;
  if (isTikTokEmoteUrl(text)) return true;
  if (/^(?:data:image\/|blob:|https?:\/\/|\/\/)/i.test(text)) return true;

  return /^(?:\.{0,2}\/)?[\w./-]+\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i.test(text);
}

function renderTextWithThirdPartyEmotes(text) {
  const raw = String(text || "");

  const tokens = raw.split(/(\[[^\]]+\]|:[^\s:]+:|\s+)/);

  // Unicode emoji mappings for Twitch emote text codes (e.g., iOS app sends :hearts:)
  const twitchEmoteUnicodeMap = {
    ":hearts:": "❤️",
    ":clubs:": "♣️",
    ":diamonds:": "♦️",
    ":spades:": "♠️",
    ":star:": "⭐",
    ":question:": "❓",
    ":exclamation:": "❗",
    ":smile:": "😊",
    ":thinking:": "🤔",
    ":wink:": "😉",
    ":cry:": "😭",
    ":laughing:": "😂",
    ":fire:": "🔥",
    ":100:": "💯",
    ":pray:": "🙏",
    ":clap:": "👏",
    ":thumbsup:": "👍",
    ":thumbsdown:": "👎"
  };

  return tokens.map(token => {
    if (/^\s+$/.test(token)) {
      return escapeHtml(token);
    }

    // Handle colon-wrapped emote markers (Twitch/YouTube emotes like :hearts:)
    if (/^:[^\s:]+:$/.test(token)) {
      // Check if we have a Unicode emoji mapping (for iOS app text emotes)
      if (twitchEmoteUnicodeMap[token]) {
        return twitchEmoteUnicodeMap[token];
      }
      // Otherwise skip it (browser sends as separate emote part with imageUrl)
      return "";
    }

    const emoteUrl = thirdPartyEmotes.get(token);

    const tiktokLiveEmotes = {
      "[wow]": "icons/tt-emotes/wow.png",
      "[laugh]": "icons/tt-emotes/laugh.png",
      "[thanks]": "icons/tt-emotes/thanks.png",
      "[laughcry]": "icons/tt-emotes/laughcry.png",
      "[thumb]": "icons/tt-emotes/thumb.png",
      "[hi]": "icons/tt-emotes/hi.png",
      "[heart]": "icons/tt-emotes/heart.png",
      "[congrat]": "icons/tt-emotes/congrat.png",

      "[rockyserious]": "icons/tt-emotes/rockyserious.png",
      "[rockyloveit]": "icons/tt-emotes/rockyloveit.png",
      "[rockyproud]": "icons/tt-emotes/rockyproud.png",
      "[rockycool]": "icons/tt-emotes/rockycool.png",

      "[rosiedislike]": "icons/tt-emotes/rosiedislike.png",
      "[rosieawkward]": "icons/tt-emotes/rosieawkward.png",
      "[rosiekisskiss]": "icons/tt-emotes/rosiekisskiss.png",
      "[rosiecute]": "icons/tt-emotes/rosiecute.png",

      "[jolliekissingface]": "icons/tt-emotes/jolliekissingface.png",
      "[jolliewow]": "icons/tt-emotes/jolliewow.png",
      "[jolliespeechless]": "icons/tt-emotes/jolliespeechless.png",
      "[jolliesatisfied]": "icons/tt-emotes/jolliesatisfied.png",

      "[sagethink]": "icons/tt-emotes/sagethink.png",
      "[sagefulfilled]": "icons/tt-emotes/sagefulfilled.png",
      "[sageclever]": "icons/tt-emotes/sageclever.png",
      "[sagemoney]": "icons/tt-emotes/sagemoney.png"
    };

    const tiktokEmoteUrl = tiktokLiveEmotes[token];

    if (emoteUrl) {
      return `<img class="emote" src="${escapeAttr(emoteUrl)}" alt="${escapeAttr(token)}">`;
    }

    if (tiktokEmoteUrl) {
      return `<img class="emote" src="${escapeAttr(tiktokEmoteUrl)}" alt="${escapeAttr(token)}">`;
    }

    if (isTikTokEmoteUrl(token)) {
      return `<img class="emote" src="${escapeAttr(token)}" alt="TikTok emote">`;
    }

    return escapeHtml(token);
  }).join("");
}

async function loadThirdPartyEmotes() {
  if (!cfg.thirdPartyEmotes.enabled) return;

  await Promise.allSettled([
    loadSevenTvGlobalEmotes(),
    loadBttvGlobalEmotes(),
    loadBttvChannelEmotes(),
    loadFfzGlobalEmotes(),
    loadFfzChannelEmotes()
  ]);

  console.log("Third-party emotes loaded:", thirdPartyEmotes.size);
}

async function loadSevenTvGlobalEmotes() {
  if (!cfg.thirdPartyEmotes.seventv.enabled) return;

  try {
    const res = await fetch("https://7tv.io/v3/emote-sets/global");
    const data = await res.json();

    for (const emote of data.emotes || []) {
      const name = emote.name;
      const files = emote.data?.host?.files || [];
      const file = files.find(f => f.format === "WEBP" && f.name.includes("2x")) || files[0];

      if (name && file) {
        thirdPartyEmotes.set(name, `https:${emote.data.host.url}/${file.name}`);
      }
    }
  } catch (err) {
    console.warn("7TV global emotes failed:", err);
  }
}

async function loadBttvGlobalEmotes() {
  if (!cfg.thirdPartyEmotes.bttv.enabled) return;

  try {
    const res = await fetch("https://api.betterttv.net/3/cached/emotes/global");
    const data = await res.json();

    for (const emote of data || []) {
      if (emote.code && emote.id) {
        thirdPartyEmotes.set(emote.code, `https://cdn.betterttv.net/emote/${emote.id}/2x`);
      }
    }
  } catch (err) {
    console.warn("BTTV global emotes failed:", err);
  }
}

async function loadBttvChannelEmotes() {
  if (!cfg.thirdPartyEmotes.bttv.enabled) return;

  const twitchUserId = cfg.thirdPartyEmotes.bttv.twitchUserId;

  if (!twitchUserId) return;

  try {
    const res = await fetch(`https://api.betterttv.net/3/cached/users/twitch/${encodeURIComponent(twitchUserId)}`);
    const data = await res.json();

    const emotes = [
      ...(data.channelEmotes || []),
      ...(data.sharedEmotes || [])
    ];

    for (const emote of emotes) {
      if (emote.code && emote.id) {
        thirdPartyEmotes.set(emote.code, `https://cdn.betterttv.net/emote/${emote.id}/2x`);
      }
    }
  } catch (err) {
    console.warn("BTTV channel emotes failed:", err);
  }
}

async function loadFfzGlobalEmotes() {
  if (!cfg.thirdPartyEmotes.ffz.enabled) return;

  try {
    const res = await fetch("https://api.frankerfacez.com/v1/set/global");
    const data = await res.json();

    for (const setId of data.default_sets || []) {
      const set = data.sets?.[setId];
      addFfzSet(set);
    }
  } catch (err) {
    console.warn("FFZ global emotes failed:", err);
  }
}

async function loadFfzChannelEmotes() {
  if (!cfg.thirdPartyEmotes.ffz.enabled) return;

  const channel = cfg.thirdPartyEmotes.ffz.twitchChannelName;

  if (!channel) return;

  try {
    const res = await fetch(`https://api.frankerfacez.com/v1/room/${encodeURIComponent(channel)}`);
    const data = await res.json();

    for (const setId of data.sets ? Object.keys(data.sets) : []) {
      addFfzSet(data.sets[setId]);
    }
  } catch (err) {
    console.warn("FFZ channel emotes failed:", err);
  }
}

function addFfzSet(set) {
  if (!set || !Array.isArray(set.emoticons)) return;

  for (const emote of set.emoticons) {
    const url =
      emote.urls?.["2"] ||
      emote.urls?.["1"] ||
      emote.urls?.["4"];

    if (emote.name && url) {
      thirdPartyEmotes.set(emote.name, url.startsWith("//") ? `https:${url}` : url);
    }
  }
}

async function enrichTwitchAvatar(username, avatarId) {
  const img = document.getElementById(avatarId);
  if (!img || !username) return;

  const avatar = await getTwitchAvatar(username);
  if (avatar && img) img.src = avatar;
}

async function getTwitchAvatar(username) {
  const key = String(username).toLowerCase();

  if (avatarCache.has(key)) {
    return avatarCache.get(key);
  }

  try {
    const res = await fetch(`https://decapi.me/twitch/avatar/${encodeURIComponent(key)}`);
    const url = await res.text();

    if (url && url.startsWith("http")) {
      avatarCache.set(key, url);
      return url;
    }
  } catch (err) {
    console.warn("Could not fetch Twitch avatar:", username, err);
  }

  const fallback = fallbackAvatar("Twitch", username);
  avatarCache.set(key, fallback);
  return fallback;
}

function isHighlightedMessage(data) {
  return (
    data.isHighlighted === true ||
    data.isHighlight === true ||
    data.highlighted === true ||
    data.message?.isHighlighted === true ||
    data.message?.isHighlight === true ||
    data.message?.highlighted === true ||
    data.message?.tags?.["msg-id"] === "highlighted-message" ||
    data.tags?.["msg-id"] === "highlighted-message" ||
    data.msgId === "highlighted-message" ||
    data.messageIdType === "highlighted-message"
  );
}

function isGigantifiedMessage(data, text, parts) {
  return (
    data.gigantified === true ||
    data.isGigantified === true ||
    data.gigantify === true ||
    data.message?.gigantified === true ||
    data.message?.isGigantified === true ||
    data.message?.gigantify === true ||
    data.tags?.gigantified === "1" ||
    data.tags?.gigantify === "1" ||
    data.message?.tags?.gigantified === "1" ||
    data.message?.tags?.gigantify === "1"
  );
}


function isEmoteOnlyMessage(text, parts) {
  if (Array.isArray(parts) && parts.length > 0) {
    const meaningfulParts = parts.filter(part => {
      const value = String(part.text || part.name || part.value || "").trim();
      return value.length > 0 || part.imageUrl || part.url || part.emoteUrl;
    });

    if (meaningfulParts.length === 0) return false;

    return meaningfulParts.every(part => {
      const type = String(part.type || "").toLowerCase();

      return (
        type.includes("emote") ||
        type.includes("emoji") ||
        part.imageUrl ||
        part.url ||
        part.emoteUrl
      );
    });
  }

  const clean = String(text || "").trim();

  if (!clean) return false;

  const tokens = clean.split(/\s+/);

  if (tokens.length > 5) return false;

  return tokens.every(token =>
    thirdPartyEmotes.has(token) ||
    isTikTokEmoteUrl(token) ||
    /^[:;=xX8][-oO']?[)\](DPp(/\\]+$/.test(token)
  );
}

function getUser(data) {
  return (
    // Streamer.bot reward/powerup events
    data.user_name ||
    data.user_login ||

    // Streamer.bot common
    data.user?.displayName ||
    data.user?.display ||
    data.user?.nickname ||
    data.user?.uniqueId ||
    data.user?.uniqueID ||
    data.user?.userName ||
    data.user?.username ||
    data.user?.name ||
    data.user?.login ||

    // Kick nested users
    data.sender?.name ||
    data.sender?.login ||
    data.author?.name ||
    data.author?.login ||

    // Generic display names
    data.displayName ||
    data.display_name ||

    // Generic usernames
    data.userName ||
    data.username ||
    data.user ||
    data.login ||
    data.name ||

    // Twitch follow/raid/sub edge cases
    data.followerUserName ||
    data.followerName ||
    data.followedUserName ||
    data.fromUserName ||
    data.targetUserName ||
    data.recipientUserName ||

    // TikTok
    data.nickname ||
    data.uniqueId ||

    // YouTube
    data.authorName ||
    data.author?.name ||

    // Final fallback
    "Unknown Pig"
  );
}

function getText(data) {
  return (
    data.text ||
    data.message?.message ||
    data.message?.text ||
    data.message ||
    data.comment ||
    data.body ||
    data.input ||
    ""
  );
}

function buildPartsFromEmotes(text, emotes) {
  if (!Array.isArray(emotes) || emotes.length === 0) return [];

  const rawText = String(text || "");
  const sortedEmotes = [...emotes]
    .filter(Boolean)
    .sort((a, b) => (Number(a.startIndex) || 0) - (Number(b.startIndex) || 0));

  const parts = [];
  let cursor = 0;

  sortedEmotes.forEach(emote => {
    const start = Number(emote.startIndex);
    const end = Number(emote.endIndex);

    if (Number.isNaN(start) || Number.isNaN(end) || start < 0 || end < start) {
      return;
    }

    if (cursor < start) {
      parts.push({ type: "text", text: rawText.slice(cursor, start) });
    }

    const token = rawText.slice(start, end) || emote.name || "";
    const imageUrl =
      emote.imageUrl ||
      emote.url ||
      emote.imageURL ||
      emote.emoteUrl ||
      emote.emoteURL ||
      "";

    if (isRenderableEmoteImageUrl(imageUrl)) {
      parts.push({
        type: "emote",
        imageUrl,
        text: token
      });
    } else {
      parts.push({ type: "text", text: token });
    }

    cursor = end;
  });

  if (cursor < rawText.length) {
    parts.push({ type: "text", text: rawText.slice(cursor) });
  }

  return parts;
}

function getParts(data) {
  const parts =
    data.parts ||
    data.message?.parts ||
    data.messageParts ||
    [];

  if (Array.isArray(parts) && parts.length > 0) {
    return parts;
  }

  const emotes = data.emotes || data.message?.emotes;
  if (Array.isArray(emotes) && emotes.length > 0) {
    return buildPartsFromEmotes(getText(data), emotes);
  }

  return [];
}

function getMessageId(data) {
  return (
    data.messageId ||
    data.commentId ||
    data.id ||
    data.message?.id ||
    data.message?.messageId ||
    data.comment?.id ||
    data.msgId ||
    ""
  );
}

function getAvatar(data, platform, user) {
  return (
    data.user?.profileImageUrl ||
    data.user?.profileImage ||
    data.user?.profilePicture ||
    data.sender?.profilePicture ||
    data.author?.profilePicture ||
    data.author?.profileImageUrl ||
    data.author?.profileImage ||
    data.authorProfileImageUrl ||
    data.profileImageUrl ||
    data.profilePictureUrl ||
    data.profilePictureURL ||
    data.profilePicture ||
    data.avatar ||
    fallbackAvatar(platform, user)
  );
}

function getBadges(data) {
  return (
    data.user?.badges ||
    data.message?.badges ||
    data.badges ||
    []
  );
}

function getYouTubeBadges(data) {
  const badges = [];
  const user = data.user || data.author || data;

  if (user.isOwner || data.isOwner) {
    badges.push({ name: "Owner", imageUrl: YOUTUBE_BADGE_ICONS.owner });
  }

  if (user.isModerator || data.isModerator) {
    badges.push({ name: "Moderator", imageUrl: YOUTUBE_BADGE_ICONS.moderator });
  }

  if (user.isSponsor || data.isSponsor || user.isMember || data.isMember) {
    badges.push({ name: "Member", imageUrl: YOUTUBE_BADGE_ICONS.member });
  }

  if (user.isVerified || data.isVerified) {
    badges.push({ name: "Verified", imageUrl: YOUTUBE_BADGE_ICONS.verified });
  }

  return badges;
}

function renderBadges(badges) {
  if (!cfg.behaviour.showBadges) return "";
  if (!Array.isArray(badges)) return "";

  return badges.map(badge => {
    if (badge.imageUrl) {
      return `<img class="badge" src="${escapeAttr(badge.imageUrl)}" title="${escapeAttr(badge.name || "")}">`;
    }

    if (badge.text) {
      return `<span class="badge-text">${escapeHtml(badge.text)}</span>`;
    }

    return "";
  }).join("");
}

function shouldIgnoreUser(user) {
  const name = String(user || "").toLowerCase();

  return cfg.behaviour.ignoredUsers
    .map(u => String(u).toLowerCase())
    .includes(name);
}

function fallbackAvatar(platform, user) {
  const seed = encodeURIComponent(`${platform}-${user || "Unknown Pig"}`);
  return `https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}`;
}

function getMediaEmbed(text) {
  const value = String(text || "");
  const match = value.match(MEDIA_EMBED_RE);

  if (match) {
    const url = match[0];

    return {
      type: VIDEO_EMBED_RE.test(url) ? "video" : "image",
      url
    };
  }

  const tenor = getTenorEmbed(value);
  if (tenor) return tenor;

  return null;
}

function renderMediaEmbed(embed) {
  const src = escapeAttr(embed.url);

  if (embed.type === "tenor") {
    return `
      <iframe
        class="embed media-embed-tenor"
        src="${escapeAttr(`https://tenor.com/embed/${embed.postId}`)}"
        title="Tenor GIF"
        frameborder="0"
        allowfullscreen
      ></iframe>
    `;
  }

  if (embed.type === "video") {
    return `<video class="embed media-embed-video" src="${src}" autoplay muted loop playsinline controls></video>`;
  }

  return `<img class="embed media-embed-image" src="${src}" alt="">`;
}

function getTenorEmbed(text) {
  const urls = String(text || "").match(URL_RE) || [];

  for (const rawUrl of urls) {
    const postId = getTenorPostId(rawUrl);

    if (postId) {
      return {
        type: "tenor",
        url: rawUrl,
        postId
      };
    }
  }

  return null;
}

function getTenorPostId(rawUrl) {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (host !== "tenor.com") return "";

    const parts = url.pathname.split("/").filter(Boolean);
    const viewIndex = parts.findIndex(part => part.toLowerCase() === "view");
    const slug = viewIndex >= 0 ? parts[viewIndex + 1] : parts[0];
    const match = String(slug || "").match(/(?:^|-)(?:gif-)?(\d{6,})(?:\D|$)/);

    return match ? match[1] : "";
  } catch {
    return "";
  }
}

function getYouTubeLinkPreview(text) {
  const urls = String(text || "").match(URL_RE) || [];

  for (const rawUrl of urls) {
    const videoId = getYouTubeVideoId(rawUrl);

    if (videoId) {
      return {
        provider: "youtube",
        url: rawUrl,
        videoId,
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        title: "YouTube video",
        author: "YouTube"
      };
    }
  }

  return null;
}

function getYouTubeVideoId(rawUrl) {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      return cleanYouTubeId(url.pathname.split("/").filter(Boolean)[0]);
    }

    if (!host.endsWith("youtube.com") && !host.endsWith("youtube-nocookie.com")) {
      return "";
    }

    if (url.searchParams.get("v")) {
      return cleanYouTubeId(url.searchParams.get("v"));
    }

    const parts = url.pathname.split("/").filter(Boolean);
    const marker = parts.findIndex(part =>
      ["shorts", "embed", "live"].includes(part.toLowerCase())
    );

    return marker >= 0 ? cleanYouTubeId(parts[marker + 1]) : "";
  } catch {
    return "";
  }
}

function cleanYouTubeId(value) {
  const match = String(value || "").match(/^[a-zA-Z0-9_-]{6,}$/);
  return match ? match[0] : "";
}

function renderYouTubePreview(preview) {
  return `
    <a
      class="link-preview youtube-preview"
      href="${escapeAttr(preview.url)}"
      target="_blank"
      rel="noreferrer"
      data-youtube-preview
      data-url="${escapeAttr(preview.url)}"
    >
      <img class="link-preview-thumb" src="${escapeAttr(preview.thumbnail)}" alt="">
      <span class="link-preview-copy">
        <span class="link-preview-title">${escapeHtml(preview.title)}</span>
        <span class="link-preview-author">by ${escapeHtml(preview.author)}</span>
      </span>
    </a>
  `;
}

function renderLinkPreview(preview) {
  if (preview.provider === "youtube") {
    return renderYouTubePreview(preview);
  }

  return "";
}

async function hydrateYouTubePreview(card, preview) {
  try {
    const endpoint =
      `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(preview.url)}`;
    const response = await fetch(endpoint);

    if (!response.ok) return;

    const data = await response.json();
    const title = data.title || preview.title;
    const author = data.author_name || preview.author;
    const thumbnail = data.thumbnail_url || preview.thumbnail;

    card.querySelector(".link-preview-title").textContent = title;
    card.querySelector(".link-preview-author").textContent = `by ${author}`;
    card.querySelector(".link-preview-thumb").src = thumbnail;
  } catch (err) {
    console.warn("YouTube preview failed:", err);
  }
}

function canEmbedImage(item) {
  const platform = String(item.platform || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const settings = cfg.behaviour.imageEmbeds?.[platform];

  if (!settings) return false;
  if (settings.enabled === false) return false;
  if (settings.everyone) return true;

  const roles = getMessageRoles(item);

  return (
    (settings.broadcaster && roles.broadcaster) ||
    (settings.owner && roles.owner) ||
    (settings.moderators && roles.moderator) ||
    (settings.vips && roles.vip) ||
    (settings.subscribers && roles.subscriber) ||
    (settings.members && roles.member)
  );
}

function getMessageRoles(item) {
  const badges = normaliseBadges(item.badges);
  const raw = item.raw || {};
  const message = raw.message || {};
  const user = raw.user || raw.author || message.user || raw;
  const tags = raw.tags || message.tags || {};
  const rawBadges = normaliseBadges([
    raw.badges,
    user.badges,
    message.badges,
    tags.badges,
    tags["badges-raw"],
    raw.badgesRaw,
    raw.badges_raw
  ]);
  const allBadges = [...badges, ...rawBadges];

  return {
    broadcaster:
      hasBadge(allBadges, "broadcaster") ||
      Number(user.role) === 4 ||
      hasAnyTruthy(user, ["isBroadcaster", "broadcaster"]) ||
      hasAnyTruthy(raw, ["isBroadcaster", "broadcaster"]) ||
      hasAnyTruthy(message, ["isBroadcaster", "broadcaster"]),

    owner:
      hasBadge(allBadges, "owner") ||
      hasAnyTruthy(user, ["isOwner", "owner"]) ||
      hasAnyTruthy(raw, ["isOwner", "owner"]) ||
      hasAnyTruthy(message, ["isOwner", "owner"]),

    moderator:
      hasBadge(allBadges, "moderator") ||
      hasBadge(allBadges, "mod") ||
      Number(user.role) === 3 ||
      hasAnyTruthy(user, ["isModerator", "moderator", "isMod", "mod"]) ||
      hasAnyTruthy(raw, ["isModerator", "moderator", "isMod", "mod"]) ||
      hasAnyTruthy(message, ["isModerator", "moderator", "isMod", "mod"]) ||
      hasAnyTruthy(tags, ["mod", "moderator", "isMod", "isModerator"]),

    vip:
      hasBadge(allBadges, "vip") ||
      Number(user.role) === 2 ||
      hasAnyTruthy(user, ["isVip", "isVIP", "vip"]) ||
      hasAnyTruthy(raw, ["isVip", "isVIP", "vip"]) ||
      hasAnyTruthy(message, ["isVip", "isVIP", "vip"]),

    subscriber:
      hasBadge(allBadges, "subscriber") ||
      hasBadge(allBadges, "founder") ||
      hasAnyTruthy(user, ["isSubscriber", "subscriber", "isSubscribed"]) ||
      hasAnyTruthy(raw, ["isSubscriber", "subscriber"]) ||
      hasAnyTruthy(message, ["isSubscriber", "subscriber"]) ||
      hasAnyTruthy(tags, ["subscriber"]),

    member:
      hasBadge(allBadges, "member") ||
      hasBadge(allBadges, "sponsor") ||
      hasAnyTruthy(user, ["isSponsor", "isMember", "sponsor", "member"]) ||
      hasAnyTruthy(raw, ["isSponsor", "isMember", "sponsor", "member"]) ||
      hasAnyTruthy(message, ["isSponsor", "isMember", "sponsor", "member"])
  };
}

function normaliseBadges(badges) {
  if (Array.isArray(badges)) {
    return badges.flatMap(normaliseBadges);
  }

  if (!badges) return [];

  if (typeof badges === "object") {
    return Object.entries(badges)
      .flatMap(([key, value]) => {
        const badgeValue =
          value?.name ||
          value?.type ||
          value?.id ||
          value?.setId ||
          value?.text ||
          value;

        return [key, badgeValue];
      })
      .map(value => String(value || "").toLowerCase())
      .filter(Boolean);
  }

  return String(badges)
    .split(/[,\s]+/)
    .map(value => value.split("/")[0].toLowerCase())
    .filter(Boolean);
}

function hasBadge(badges, badgeName) {
  const target = String(badgeName).toLowerCase();
  return badges.some(badge => badge.includes(target));
}

function hasAnyTruthy(source, keys) {
  if (!source) return false;

  return keys.some(key => {
    const value = source[key];
    return value === true || value === 1 || value === "1" || value === "true";
  });
}

function removeMediaEmbedUrl(text, url) {
  return String(text || "")
    .replace(url, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function removeMediaEmbedUrlFromParts(parts, url) {
  if (!Array.isArray(parts) || parts.length === 0) return parts;

  return parts
    .map(part => {
      if (
        part.imageUrl ||
        part.imageURL ||
        part.url ||
        part.emoteUrl ||
        part.emoteURL
      ) {
        return part;
      }

      const next = { ...part };

      ["text", "name", "value"].forEach(key => {
        if (typeof next[key] === "string") {
          next[key] = removeMediaEmbedUrl(next[key], url);
        }
      });

      return next;
    })
    .filter(part => {
      const text = String(part.text || part.name || part.value || "").trim();
      return text.length > 0;
    });
}

function isTikTokEmoteUrl(value) {
  const text = String(value || "");

  return (
    text.startsWith("https://") &&
    (
      text.includes("tiktokcdn") ||
      text.includes("tiktokcdn-eu.com") ||
      text.includes("webcast")
    ) &&
    (
      text.includes("tplv-obj.image") ||
      text.includes("/webcast-") ||
      text.includes("/webcast/")
    )
  );
}

function trimMessages() {
  if (Number(maxMessages) <= 0) return;

  while (chat.children.length > maxMessages) {
    chat.removeChild(cfg.behaviour.scrollDirection === "down" ? chat.lastChild : chat.firstChild);
  }
}

function maybeAutoScrollToBottom() {
  if (cfg.behaviour.autoScroll === false && !cfg.scrollTest?.autoScroll) return;
  if (autoScrollPaused) return;

  requestAnimationFrame(() => {
    autoScrollIgnoreUntil = Date.now() + 1200;
    const scroller = getAutoScrollContainer();
    const top = cfg.behaviour.scrollDirection === "down"
      ? 0
      : scroller === window
        ? document.documentElement.scrollHeight
        : scroller.scrollHeight;

    scroller.scrollTo({
      top,
      behavior: "smooth"
    });
  });
}

function pauseScrollTestAutoScroll() {
  if (autoScrollPaused) return;

  autoScrollPaused = true;
  getAutoScrollResumeButton().classList.add("visible");
}

function resumeScrollTestAutoScroll(shouldScroll = true) {
  autoScrollPaused = false;

  if (autoScrollResumeButton) {
    autoScrollResumeButton.classList.remove("visible");
  }

  if (shouldScroll) {
    maybeAutoScrollToBottom();
  }
}

function getAutoScrollResumeButton() {
  if (autoScrollResumeButton) return autoScrollResumeButton;

  autoScrollResumeButton = document.createElement("button");
  autoScrollResumeButton.type = "button";
  autoScrollResumeButton.className = "autoscroll-resume";
  autoScrollResumeButton.textContent = "Autoscroll paused. Click to resume";
  autoScrollResumeButton.addEventListener("click", () => {
    resumeScrollTestAutoScroll();
  });

  document.body.appendChild(autoScrollResumeButton);

  return autoScrollResumeButton;
}

function isNearPageBottom() {
  const scroller = getAutoScrollContainer();
  const scrollTop = scroller === window ? window.scrollY : scroller.scrollTop;
  const viewportHeight =
    scroller === window
      ? window.innerHeight || document.documentElement.clientHeight
      : scroller.clientHeight;
  const scrollHeight =
    scroller === window
      ? Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
      : scroller.scrollHeight;

  return scrollHeight - (scrollTop + viewportHeight) < 80;
}

function getAutoScrollContainer() {
  return document.querySelector("[data-autoscroll-container]") || window;
}

function mergeConfig(base, override) {
  const output = { ...base };

  for (const key in override) {
    if (
      override[key] &&
      typeof override[key] === "object" &&
      !Array.isArray(override[key])
    ) {
      output[key] = mergeConfig(base[key] || {}, override[key]);
    } else {
      output[key] = override[key];
    }
  }

  return output;
}

function getStyleColor(styleConfig, path, fallback = "") {
  return path
    .split(".")
    .reduce((value, key) => value?.[key], styleConfig?.colors) || fallback;
}

function applyGradientDefaults(defaults, prefix, colors, stops, options = {}) {
  colors.slice(0, TYPE_GRADIENT_SUFFIXES.length).forEach((color, index) => {
    const suffix = TYPE_GRADIENT_SUFFIXES[index];
    defaults[`${prefix}Color${suffix}`] = color;
    defaults[`${prefix}Color${suffix}Stop`] = stops[index] ?? 100;

    if (Array.isArray(options.alphas)) {
      defaults[`${prefix}Color${suffix}Alpha`] = options.alphas[index] ?? "";
    }
  });

  if (options.mode) defaults[`${prefix}Mode`] = options.mode;
  if (typeof options.angle !== "undefined") defaults[`${prefix}Angle`] = options.angle;
  if (typeof options.opacity !== "undefined") defaults[`${prefix}Opacity`] = options.opacity;
}

function applyMessageBackgroundDefault(defaults, colors, options = {}) {
  applyGradientDefaults(
    defaults,
    "messageBg",
    colors,
    [0, options.secondStop ?? 36, 78, 100],
    {
      mode: "radial",
      angle: 135,
      opacity: 1,
      alphas: options.alphas || [0.13, 0.98, 1, 1]
    }
  );
}

function applyCardBackgroundDefault(defaults, prefix, colors, options = {}) {
  applyGradientDefaults(
    defaults,
    prefix,
    colors,
    options.stops || [0, 100, 100, 100],
    {
      mode: options.mode || "linear",
      angle: options.angle ?? 135,
      opacity: options.opacity ?? 1,
      alphas: options.alphas || [1, 1, "", ""]
    }
  );
}

function applySolidGradientDefault(defaults, prefix, color, options = {}) {
  const solid = color || "#9146ff";
  applyGradientDefaults(defaults, prefix, [solid, solid], [0, 100], options);
}

function applyRainbowTypeDefaults(defaults, styleConfig) {
  const rainbow = [
    getStyleColor(styleConfig, "rainbow.one", "#ff004c"),
    getStyleColor(styleConfig, "rainbow.two", "#ff8a00"),
    getStyleColor(styleConfig, "rainbow.three", "#fff700"),
    getStyleColor(styleConfig, "rainbow.four", "#00ff85"),
    getStyleColor(styleConfig, "rainbow.five", "#00c8ff"),
    getStyleColor(styleConfig, "rainbow.six", "#7a5cff"),
    getStyleColor(styleConfig, "rainbow.seven", "#ff00d4")
  ];
  const highlightGlow = getStyleColor(styleConfig, "effects.highlightGlow", "#ff00c8");
  const warmGlow = getStyleColor(styleConfig, "effects.highlightWarmGlow", "#ffb400");
  const borderColor = getStyleColor(styleConfig, "effects.tiktokRed", "#fe2c55");
  const avatarBorder = getStyleColor(styleConfig, "surfaces.avatarBorder", "#ffffff");

  defaults.avatarGlowColor = highlightGlow;
  defaults.avatarBorderColor = avatarBorder;
  defaults.titleGlowColor = highlightGlow;
  defaults.titleBorderColor = borderColor;
  defaults.messageGlowColor = highlightGlow;
  defaults.messageBorderColor = borderColor;
  applySolidGradientDefault(defaults, "avatarGlow", highlightGlow, { opacity: defaults.avatarGlowOpacity });
  applySolidGradientDefault(defaults, "avatarBorder", avatarBorder, { opacity: defaults.avatarBorderOpacity });
  applySolidGradientDefault(defaults, "titleGlow", highlightGlow, { opacity: defaults.titleGlowOpacity });
  applySolidGradientDefault(defaults, "titleBorder", borderColor, { opacity: defaults.titleBorderOpacity });
  applySolidGradientDefault(defaults, "messageGlow", highlightGlow, { opacity: defaults.messageGlowOpacity });
  applyGradientDefaults(
    defaults,
    "messageBorder",
    [...rainbow, rainbow[0]],
    [0, 14, 29, 43, 57, 71, 86, 100],
    { mode: "linear", angle: 90, opacity: defaults.messageBorderOpacity }
  );

  applyGradientDefaults(
    defaults,
    "titleBg",
    [...rainbow, rainbow[0]],
    [0, 14, 29, 43, 57, 71, 86, 100],
    { mode: "linear", angle: 90, opacity: 1 }
  );

  applyGradientDefaults(
    defaults,
    "titleIconBg",
    ["#2c124a", "#080512"],
    [0, 100],
    { mode: "linear", angle: 180, opacity: 0.95 }
  );

  applyGradientDefaults(
    defaults,
    "messageBg",
    ["#b86cff", "#121020", "#06060c", "#08070e"],
    [0, 36, 78, 100],
    { mode: "radial", angle: 135, opacity: 1 }
  );

  defaults.alertGlowColor = highlightGlow;
  defaults.alertBorderColor = borderColor;
  defaults.alertBgColor = highlightGlow;
  defaults.giftGlowColor = warmGlow;
  defaults.giftBorderColor = borderColor;
  defaults.giftBgColor = highlightGlow;
  applySolidGradientDefault(defaults, "alertGlow", highlightGlow, { opacity: defaults.alertGlowOpacity });
  applySolidGradientDefault(defaults, "alertBorder", borderColor, { opacity: defaults.alertBorderOpacity });
  applySolidGradientDefault(defaults, "giftGlow", warmGlow, { opacity: defaults.giftGlowOpacity });
  applySolidGradientDefault(defaults, "giftBorder", borderColor, { opacity: defaults.giftBorderOpacity });
}

function buildDefaultTypeStyles(styleConfig = {}) {
  return Object.fromEntries(
    Object.entries(STYLE_TYPE_GROUPS).map(([group, types]) => [
      group,
      Object.fromEntries(types.map(type => {
        const color =
          (group === "special" && type === "rainbow"
            ? getStyleColor(styleConfig, "rainbow.one", "#ff004c")
            : getStyleColor(styleConfig, `${group}.${type}`)) ||
          STYLE_TYPE_DEFAULT_COLORS[group]?.[type] ||
          "#9146ff";
        const titleColors = STYLE_TYPE_DEFAULT_TITLE_COLORS[group] || {};
        const tiktokBlue = getStyleColor(styleConfig, "effects.tiktokBlue", "#25f4ee");
        const tiktokChatPink = "#F8628F";
        const tiktokRed = getStyleColor(styleConfig, "effects.tiktokRed", "#fe2c55");
        const titleBorderDefaults = {
          twitch: { color: "#e0beff", opacity: 0.88 },
          youtube: { color: "#ffc8d4", opacity: 0.88 },
          tiktok: { color: "#bdebf1", opacity: 0.9 },
          kick: { color: "#d7ffc8", opacity: 0.9 }
        };
        const alertBgDefaults = {
          twitch: {
            colors: [titleColors.titleBgColor || "#8D05C3", titleColors.titleBgColor2 || "#5524AA", titleColors.titleBgColor2 || "#5524AA", titleColors.titleBgColor2 || "#5524AA"],
            alphas: [1, 1, 1, 1],
            stops: [0, 100, 100, 100]
          },
          youtube: {
            colors: ["#ff0033", "#ff7878", "#ff7878", "#ff7878"],
            alphas: [0.92, 0.72, 0.72, 0.72],
            stops: [0, 100, 100, 100]
          },
          tiktok: {
            colors: [tiktokBlue, tiktokRed, tiktokRed, tiktokRed],
            alphas: [0.92, 0.72, 0.72, 0.72],
            stops: [0, 100, 100, 100]
          },
          kick: {
            colors: ["#53fc18", "#2fc80f", "#2fc80f", "#2fc80f"],
            alphas: [0.94, 0.78, 0.78, 0.78],
            stops: [0, 100, 100, 100]
          },
          donations: {
            colors: [color, "#12121c", "#06060c", "#0a0a12"],
            alphas: [0.34, 0.96, 0.98, 0.98],
            stops: [0, 42, 100, 100],
            mode: "radial"
          }
        };
        const twitchAnnouncementBgDefaults = {
          announcementsDefault: {
            colors: ["#46464e", "#787884", "#787884", "#787884"],
            alphas: [0.96, 0.88, 0.88, 0.88],
            stops: [0, 100, 100, 100]
          },
          announcementsBlue: {
            colors: ["#03d3d7", "#8d49fe", "#8d49fe", "#8d49fe"],
            alphas: [0.92, 0.88, 0.88, 0.88],
            stops: [0, 100, 100, 100]
          },
          announcementsGreen: {
            colors: ["#01da86", "#55bee4", "#55bee4", "#55bee4"],
            alphas: [0.92, 0.88, 0.88, 0.88],
            stops: [0, 100, 100, 100]
          },
          announcementsOrange: {
            colors: ["#feb419", "#e1df00", "#e1df00", "#e1df00"],
            alphas: [0.92, 0.88, 0.88, 0.88],
            stops: [0, 100, 100, 100]
          },
          announcementsPurple: {
            colors: ["#8D05C3", "#5524AA", "#5524AA", "#5524AA"],
            alphas: [1, 1, 1, 1],
            stops: [0, 100, 100, 100]
          },
          announcementsPrimary: {
            colors: ["#9146ff", "#6d2cff", "#6d2cff", "#6d2cff"],
            alphas: [1, 1, 1, 1],
            stops: [0, 100, 100, 100]
          }
        };
        const messageBgDefaults = {
          twitch: {
            colors: ["#b86cff", "#121020", "#06060c", "#08070e"],
            alphas: [0.7, 0.98, 1, 1]
          },
          youtube: {
            colors: ["#ff4058", "#12101c", "#06060c", "#08070c"],
            alphas: [0.7, 0.98, 1, 1]
          },
          tiktok: {
            colors: [color, "#10121e", "#06060c", "#08080f"],
            alphas: [0.7, 0.98, 1, 1],
            secondStop: 35
          },
          kick: {
            colors: ["#53fc18", "#102214", "#061008", "#071109"],
            alphas: [0.7, 0.98, 1, 1],
            secondStop: 35
          }
        };
        const defaults = {
          ...cloneConfigValue(DEFAULT_TYPE_STYLE),
          avatarGlowColor: color,
          avatarBorderColor: "#ffffff",
          titleGlowColor: color,
          titleBorderColor: titleBorderDefaults[group]?.color || color,
          titleBorderOpacity: titleBorderDefaults[group]?.opacity ?? DEFAULT_TYPE_STYLE.titleBorderOpacity,
          titleBgColor: titleColors.titleBgColor || color,
          titleBgColor2: titleColors.titleBgColor2 || color,
          titleBgColor3: titleColors.titleBgColor2 || color,
          titleBgColor4: titleColors.titleBgColor2 || color,
          titleBgOpacity: 1,
          titleIconBgColor: titleColors.titleIconBgColor || color,
          titleIconBgColor2: titleColors.titleIconBgColor2 || color,
          titleIconBgColor3: titleColors.titleIconBgColor2 || color,
          titleIconBgColor4: titleColors.titleIconBgColor2 || color,
          messageGlowColor: color,
          messageBorderColor: color,
          messageBgColor: color,
          messageBgColor2: "#10121e",
          messageBgColor3: "#06060c",
          messageBgColor4: "#08080f",
          alertGlowColor: color,
          alertBorderColor: color,
          alertBgColor: color,
          alertBgColor2: "#050510",
          alertBgColor3: "#050510",
          alertBgColor4: "#050510",
          giftGlowColor: color,
          giftBorderColor: color,
          giftBgColor: color,
          giftBgColor2: "#10121e",
          giftBgColor3: "#06060c",
          giftBgColor4: "#06060c"
        };

        applySolidGradientDefault(defaults, "avatarGlow", defaults.avatarGlowColor, {
          opacity: defaults.avatarGlowOpacity
        });
        applySolidGradientDefault(defaults, "avatarBorder", defaults.avatarBorderColor, {
          opacity: defaults.avatarBorderOpacity
        });
        applySolidGradientDefault(defaults, "titleGlow", defaults.titleGlowColor, {
          opacity: defaults.titleGlowOpacity
        });
        applySolidGradientDefault(defaults, "titleBorder", defaults.titleBorderColor, {
          opacity: defaults.titleBorderOpacity
        });
        applySolidGradientDefault(defaults, "messageGlow", defaults.messageGlowColor, {
          opacity: defaults.messageGlowOpacity
        });
        applySolidGradientDefault(defaults, "messageBorder", defaults.messageBorderColor, {
          opacity: defaults.messageBorderOpacity
        });
        applyMessageBackgroundDefault(
          defaults,
          messageBgDefaults[group]?.colors || [color, "#10121e", "#06060c", "#08080f"],
          messageBgDefaults[group] || {}
        );
        applySolidGradientDefault(defaults, "alertGlow", defaults.alertGlowColor, {
          opacity: defaults.alertGlowOpacity
        });
        applySolidGradientDefault(defaults, "alertBorder", defaults.alertBorderColor, {
          opacity: defaults.alertBorderOpacity
        });
        applyCardBackgroundDefault(
          defaults,
          "alertBg",
          (group === "twitch" && twitchAnnouncementBgDefaults[type]?.colors) ||
            alertBgDefaults[group]?.colors ||
            [color, "#050510", "#050510", "#050510"],
          (group === "twitch" && twitchAnnouncementBgDefaults[type]) ||
            alertBgDefaults[group] ||
            { alphas: [defaults.alertBgOpacity, 1, 1, 1] }
        );
        applySolidGradientDefault(defaults, "giftGlow", defaults.giftGlowColor, {
          opacity: defaults.giftGlowOpacity
        });
        applySolidGradientDefault(defaults, "giftBorder", defaults.giftBorderColor, {
          opacity: defaults.giftBorderOpacity
        });
        applyGradientDefaults(
          defaults,
          "giftBg",
          [group === "tiktok" ? tiktokBlue : color, "#10121e", "#06060c", "#08080f"],
          [0, 35, 78, 100],
          { mode: "radial", angle: 135, opacity: 1, alphas: [0.13, 0.98, 1, 1] }
        );

        if (group === "tiktok") {
          applyGradientDefaults(
            defaults,
            "messageBorder",
            [tiktokBlue, tiktokBlue, tiktokChatPink, tiktokChatPink],
            [0, 34, 68, 100],
            { mode: "linear", angle: 135, opacity: defaults.messageBorderOpacity }
          );

          applyGradientDefaults(
            defaults,
            "giftBorder",
            [tiktokBlue, tiktokBlue, "#ffffff", tiktokRed, tiktokRed],
            [0, 34, 50, 68, 100],
            { mode: "linear", angle: 135, opacity: defaults.giftBorderOpacity }
          );
        }

        if (group === "twitch" && type === "chat") {
          defaults.messageBgMode = "linear";
          defaults.messageBgColor2 = "#121020";
          defaults.messageBgColor3 = "#06060c";
          defaults.messageBgColor2Stop = 26;
          defaults.messageBgColorAlpha = 0.6322463768115942;
          defaults.messageBgColor2Alpha = 0.8315217391304348;
        }

        if (
          group === "twitch" &&
          [
            "announcementsDefault",
            "announcementsBlue",
            "announcementsGreen",
            "announcementsOrange",
            "announcementsPurple",
            "announcementsPrimary",
            "channelPointRedemptions",
            "follows",
            "subs",
            "giftSubs",
            "raids",
            "watchStreaks",
            "upgrades",
            "hype",
            "hypeTrain",
            "charity",
            "goals",
            "polls",
            "predictions",
            "sharedChat",
            "shoutouts",
            "stream",
            "moderation",
            "system",
            "cheers"
          ].includes(type)
        ) {
          defaults.alertBorderEnabled = false;
        }

        if (group === "tiktok" && type === "chat") {
          defaults.messageBgColor2Stop = 18;
          defaults.messageBgColorAlpha = 0.6902173913043478;
        }

        if (group === "tiktok" && type === "subscribers") {
          defaults.alertGlowColor2 = "#25f4ee";
          defaults.alertGlowColor2Alpha = "";
          defaults.alertBorderEnabled = true;
        }

        if (group === "special" && type === "rainbow") {
          applyRainbowTypeDefaults(defaults, styleConfig);
          defaults.messageBgColor = "#121020";
          defaults.messageBgColorAlpha = 0.7336956521739131;
        }

        return [type, defaults];
      }))
    ])
  );
}

function ensureTypeStyles(target) {
  const defaults = buildDefaultTypeStyles(target.style || {});
  target.style = target.style || {};
  target.style.typeStyles = mergeConfig(defaults, target.style.typeStyles || {});
}

function cloneConfigValue(value) {
  if (!value || typeof value !== "object") return value;

  return JSON.parse(JSON.stringify(value));
}

function getUrlConfigOverrides() {
  const params = new URLSearchParams(window.location.search);
  const overrides = {};
  const aliases = {
    alerts: "behaviour.showAlerts",
    animation: "animation.preset",
    animations: "animation.enabled",
    avatars: "behaviour.showAvatars",
    badges: "behaviour.showBadges",
    test: "scrollTest.enabled",
    testAutoScroll: "scrollTest.autoScroll",
    testInterval: "scrollTest.intervalMs",
    borderGlow: "style.borderGlow",
    bounce: "gigantified.bounceEmotes",
    compactAlerts: "behaviour.compactAlerts",
    emotes: "thirdPartyEmotes.enabled",
    fit: "layout.fitToScreen",
    fitToScreen: "layout.fitToScreen",
    gigantified: "gigantified.enabled",
    group: "behaviour.groupConsecutiveMessages",
    glow: "style.borderGlow",
    highlight: "highlight.enabled",
    icons: "behaviour.showPlatformIcons",
    images: "behaviour.showImageEmbeds",
    ignoredUsers: "behaviour.ignoredUsers",
    blockedPrefixes: "filters.blockedPrefixes",
    twitchImages: "behaviour.imageEmbeds.twitch.enabled",
    twitchImagesEveryone: "behaviour.imageEmbeds.twitch.everyone",
    twitchImagesBroadcaster: "behaviour.imageEmbeds.twitch.broadcaster",
    twitchImagesMods: "behaviour.imageEmbeds.twitch.moderators",
    twitchImagesVips: "behaviour.imageEmbeds.twitch.vips",
    twitchImagesSubs: "behaviour.imageEmbeds.twitch.subscribers",
    youtubeImages: "behaviour.imageEmbeds.youtube.enabled",
    youtubeImagesEveryone: "behaviour.imageEmbeds.youtube.everyone",
    youtubeImagesOwner: "behaviour.imageEmbeds.youtube.owner",
    youtubeImagesMods: "behaviour.imageEmbeds.youtube.moderators",
    youtubeImagesMembers: "behaviour.imageEmbeds.youtube.members",
    tiktokImages: "behaviour.imageEmbeds.tiktok.enabled",
    tiktokImagesEveryone: "behaviour.imageEmbeds.tiktok.everyone",
    kickImages: "behaviour.imageEmbeds.kick.enabled",
    kickImagesEveryone: "behaviour.imageEmbeds.kick.everyone",
    kickImagesBroadcaster: "behaviour.imageEmbeds.kick.broadcaster",
    kickImagesMods: "behaviour.imageEmbeds.kick.moderators",
    kickImagesVips: "behaviour.imageEmbeds.kick.vips",
    kickImagesSubs: "behaviour.imageEmbeds.kick.subscribers",
    donations: "behaviour.alerts.donations.enabled",
    donationAlerts: "behaviour.alerts.donations.enabled",
    twitchAlerts: "behaviour.alerts.twitch.enabled",
    twitchAnnouncements: "behaviour.alerts.twitch.announcements",
    twitchPoints: "behaviour.alerts.twitch.channelPointRedemptions",
    twitchCheers: "behaviour.alerts.twitch.cheers",
    twitchFollows: "behaviour.alerts.twitch.follows",
    twitchSubs: "behaviour.alerts.twitch.subs",
    twitchGiftSubs: "behaviour.alerts.twitch.giftSubs",
    twitchRaids: "behaviour.alerts.twitch.raids",
    twitchWatchStreaks: "behaviour.alerts.twitch.watchStreaks",
    twitchUpgrades: "behaviour.alerts.twitch.upgrades",
    twitchHype: "behaviour.alerts.twitch.hype",
    twitchHypeTrain: "behaviour.alerts.twitch.hypeTrain",
    twitchCharity: "behaviour.alerts.twitch.charity",
    twitchGoals: "behaviour.alerts.twitch.goals",
    twitchPolls: "behaviour.alerts.twitch.polls",
    twitchPredictions: "behaviour.alerts.twitch.predictions",
    twitchSharedChat: "behaviour.alerts.twitch.sharedChat",
    twitchShoutouts: "behaviour.alerts.twitch.shoutouts",
    twitchStream: "behaviour.alerts.twitch.stream",
    twitchModeration: "behaviour.alerts.twitch.moderation",
    twitchSystem: "behaviour.alerts.twitch.system",
    twitchWatchStreakRoute: "behaviour.alertRoutes.twitch.watchStreaks",
    youtubeAlerts: "behaviour.alerts.youtube.enabled",
    youtubeSuperChats: "behaviour.alerts.youtube.superChats",
    youtubeStickers: "behaviour.alerts.youtube.superStickers",
    youtubeMembers: "behaviour.alerts.youtube.members",
    youtubeGifts: "behaviour.alerts.youtube.gifts",
    youtubePolls: "behaviour.alerts.youtube.polls",
    youtubeStream: "behaviour.alerts.youtube.stream",
    youtubeModeration: "behaviour.alerts.youtube.moderation",
    youtubeSystem: "behaviour.alerts.youtube.system",
    tiktokAlerts: "behaviour.alerts.tiktok.enabled",
    tiktokFollows: "behaviour.alerts.tiktok.follows",
    tiktokSubscribers: "behaviour.alerts.tiktok.subscribers",
    tiktokGifts: "behaviour.alerts.tiktok.gifts",
    tiktokLikes: "behaviour.alerts.tiktok.likes",
    tiktokTreasure: "behaviour.alerts.tiktok.treasureBoxes",
    tiktokShares: "behaviour.alerts.tiktok.shares",
    tiktokJoins: "behaviour.alerts.tiktok.joins",
    tiktokQuestions: "behaviour.alerts.tiktok.questions",
    tiktokGoals: "behaviour.alerts.tiktok.goals",
    tiktokPolls: "behaviour.alerts.tiktok.polls",
    tiktokBattles: "behaviour.alerts.tiktok.battles",
    tiktokStream: "behaviour.alerts.tiktok.stream",
    tiktokSystem: "behaviour.alerts.tiktok.system",
    kickStream: "behaviour.alerts.kick.stream",
    kickModeration: "behaviour.alerts.kick.moderation",
    kickSystem: "behaviour.alerts.kick.system",
    streamlabs: "behaviour.alerts.donations.streamlabs",
    streamelements: "behaviour.alerts.donations.streamelements",
    kofi: "behaviour.alerts.donations.kofi",
    koFi: "behaviour.alerts.donations.kofi",
    tipeeestream: "behaviour.alerts.donations.tipeeestream",
    tipeeestreamAlerts: "behaviour.alerts.donations.tipeeestream",
    fourthwall: "behaviour.alerts.donations.fourthwall",
    patreon: "behaviour.alerts.donations.patreon",
    donordrive: "behaviour.alerts.donations.donordrive",
    platformIcons: "behaviour.showPlatformIcons",
    previews: "behaviour.showLinkPreviews",
    stealth: "style.stealthMode",
    stealthMode: "style.stealthMode",
    nameBg: "style.showNameBackgrounds",
    nameBackgrounds: "style.showNameBackgrounds",
    messageBg: "style.showMessageBackgrounds",
    messageBackgrounds: "style.showMessageBackgrounds",
    alertBg: "style.showAlertBackgrounds",
    alertBackgrounds: "style.showAlertBackgrounds",
    giftBg: "style.showGiftBackgrounds",
    giftBackgrounds: "style.showGiftBackgrounds",
    mediaBg: "style.showMediaBackgrounds",
    mediaBackgrounds: "style.showMediaBackgrounds",
    pageBg: "style.showPageBackground",
    pageBackground: "style.showPageBackground",
    avatarGlow: "style.showAvatarGlow",
    emoteGlow: "style.showEmoteGlow",
    coloredText: "style.showColoredText",
    customAccent: "style.useCustomAccentColor",
    accentColor: "style.accentColor",
    titleColor: "style.titleTextColor",
    messageColor: "style.messageTextColor",
    pageBgColor: "style.colors.surfaces.pageBackground",
    bubbleBase: "style.colors.surfaces.bubbleBase",
    mediaBgColor: "style.colors.surfaces.mediaBackground",
    badgeBg: "style.colors.surfaces.badgeBackground",
    avatarBorder: "style.colors.surfaces.avatarBorder",
    emoteSparkle: "style.colors.effects.emoteSparkle",
    gigantifiedSparkle: "style.colors.effects.gigantifiedSparkle",
    highlightGlow: "style.colors.effects.highlightGlow",
    highlightWarmGlow: "style.colors.effects.highlightWarmGlow",
    rainbow1: "style.colors.rainbow.one",
    rainbow2: "style.colors.rainbow.two",
    rainbow3: "style.colors.rainbow.three",
    rainbow4: "style.colors.rainbow.four",
    rainbow5: "style.colors.rainbow.five",
    rainbow6: "style.colors.rainbow.six",
    rainbow7: "style.colors.rainbow.seven",
    twitchChatColor: "style.colors.twitch.chat",
    twitchAnnouncementsColor: "style.colors.twitch.announcements",
    twitchPointsColor: "style.colors.twitch.channelPointRedemptions",
    twitchCheersColor: "style.colors.twitch.cheers",
    twitchFollowsColor: "style.colors.twitch.follows",
    twitchSubsColor: "style.colors.twitch.subs",
    twitchGiftSubsColor: "style.colors.twitch.giftSubs",
    twitchRaidsColor: "style.colors.twitch.raids",
    twitchWatchStreaksColor: "style.colors.twitch.watchStreaks",
    twitchUpgradesColor: "style.colors.twitch.upgrades",
    twitchHypeColor: "style.colors.twitch.hype",
    twitchHypeTrainColor: "style.colors.twitch.hypeTrain",
    twitchCharityColor: "style.colors.twitch.charity",
    twitchGoalsColor: "style.colors.twitch.goals",
    twitchPollsColor: "style.colors.twitch.polls",
    twitchPredictionsColor: "style.colors.twitch.predictions",
    twitchSharedChatColor: "style.colors.twitch.sharedChat",
    twitchShoutoutsColor: "style.colors.twitch.shoutouts",
    twitchStreamColor: "style.colors.twitch.stream",
    twitchModerationColor: "style.colors.twitch.moderation",
    twitchSystemColor: "style.colors.twitch.system",
    youtubeChatColor: "style.colors.youtube.chat",
    youtubeSuperChatsColor: "style.colors.youtube.superChats",
    youtubeStickersColor: "style.colors.youtube.superStickers",
    youtubeMembersColor: "style.colors.youtube.members",
    youtubeGiftsColor: "style.colors.youtube.gifts",
    youtubePollsColor: "style.colors.youtube.polls",
    youtubeStreamColor: "style.colors.youtube.stream",
    youtubeModerationColor: "style.colors.youtube.moderation",
    youtubeSystemColor: "style.colors.youtube.system",
    tiktokChatColor: "style.colors.tiktok.chat",
    tiktokFollowsColor: "style.colors.tiktok.follows",
    tiktokSubscribersColor: "style.colors.tiktok.subscribers",
    tiktokGiftsColor: "style.colors.tiktok.gifts",
    tiktokLikesColor: "style.colors.tiktok.likes",
    tiktokTreasureColor: "style.colors.tiktok.treasureBoxes",
    tiktokSharesColor: "style.colors.tiktok.shares",
    tiktokJoinsColor: "style.colors.tiktok.joins",
    tiktokQuestionsColor: "style.colors.tiktok.questions",
    tiktokGoalsColor: "style.colors.tiktok.goals",
    tiktokPollsColor: "style.colors.tiktok.polls",
    tiktokBattlesColor: "style.colors.tiktok.battles",
    tiktokStreamColor: "style.colors.tiktok.stream",
    tiktokSystemColor: "style.colors.tiktok.system",
    kickNameColor: "style.colors.text.kickName",
    kickChatColor: "style.colors.kick.chat",
    kickFollowsColor: "style.colors.kick.follows",
    kickSubsColor: "style.colors.kick.subs",
    kickGiftSubsColor: "style.colors.kick.giftSubs",
    kickRewardsColor: "style.colors.kick.rewardRedemptions",
    kickStreamColor: "style.colors.kick.stream",
    kickModerationColor: "style.colors.kick.moderation",
    kickSystemColor: "style.colors.kick.system",
    streamlabsColor: "style.colors.donations.streamlabs",
    streamelementsColor: "style.colors.donations.streamelements",
    kofiColor: "style.colors.donations.kofi",
    koFiColor: "style.colors.donations.kofi",
    tipeeestreamColor: "style.colors.donations.tipeeestream",
    fourthwallColor: "style.colors.donations.fourthwall",
    patreonColor: "style.colors.donations.patreon",
    donordriveColor: "style.colors.donations.donordrive",
    rainbowChatColor: "style.colors.special.rainbow",
    titleFont: "style.accentFontFamily",
    messageFont: "style.messageFontFamily",
    titleSize: "style.titleFontSize",
    titleLineHeight: "style.titleLineHeight",
    messageLineHeight: "style.messageLineHeight",
    bubbleLayout: "style.bubbleLayout",
    bubbleShape: "style.bubbleShape",
    nameRadius: "style.nameBubbleRadius",
    nameTagX: "style.nameTagOffsetX",
    nameTagOverlap: "style.nameTagOverlapY",
    overlapTopPadding: "style.overlappedMessageTopPadding",
    overlapShadow: "style.overlappedCardShadow",
    overlapTilt: "style.overlappedRandomTilt",
    overlapTiltAmount: "style.overlappedTiltAmount",
    iconSide: "style.nameIconPosition",
    nameIconOverlap: "style.nameIconEdgeOverlap",
    nameIconRadius: "style.nameIconEdgeRadius",
    twitchNameColor: "style.useTwitchChatNameColor",
    slant: "style.bubbleSlant",
    notch: "style.bubbleNotch",
    stealthNameBg: "style.showNameBackgrounds",
    stealthMessageBg: "style.showMessageBackgrounds",
    stealthChatBg: "style.showMessageBackgrounds",
    stealthAlertBg: "style.showAlertBackgrounds",
    stealthGiftBg: "style.showGiftBackgrounds",
    stealthMediaBg: "style.showMediaBackgrounds",
    stealthEmoteGlow: "style.showEmoteGlow",
    stealthAvatarGlow: "style.showAvatarGlow",
    stealthColoredText: "style.showColoredText",
    stealthBadges: "behaviour.showBadges",
    stealthIcons: "behaviour.showPlatformIcons",
    stacked: "behaviour.groupConsecutiveMessages",
    stackedMessages: "behaviour.groupConsecutiveMessages",
    tiktok: "behaviour.sources.tiktok",
    tiktokTreasure: "behaviour.alerts.tiktok.treasureBoxes",
    tiktokTreasureBoxes: "behaviour.alerts.tiktok.treasureBoxes",
    twitch: "behaviour.sources.twitch",
    youtube: "behaviour.sources.youtube",
    kick: "behaviour.sources.kick",
    kickFollows: "behaviour.alerts.kick.follows",
    kickSubs: "behaviour.alerts.kick.subs",
    kickGiftSubs: "behaviour.alerts.kick.giftSubs",
    kickRewards: "behaviour.alerts.kick.rewardRedemptions",
    kickStream: "behaviour.alerts.kick.stream",
    kickModeration: "behaviour.alerts.kick.moderation",
    kickSystem: "behaviour.alerts.kick.system",
    twitchChat: "behaviour.chat.twitch",
    youtubeChat: "behaviour.chat.youtube",
    tiktokChat: "behaviour.chat.tiktok",
    kickChat: "behaviour.chat.kick",
    max: "layout.maxMessages",
    maxMessages: "layout.maxMessages",
    messageSize: "style.messageFontSize",
    avatarSize: "layout.avatarSize",
    avatarGap: "layout.avatarGap",
    inline: "behaviour.inlineChat",
    inlineChat: "behaviour.inlineChat",
    timestamps: "behaviour.showTimestamps",
    timestampFormat: "behaviour.timestampFormat",
    mentions: "behaviour.highlightMentions",
    monitor: "behaviour.monitorMode",
    dock: "behaviour.monitorMode",
    autoScroll: "behaviour.autoScroll",
    scrollDirection: "behaviour.scrollDirection",
    fadeAfter: "behaviour.hideAfterFade",
    minimal: "style.minimalStyle",
    emoteSize: "style.emoteOnlyFontSize",
    gigantifiedSize: "style.gigantifiedFontSize",
    bubbleRadius: "style.bubbleRadius",
    removeAfter: "behaviour.removeMessagesAfterMs",
    width: "layout.chatWidth",
    streamerbotHost: "streamerbot.host",
    streamerbotPort: "streamerbot.port",
    streamerbotReconnect: "streamerbot.reconnectMs",
    tikfinityEnabled: "tikfinity.enabled",
    tikfinityHost: "tikfinity.host",
    tikfinityPort: "tikfinity.port",
    tikfinityReconnect: "tikfinity.reconnectMs",
    ignoredUsers: "behaviour.ignoredUsers",
    blockedPrefixes: "filters.blockedPrefixes"
  };

  let requestedStylePreset = "";
  const entries = [];

  params.forEach((value, key) => {
    if (key === "preset" || key === "stylePreset") {
      requestedStylePreset = String(value || "");
      return;
    }

    const path = resolveUrlConfigPath(key, aliases);

    if (!isAllowedUrlConfigPath(path)) return;

    const parsedValue = parseUrlConfigValue(value);
    const nextValue = isListConfigPath(path)
      ? normalizeListConfigValue(parsedValue)
      : parsedValue;

    if (path === "style.stealthMode" && nextValue) {
      requestedStylePreset = "stealth";
      return;
    }

    if (path === "style.minimalStyle" && nextValue) {
      requestedStylePreset = "minimal";
      return;
    }

    entries.push([path, nextValue]);
  });

  if (requestedStylePreset) {
    applyUrlPresetToTarget(overrides, requestedStylePreset);
  }

  entries.forEach(([path, parsedValue]) => {
    setDeepValue(overrides, path, parsedValue);
    syncSourceGroupTypesOn(overrides, path, parsedValue);
    syncAlertGroupTypesOn(overrides, path, parsedValue);
  });

  return overrides;
}

function resolveUrlConfigPath(key, aliases = {}) {
  return aliases[key] || friendlyTypeStyleParamToPath(key) || key;
}

function friendlyTypeStyleParamToPath(key) {
  const value = String(key || "");
  const typeStyles = getFriendlyTypeStyleSchema();
  const group = Object.keys(typeStyles)
    .sort((a, b) => b.length - a.length)
    .find(candidate => value.startsWith(candidate));

  if (!group) return "";

  const afterGroup = value.slice(group.length);
  const types = typeStyles[group] || [];
  const type = types
    .map(candidate => ({
      raw: candidate,
      param: toUrlPascalPart(candidate)
    }))
    .sort((a, b) => b.param.length - a.param.length)
    .find(candidate => afterGroup.startsWith(candidate.param));

  if (!type) return "";

  const fieldParam = afterGroup.slice(type.param.length);
  if (!fieldParam) return "";

  const fields = getFriendlyTypeStyleFields();
  const field = fields
    .map(candidate => ({
      raw: candidate,
      param: toUrlPascalPart(candidate.endsWith("Enabled")
        ? candidate.slice(0, -"Enabled".length)
        : candidate)
    }))
    .sort((a, b) => b.param.length - a.param.length)
    .find(candidate => candidate.param === fieldParam);

  if (!field) return "";

  return `style.typeStyles.${group}.${type.raw}.${field.raw}`;
}

function getFriendlyTypeStyleSchema() {
  return {
    twitch: [
      "chat",
      "announcements",
      "announcementsDefault",
      "announcementsBlue",
      "announcementsGreen",
      "announcementsOrange",
      "announcementsPurple",
      "announcementsPrimary",
      "channelPointRedemptions",
      "cheers",
      "follows",
      "subs",
      "giftSubs",
      "raids",
      "watchStreaks",
      "upgrades",
      "hype",
      "hypeTrain",
      "charity",
      "goals",
      "polls",
      "predictions",
      "sharedChat",
      "shoutouts",
      "stream",
      "moderation",
      "system"
    ],
    youtube: ["chat", "superChats", "superStickers", "members", "gifts", "polls", "stream", "moderation", "system"],
    tiktok: ["chat", "follows", "subscribers", "gifts", "likes", "treasureBoxes", "shares", "joins", "questions", "goals", "polls", "battles", "stream", "system"],
    kick: ["chat", "follows", "subs", "giftSubs", "rewardRedemptions", "stream", "moderation", "system"],
    special: ["rainbow"],
    donations: ["streamlabs", "streamelements", "kofi", "tipeeestream", "fourthwall", "patreon", "donordrive"]
  };
}

function getFriendlyTypeStyleFields() {
  const suffixes = ["", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const gradientPrefixes = [
    "avatarGlow",
    "avatarBorder",
    "titleGlow",
    "titleBorder",
    "titleBg",
    "titleIconBg",
    "messageGlow",
    "messageBorder",
    "messageBg",
    "alertGlow",
    "alertBorder",
    "alertBg",
    "giftGlow",
    "giftBorder",
    "giftBg"
  ];
  const fields = [
    "avatarGlowEnabled",
    "avatarBorderEnabled",
    "titleGlowEnabled",
    "titleBorderEnabled",
    "messageGlowEnabled",
    "messageBorderEnabled",
    "alertGlowEnabled",
    "alertBorderEnabled",
    "giftGlowEnabled",
    "giftBorderEnabled"
  ];

  gradientPrefixes.forEach(prefix => {
    fields.push(`${prefix}Mode`, `${prefix}Angle`, `${prefix}Opacity`);
    suffixes.forEach(suffix => {
      fields.push(
        `${prefix}Color${suffix}`,
        `${prefix}Color${suffix}Stop`,
        `${prefix}Color${suffix}Alpha`
      );
    });
  });

  return fields;
}

function toUrlPascalPart(value) {
  return String(value || "").replace(/^[a-z]/, char => char.toUpperCase());
}

function syncAlertGroupTypesOn(target, path, value) {
  const match = String(path || "").match(/^behaviour\.alerts\.(twitch|youtube|tiktok)\.enabled$/);

  if (!match) return;

  const group = match[1];

  ALERT_GROUP_TYPES[group].forEach(type => {
    setDeepValue(target, `behaviour.alerts.${group}.${type}`, !!value);
  });
}

function syncSourceGroupTypesOn(target, path, value) {
  const match = String(path || "").match(/^behaviour\.sources\.(twitch|youtube|tiktok|kick)$/);

  if (!match) return;

  const group = match[1];

  setDeepValue(target, `behaviour.chat.${group}`, !!value);
  if (!ALERT_GROUP_TYPES[group]) return;
  setDeepValue(target, `behaviour.alerts.${group}.enabled`, !!value);

  ALERT_GROUP_TYPES[group].forEach(type => {
    setDeepValue(target, `behaviour.alerts.${group}.${type}`, !!value);
  });
}

function isAllowedUrlConfigPath(path) {
  return [
    "layout.",
    "style.",
    "behaviour.",
    "animation.",
    "scrollTest.",
    "highlight.",
    "gigantified.",
    "thirdPartyEmotes.",
    "streamerbot.",
    "tikfinity.",
    "filters."
  ].some(prefix => path.startsWith(prefix));
}

function isListConfigPath(path) {
  return [
    "behaviour.ignoredUsers",
    "filters.blockedPrefixes"
  ].includes(String(path || ""));
}

function normalizeListConfigValue(value) {
  if (Array.isArray(value)) return value.map(item => String(item).trim()).filter(Boolean);

  return String(value || "")
    .split(/[\n,]+/)
    .map(item => item.trim())
    .filter(Boolean);
}

function setDeepValue(target, path, value) {
  const keys = String(path || "").split(".").filter(Boolean);
  let cursor = target;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      cursor[key] = value;
      return;
    }

    cursor[key] = cursor[key] || {};
    cursor = cursor[key];
  });
}

function getDeepValue(target, path) {
  return String(path || "")
    .split(".")
    .filter(Boolean)
    .reduce((value, key) => value?.[key], target);
}

function parseUrlConfigValue(value) {
  const text = String(value || "").trim();
  const lower = text.toLowerCase();

  if (["true", "1", "yes", "on"].includes(lower)) return true;
  if (["false", "0", "no", "off"].includes(lower)) return false;
  if (lower === "null") return null;
  if (/^-?\d+(?:\.\d+)?$/.test(text)) return Number(text);

  return text;
}

function px(value) {
  if (typeof value === "number") return `${value}px`;
  return value;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(str) {
  return escapeHtml(str).replaceAll("`", "&#096;");
}
