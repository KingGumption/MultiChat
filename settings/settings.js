document
  .querySelector("[data-autoscroll-container]")
  ?.addEventListener("scroll", window.handleAutoScrollContainerScroll || (() => {}), {
    passive: true
  });

const autoscrollContainer = document.querySelector("[data-autoscroll-container]");
["wheel", "touchstart", "pointerdown"].forEach(eventName => {
  autoscrollContainer?.addEventListener(
    eventName,
    window.handleAutoScrollManualInput || (() => {}),
    { passive: true }
  );
});

const donationTypeOptions = [
  ["Streamlabs", "streamlabs"],
  ["StreamElements", "streamelements"],
  ["Ko-fi", "kofi"],
  ["TipeeeStream", "tipeeestream"],
  ["Fourthwall", "fourthwall"],
  ["Patreon", "patreon"],
  ["DonorDrive", "donordrive"]
];

const donationPreviewPlatforms = Object.fromEntries(
  donationTypeOptions.map(([label, type]) => [type, label])
);

const GLOBAL_TYPE_STYLE_GROUP = "global";
const GLOBAL_TYPE_STYLE_PROXY_GROUP = "twitch";
const GLOBAL_TYPE_STYLE_PROXY_TYPE = "chat";

const typeStyleGroups = [
  {
    title: "Global Type Styling",
    description: "One editor that updates every chat, alert, donation, gift, and special message type together.",
    group: GLOBAL_TYPE_STYLE_GROUP,
    types: [
      ["All Chat & Alerts", "all"]
    ]
  },
  {
    title: "Twitch Type Styling",
    description: "Per Twitch chat/event control for avatar glow, title/name pill, message bubbles, and alert cards.",
    group: "twitch",
    types: [
      ["Chat Messages", "chat"],
      ["Announcements", "announcements"],
      ["Announcements: Default", "announcementsDefault"],
      ["Announcements: Blue", "announcementsBlue"],
      ["Announcements: Green", "announcementsGreen"],
      ["Announcements: Orange", "announcementsOrange"],
      ["Announcements: Purple", "announcementsPurple"],
      ["Announcements: Primary", "announcementsPrimary"],
      ["Channel Points", "channelPointRedemptions"],
      ["Cheers", "cheers"],
      ["Follows", "follows"],
      ["Subs", "subs"],
      ["Gift Subs", "giftSubs"],
      ["Raids", "raids"],
      ["Watch Streaks", "watchStreaks"],
      ["Paid Upgrades", "upgrades"],
      ["Hype", "hype"],
      ["Hype Train", "hypeTrain"],
      ["Charity", "charity"],
      ["Goals", "goals"],
      ["Polls", "polls"],
      ["Predictions", "predictions"],
      ["Shared Chat", "sharedChat"],
      ["Shoutouts", "shoutouts"],
      ["Stream", "stream"],
      ["Moderation", "moderation"],
      ["System", "system"]
    ]
  },
  {
    title: "YouTube Type Styling",
    description: "Per YouTube chat/event control for avatar glow, title/name pill, message bubbles, and alert cards.",
    group: "youtube",
    types: [
      ["Chat Messages", "chat"],
      ["Super Chats", "superChats"],
      ["Stickers", "superStickers"],
      ["Members", "members"],
      ["Gifts", "gifts"],
      ["Polls", "polls"],
      ["Stream", "stream"],
      ["Moderation", "moderation"],
      ["System", "system"]
    ]
  },
  {
    title: "TikTok Type Styling",
    description: "Per TikTok chat/event control, including the gift card controls for TikTok gifts.",
    group: "tiktok",
    types: [
      ["Chat Messages", "chat"],
      ["Follows", "follows"],
      ["Subscribers", "subscribers"],
      ["Gifts", "gifts"],
      ["Likes", "likes"],
      ["Treasure Boxes", "treasureBoxes"],
      ["Shares", "shares"],
      ["Joins", "joins"],
      ["Questions", "questions"],
      ["Goals", "goals"],
      ["Polls", "polls"],
      ["Battles", "battles"],
      ["Stream", "stream"],
      ["System", "system"]
    ]
  },
  {
    title: "Kick Type Styling",
    description: "Per Kick chat/event control for avatar glow, title/name pill, message bubbles, and alert cards.",
    group: "kick",
    types: [
      ["Chat Messages", "chat"],
      ["Follows", "follows"],
      ["Subs", "subs"],
      ["Gift Subs", "giftSubs"],
      ["Reward Redemptions", "rewardRedemptions"],
      ["Stream", "stream"],
      ["Moderation", "moderation"],
      ["System", "system"]
    ]
  },
  {
    title: "Special Type Styling",
    description: "Per special message-state control for avatar glow, title/name pill, and message bubbles.",
    group: "special",
    types: [
      ["Rainbow Chat", "rainbow"]
    ]
  },
  {
    title: "Donation Type Styling",
    description: "Per donation service control for alert card glow, border, and background.",
    group: "donations",
    types: donationTypeOptions
  }
];

function gradientControls(title, prefix, description = "") {
  return {
    title,
    description,
    kind: "gradient",
    prefix
  };
}

function glowControls(title, prefix, description = "") {
  return {
    title,
    description,
    controls: [
      ["Enabled", `${prefix}Enabled`, "checkbox"],
      ["Colour", `${prefix}Color`, "color"],
      ["Opacity", `${prefix}Opacity`, "range", { min: 0, max: 1, step: 0.01 }]
    ]
  };
}

const avatarTypeControls = [
  glowControls("Avatar Glow", "avatarGlow"),
  gradientControls("Avatar Border", "avatarBorder")
];

const titleTypeControls = [
  glowControls("Title Glow", "titleGlow"),
  gradientControls("Title Border", "titleBorder"),
  gradientControls("Name Section Gradient", "titleBg"),
  gradientControls("Platform Icon Section Gradient", "titleIconBg")
];

const messageTypeControls = [
  glowControls("Message Glow", "messageGlow"),
  gradientControls("Message Border", "messageBorder"),
  gradientControls("Message Background Gradient", "messageBg")
];

const alertTypeControls = [
  glowControls("Alert Glow", "alertGlow"),
  gradientControls("Alert Border", "alertBorder"),
  gradientControls("Alert Background Gradient", "alertBg")
];

const giftTypeControls = [
  glowControls("Gift Glow", "giftGlow"),
  gradientControls("Gift Border", "giftBorder"),
  gradientControls("Gift Background Gradient", "giftBg")
];

function getTypeStyleControls(group, type) {
  if (group === GLOBAL_TYPE_STYLE_GROUP) {
    return [
      ...avatarTypeControls,
      ...titleTypeControls,
      ...messageTypeControls,
      ...alertTypeControls,
      ...giftTypeControls
    ];
  }

  if (group === "tiktok" && type === "gifts") {
    return [
      ...avatarTypeControls,
      ...giftTypeControls
    ];
  }

  if (type === "chat" || (group === "special" && type === "rainbow")) {
    return [
      ...avatarTypeControls,
      ...titleTypeControls,
      ...messageTypeControls
    ];
  }

  return [
    ...avatarTypeControls,
    ...alertTypeControls
  ];
}

function getTypeStyleControlPath(group, type, key) {
  const targetGroup = group === GLOBAL_TYPE_STYLE_GROUP ? GLOBAL_TYPE_STYLE_PROXY_GROUP : group;
  const targetType = group === GLOBAL_TYPE_STYLE_GROUP ? GLOBAL_TYPE_STYLE_PROXY_TYPE : type;
  return `style.typeStyles.${targetGroup}.${targetType}.${key}`;
}

function mapTypeStyleControl(control, group, type) {
  if (Array.isArray(control)) {
    const [controlLabel, key, inputType, options] = control;
    return [
      controlLabel,
      getTypeStyleControlPath(group, type, key),
      inputType,
      options
    ];
  }

  if (control.kind === "gradient") {
    return {
      ...control,
      pathPrefix: getTypeStyleControlPath(group, type, control.prefix)
    };
  }

  return {
    ...control,
    controls: control.controls.map(child => mapTypeStyleControl(child, group, type))
  };
}

function createTypeStyleSections() {
  return typeStyleGroups.map(source => ({
    title: source.title,
    description: source.description,
    typeStyleButtons: source.types.map(([label, type]) => ({
      label,
      type,
      group: source.group,
      sectionTitle: source.title
    }))
  }));
}

const controlSections = [
  {
    title: "Connections",
    description: "Set the local WebSocket details used by the overlay to talk to Streamer.bot and TikFinity.",
    controls: [
      {
        title: "Streamer.bot",
        description: "Defaults to Streamer.bot's WebSocket server on this machine.",
        controls: [
          ["Host", "streamerbot.host", "text"],
          ["Port", "streamerbot.port", "number", { min: 1, max: 65535, step: 1 }],
          ["Reconnect", "streamerbot.reconnectMs", "number", { min: 250, max: 60000, step: 250 }]
        ]
      },
      {
        title: "TikFinity",
        description: "Enable TikFinity and set the local WebSocket details if yours differ from the default.",
        path: "tikfinity.enabled",
        type: "checkbox",
        controls: [
          ["Host", "tikfinity.host", "text"],
          ["Port", "tikfinity.port", "number", { min: 1, max: 65535, step: 1 }],
          ["Reconnect", "tikfinity.reconnectMs", "number", { min: 250, max: 60000, step: 250 }]
        ]
      }
    ]
  },
  {
    title: "Sources",
    description: "Choose which platforms and event types are allowed into chat.",
    controls: [
      {
        title: "Twitch",
        description: "Turn Twitch off completely, or expand to allow only specific Twitch message types.",
        path: "behaviour.sources.twitch",
        type: "checkbox",
        controls: [
          ["Chat Messages", "behaviour.chat.twitch", "checkbox"],
          ["Announcements", "behaviour.alerts.twitch.announcements", "checkbox"],
          ["Channel Points", "behaviour.alerts.twitch.channelPointRedemptions", "checkbox"],
          ["Cheers", "behaviour.alerts.twitch.cheers", "checkbox"],
          ["Follows", "behaviour.alerts.twitch.follows", "checkbox"],
          ["Subs", "behaviour.alerts.twitch.subs", "checkbox"],
          ["Gift Subs", "behaviour.alerts.twitch.giftSubs", "checkbox"],
          ["Raids", "behaviour.alerts.twitch.raids", "checkbox"],
          ["Watch Streaks", "behaviour.alerts.twitch.watchStreaks", "checkbox"],
          ["Paid Upgrades", "behaviour.alerts.twitch.upgrades", "checkbox"],
          ["Hype", "behaviour.alerts.twitch.hype", "checkbox"],
          ["Hype Train", "behaviour.alerts.twitch.hypeTrain", "checkbox"],
          ["Charity", "behaviour.alerts.twitch.charity", "checkbox"],
          ["Goals", "behaviour.alerts.twitch.goals", "checkbox"],
          ["Polls", "behaviour.alerts.twitch.polls", "checkbox"],
          ["Predictions", "behaviour.alerts.twitch.predictions", "checkbox"],
          ["Shared Chat", "behaviour.alerts.twitch.sharedChat", "checkbox"],
          ["Shoutouts", "behaviour.alerts.twitch.shoutouts", "checkbox"],
          ["Stream", "behaviour.alerts.twitch.stream", "checkbox"],
          ["Moderation", "behaviour.alerts.twitch.moderation", "checkbox"],
          ["System", "behaviour.alerts.twitch.system", "checkbox"],
          ["Send Watch Streaks To", "behaviour.alertRoutes.twitch.watchStreaks", "select", [
            ["Watch Streaks", "watchStreaks"],
            ["Announcements", "announcements"],
            ["Channel Points", "channelPointRedemptions"],
            ["Cheers", "cheers"],
            ["Follows", "follows"],
            ["Subs", "subs"],
            ["Gift Subs", "giftSubs"],
            ["Raids", "raids"],
            ["Paid Upgrades", "upgrades"],
            ["Hype", "hype"],
            ["Hype Train", "hypeTrain"],
            ["Charity", "charity"],
            ["Goals", "goals"],
            ["Polls", "polls"],
            ["Predictions", "predictions"],
            ["Shared Chat", "sharedChat"],
            ["Shoutouts", "shoutouts"],
            ["Stream", "stream"],
            ["Moderation", "moderation"],
            ["System", "system"]
          ]]
        ]
      },
      {
        title: "YouTube",
        description: "Turn YouTube off completely, or expand to allow only specific YouTube message types.",
        path: "behaviour.sources.youtube",
        type: "checkbox",
        controls: [
          ["Chat Messages", "behaviour.chat.youtube", "checkbox"],
          ["Super Chats", "behaviour.alerts.youtube.superChats", "checkbox"],
          ["Stickers", "behaviour.alerts.youtube.superStickers", "checkbox"],
          ["Members", "behaviour.alerts.youtube.members", "checkbox"],
          ["Gifts", "behaviour.alerts.youtube.gifts", "checkbox"],
          ["Polls", "behaviour.alerts.youtube.polls", "checkbox"],
          ["Stream", "behaviour.alerts.youtube.stream", "checkbox"],
          ["Moderation", "behaviour.alerts.youtube.moderation", "checkbox"],
          ["System", "behaviour.alerts.youtube.system", "checkbox"]
        ]
      },
      {
        title: "TikTok",
        description: "Turn TikTok off completely, or expand to allow only chat, gifts, follows, or other events.",
        path: "behaviour.sources.tiktok",
        type: "checkbox",
        controls: [
          ["Chat Messages", "behaviour.chat.tiktok", "checkbox"],
          ["Follows", "behaviour.alerts.tiktok.follows", "checkbox"],
          ["Subscribers", "behaviour.alerts.tiktok.subscribers", "checkbox"],
          ["Gifts", "behaviour.alerts.tiktok.gifts", "checkbox"],
          ["Likes", "behaviour.alerts.tiktok.likes", "checkbox"],
          ["Treasure Boxes", "behaviour.alerts.tiktok.treasureBoxes", "checkbox"],
          ["Shares", "behaviour.alerts.tiktok.shares", "checkbox"],
          ["Joins", "behaviour.alerts.tiktok.joins", "checkbox"],
          ["Questions", "behaviour.alerts.tiktok.questions", "checkbox"],
          ["Goals", "behaviour.alerts.tiktok.goals", "checkbox"],
          ["Polls", "behaviour.alerts.tiktok.polls", "checkbox"],
          ["Battles", "behaviour.alerts.tiktok.battles", "checkbox"],
          ["Stream", "behaviour.alerts.tiktok.stream", "checkbox"],
          ["System", "behaviour.alerts.tiktok.system", "checkbox"]
        ]
      },
      {
        title: "Kick",
        description: "Turn Kick chat messages on or off.",
        path: "behaviour.sources.kick",
        type: "checkbox",
        controls: [
          ["Chat Messages", "behaviour.chat.kick", "checkbox"],
          ["Follows", "behaviour.alerts.kick.follows", "checkbox"],
          ["Subs", "behaviour.alerts.kick.subs", "checkbox"],
          ["Gift Subs", "behaviour.alerts.kick.giftSubs", "checkbox"],
          ["Reward Redemptions", "behaviour.alerts.kick.rewardRedemptions", "checkbox"],
          ["Stream", "behaviour.alerts.kick.stream", "checkbox"],
          ["Moderation", "behaviour.alerts.kick.moderation", "checkbox"],
          ["System", "behaviour.alerts.kick.system", "checkbox"]
        ]
      },
      {
        title: "Donations",
        description: "Donation and service alerts from integrations outside the main chat platforms.",
        path: "behaviour.alerts.donations.enabled",
        type: "checkbox",
        controls: [
          ["Streamlabs", "behaviour.alerts.donations.streamlabs", "checkbox"],
          ["StreamElements", "behaviour.alerts.donations.streamelements", "checkbox"],
          ["Ko-fi", "behaviour.alerts.donations.kofi", "checkbox"],
          ["TipeeeStream", "behaviour.alerts.donations.tipeeestream", "checkbox"],
          ["Fourthwall", "behaviour.alerts.donations.fourthwall", "checkbox"],
          ["Patreon", "behaviour.alerts.donations.patreon", "checkbox"],
          ["DonorDrive", "behaviour.alerts.donations.donordrive", "checkbox"]
        ]
      }
    ]
  },
  {
    title: "Presets",
    description: "Apply the default, stealth, or minimal visual mode, then tune each preset.",
    controls: [
      {
        title: "Default",
        description: "Restore the standard visual mode and reset mode-specific layout values.",
        preset: "default",
        controls: [
          ["Name Backgrounds", "style.showNameBackgrounds", "checkbox"],
          ["Message Backgrounds", "style.showMessageBackgrounds", "checkbox"],
          ["Alert Backgrounds", "style.showAlertBackgrounds", "checkbox"],
          ["Gift Backgrounds", "style.showGiftBackgrounds", "checkbox"],
          ["Media Backgrounds", "style.showMediaBackgrounds", "checkbox"],
          ["Border Glow", "style.borderGlow", "checkbox"],
          ["Avatar Glow", "style.showAvatarGlow", "checkbox"],
          ["Emote Glow", "style.showEmoteGlow", "checkbox"],
          ["Colored Text", "style.showColoredText", "checkbox"],
          ["Badges", "behaviour.showBadges", "checkbox"],
          ["Platform Icons", "behaviour.showPlatformIcons", "checkbox"],
          ["Animations", "animation.enabled", "checkbox"],
          ["Avatar Size", "layout.avatarSize", "range", { min: 0, max: 120, step: 1 }],
          ["Avatar Distance", "layout.avatarGap", "range", { min: 0, max: 64, step: 1 }]
        ]
      },
      {
        title: "Stealth",
        description: "Use a compact transparent mode for minimal overlay presence.",
        preset: "stealth",
        path: "style.stealthMode",
        type: "checkbox",
        controls: [
          ["Name Backgrounds", "style.showNameBackgrounds", "checkbox"],
          ["Message Backgrounds", "style.showMessageBackgrounds", "checkbox"],
          ["Alert Backgrounds", "style.showAlertBackgrounds", "checkbox"],
          ["Gift Backgrounds", "style.showGiftBackgrounds", "checkbox"],
          ["Media Backgrounds", "style.showMediaBackgrounds", "checkbox"],
          ["Border Glow", "style.borderGlow", "checkbox"],
          ["Avatar Glow", "style.showAvatarGlow", "checkbox"],
          ["Emote Glow", "style.showEmoteGlow", "checkbox"],
          ["Colored Text", "style.showColoredText", "checkbox"],
          ["Badges", "behaviour.showBadges", "checkbox"],
          ["Platform Icons", "behaviour.showPlatformIcons", "checkbox"],
          ["Animations", "animation.enabled", "checkbox"],
          ["Avatar Size", "layout.avatarSize", "range", { min: 0, max: 120, step: 1 }],
          ["Avatar Distance", "layout.avatarGap", "range", { min: 0, max: 64, step: 1 }]
        ]
      },
      {
        title: "Minimal",
        description: "Use a simplified visual mode while choosing which features remain visible.",
        preset: "minimal",
        path: "style.minimalStyle",
        type: "checkbox",
        controls: [
          ["Name Backgrounds", "style.minimal.nameBackgrounds", "checkbox"],
          ["Message Backgrounds", "style.minimal.messageBackgrounds", "checkbox"],
          ["Alert Backgrounds", "style.minimal.alertBackgrounds", "checkbox"],
          ["Gift Backgrounds", "style.minimal.giftBackgrounds", "checkbox"],
          ["Glow", "style.minimal.glow", "checkbox"],
          ["Avatar Glow", "style.showAvatarGlow", "checkbox"],
          ["Emote Glow", "style.showEmoteGlow", "checkbox"],
          ["Shine", "style.minimal.shine", "checkbox"],
          ["Animations", "style.minimal.animations", "checkbox"],
          ["Badges", "behaviour.showBadges", "checkbox"],
          ["Platform Icons", "behaviour.showPlatformIcons", "checkbox"],
          ["Avatar Size", "layout.avatarSize", "range", { min: 0, max: 120, step: 1 }],
          ["Avatar Distance", "layout.avatarGap", "range", { min: 0, max: 64, step: 1 }]
        ]
      }
    ]
  },
  {
    title: "Message Themes",
    description: "Apply a complete visual look for chat bubbles, platform colours, glow, shape, and motion.",
    actions: [
      ["Neon", "theme-neon"],
      ["Minimal", "theme-minimal"],
      ["Cute", "theme-cute"],
      ["Arcade", "theme-arcade"],
      ["Glass", "theme-glass"],
      ["Paper", "theme-paper"],
      ["Cyber", "theme-cyber"],
      ["Cozy", "theme-cozy"],
      ["Blueprint", "theme-blueprint"],
      ["Liminal", "theme-liminal"],
      ["Noir", "theme-noir"],
      ["Chromatic Pop", "theme-chromatic-void"],
      ["Botanical", "theme-botanical"],
      ["Plastic Pop", "theme-plastic-pop"],
      ["Starlight", "theme-starlight"],
      ["Aurora Luxe", "theme-aurora-luxe"]
    ]
  },
  {
    title: "Composition Presets",
    description: "Change layout behaviour without replacing the current visual theme.",
    actions: [
      ["Left Stack", "composition-left-stack"],
      ["Inline Feed", "composition-inline-feed"],
      ["Vertical Stage", "composition-vertical-stage"]
    ]
  },
  {
    title: "Styles",
    description: "Adjust typography, colour, and message shape.",
    controls: [
      ["Use Global Accent Colour", "style.useCustomAccentColor", "checkbox"],
      ["Global Accent Colour", "style.accentColor", "color"],
      ["Title Text Color", "style.titleTextColor", "color"],
      ["Message Text Color", "style.messageTextColor", "color"],
      ["Title Font", "style.accentFontFamily", "font"],
      ["Message Font", "style.messageFontFamily", "font"],
      ["Title Size", "style.titleFontSize", "range", { min: 10, max: 34, step: 1 }],
      ["Message Size", "style.messageFontSize", "range", { min: 12, max: 42, step: 1 }],
      ["Title Line Spacing", "style.titleLineHeight", "range", { min: 0.9, max: 2, step: 0.01 }],
      ["Message Line Spacing", "style.messageLineHeight", "range", { min: 0.9, max: 2, step: 0.01 }]
    ]
  },
  {
    title: "Global Colours",
    description: "Choose shared text, surface, effect, and default rainbow colours.",
    controls: [
      {
        title: "Text Colours",
        description: "Text colours that are not tied to one event type.",
        controls: [
          ["Use Twitch Chat Identity Name Colour", "style.useTwitchChatNameColor", "checkbox"],
          ["Twitch Names", "style.colors.text.twitchName", "color"],
          ["YouTube Names", "style.colors.text.youtubeName", "color"],
          ["TikTok Names", "style.colors.text.tiktokName", "color"],
          ["Kick Names", "style.colors.text.kickName", "color"],
          ["Muted Text", "style.colors.text.muted", "color"],
          ["Dark Text", "style.colors.text.dark", "color"],
          ["Stealth Text", "style.colors.text.stealth", "color"]
        ]
      },
      {
        title: "Surface Colours",
        description: "Background, card, badge, avatar, and media colours.",
        controls: [
          ["Use Page Background", "style.showPageBackground", "checkbox"],
          ["Page Background", "style.colors.surfaces.pageBackground", "color"],
          ["Bubble Base", "style.colors.surfaces.bubbleBase", "color"],
          ["Bubble Highlight", "style.colors.surfaces.bubbleHighlight", "color"],
          ["Media Background", "style.colors.surfaces.mediaBackground", "color"],
          ["Link Preview Text", "style.colors.surfaces.linkPreviewText", "color"],
          ["Link Preview Meta", "style.colors.surfaces.linkPreviewMeta", "color"],
          ["Badge Background", "style.colors.surfaces.badgeBackground", "color"],
          ["Avatar Border", "style.colors.surfaces.avatarBorder", "color"],
          ["Avatar Fill", "style.colors.surfaces.avatarFill", "color"]
        ]
      },
      {
        title: "Effect Colours",
        description: "Shadow, glow, sparkle, highlight, and brand effect colours.",
        controls: [
          ["Shadow", "style.colors.effects.shadow", "color"],
          ["Emote Sparkle", "style.colors.effects.emoteSparkle", "color"],
          ["Gigantified Sparkle", "style.colors.effects.gigantifiedSparkle", "color"],
          ["Highlight Glow", "style.colors.effects.highlightGlow", "color"],
          ["Highlight Warm Glow", "style.colors.effects.highlightWarmGlow", "color"],
          ["TikTok Red", "style.colors.effects.tiktokRed", "color"],
          ["TikTok Blue", "style.colors.effects.tiktokBlue", "color"]
        ]
      },
      {
        title: "Rainbow Colours",
        description: "The seven colours used by highlighted/rainbow message states.",
        controls: [
          ["Rainbow 1", "style.colors.rainbow.one", "color"],
          ["Rainbow 2", "style.colors.rainbow.two", "color"],
          ["Rainbow 3", "style.colors.rainbow.three", "color"],
          ["Rainbow 4", "style.colors.rainbow.four", "color"],
          ["Rainbow 5", "style.colors.rainbow.five", "color"],
          ["Rainbow 6", "style.colors.rainbow.six", "color"],
          ["Rainbow 7", "style.colors.rainbow.seven", "color"]
        ]
      }
    ]
  },
  {
    title: "Chat Filters",
    description: "Hide bot commands and known bot accounts before they enter the feed.",
    controls: [
      {
        title: "Hidden Message Prefixes",
        description: "Messages beginning with any of these prefixes are not shown. Separate prefixes with commas.",
        controls: [
          ["Prefixes", "filters.blockedPrefixes", "list", {
            rows: 3,
            placeholder: "!, ?"
          }]
        ]
      },
      {
        title: "Ignored Users",
        description: "Messages and most alerts from these usernames are hidden. Separate usernames with commas.",
        controls: [
          ["Users", "behaviour.ignoredUsers", "list", {
            rows: 8,
            placeholder: "StreamElements, Nightbot, Piggynator"
          }]
        ]
      }
    ]
  },
  {
    title: "Shape",
    description: "Choose a bubble shape first. Slant Amount only affects slant, and Corner Notch only affects notch.",
    controls: [
      ["Fit To Screen", "layout.fitToScreen", "checkbox"],
      ["Bubble Layout", "style.bubbleLayout", "select", ["stacked", "inline", "overlapped"]],
      ["Bubble Shape", "style.bubbleShape", "select", ["rounded", "square", "slant", "notch"]],
      ["Bubble Radius", "style.bubbleRadius", "range", { min: 0, max: 48, step: 1 }],
      ["Name Radius", "style.nameBubbleRadius", "range", { min: 0, max: 48, step: 1 }],
      ["Platform Icon Side", "style.nameIconPosition", "select", ["right", "left"]],
      ["Name/Icon Edge Overlap", "style.nameIconEdgeOverlap", "range", { min: 0, max: 42, step: 1 }],
      ["Name/Icon Edge Radius", "style.nameIconEdgeRadius", "range", { min: 0, max: 48, step: 1 }],
      {
        title: "Overlapped Tag",
        description: "Controls the username tag when Bubble Layout is set to overlapped.",
        controls: [
          ["Name Tag X Offset", "style.nameTagOffsetX", "range", { min: -48, max: 96, step: 1 }],
          ["Name Tag Y Overlap", "style.nameTagOverlapY", "range", { min: 0, max: 40, step: 1 }],
          ["Message Top Padding", "style.overlappedMessageTopPadding", "range", { min: 0, max: 48, step: 1 }],
          ["Card Shadow", "style.overlappedCardShadow", "checkbox"],
          ["Random Tilt", "style.overlappedRandomTilt", "checkbox"],
          ["Tilt Amount", "style.overlappedTiltAmount", "range", { min: 0, max: 10, step: 1 }]
        ]
      },
      ["Slant Amount (slant only)", "style.bubbleSlant", "range", { min: 0, max: 48, step: 1 }],
      ["Corner Notch (notch only)", "style.bubbleNotch", "range", { min: 0, max: 48, step: 1 }]
    ]
  },
  ...createTypeStyleSections(),
  {
    title: "Display",
    description: "Show, hide, or simplify visual parts of messages that are already allowed.",
    controls: [
      {
        title: "Message Layout",
        description: "Controls how chat messages are arranged and labelled.",
        controls: [
          ["Stacked Messages", "behaviour.groupConsecutiveMessages", "checkbox"],
          ["Inline Chat", "behaviour.inlineChat", "checkbox"],
          ["Timestamps", "behaviour.showTimestamps", "checkbox"],
          ["Timestamp Format", "behaviour.timestampFormat", "select", ["time", "datetime"]],
          ["Mention Highlight", "behaviour.highlightMentions", "checkbox"],
          ["Monitor Mode", "behaviour.monitorMode", "checkbox"]
        ]
      },
      {
        title: "Visibility",
        description: "Show or hide repeated message parts without changing allowed sources.",
        controls: [
          ["Avatars", "behaviour.showAvatars", "checkbox"],
          ["Badges", "behaviour.showBadges", "checkbox"],
          ["Platform Icons", "behaviour.showPlatformIcons", "checkbox"],
          ["Username Bubble Backgrounds", "style.showNameBackgrounds", "checkbox"],
          ["Chat Message Backgrounds", "style.showMessageBackgrounds", "checkbox"],
          ["Image/Preview Backgrounds", "style.showMediaBackgrounds", "checkbox"],
          ["Border Glow", "style.borderGlow", "checkbox"],
          ["Avatar Glow", "style.showAvatarGlow", "checkbox"],
          ["Emote Glow", "style.showEmoteGlow", "checkbox"],
          ["Colored Text", "style.showColoredText", "checkbox"]
        ]
      },
      {
        title: "Alert Behaviour",
        description: "Controls alert visibility and alert-specific surfaces.",
        controls: [
          ["Alerts", "behaviour.showAlerts", "checkbox"],
          ["Compact Alerts", "behaviour.compactAlerts", "checkbox"],
          ["Alert Card Backgrounds", "style.showAlertBackgrounds", "checkbox"],
          ["TikTok Gift Card Backgrounds", "style.showGiftBackgrounds", "checkbox"]
        ]
      },
      {
        title: "Auto Scroll / Lifespan",
        description: "Controls automatic movement and timed message removal.",
        controls: [
          ["Auto Scroll", "behaviour.autoScroll", "checkbox"],
          ["Scroll Direction", "behaviour.scrollDirection", "select", ["up", "down"]],
          ["Hide After", "behaviour.removeMessagesAfterMs", "number", { min: 0, max: 600000, step: 1000 }],
          ["Hide After Fade", "behaviour.hideAfterFade", "checkbox"]
        ]
      }
    ]
  },
  {
    title: "Chat Images",
    description: "Controls URL previews and direct image/GIF/video embeds.",
    controls: [
      ["YouTube Link Preview Cards", "behaviour.showLinkPreviews", "checkbox"],
      {
        title: "Direct Media Embeds",
        description: "Allows direct image, GIF, Tenor, and video embeds based on platform roles.",
        path: "behaviour.showImageEmbeds",
        type: "checkbox",
        controls: [
          {
            title: "Twitch",
            description: "Choose which Twitch roles can post direct media embeds.",
            path: "behaviour.imageEmbeds.twitch.enabled",
            type: "checkbox",
            controls: [
              ["Everyone", "behaviour.imageEmbeds.twitch.everyone", "checkbox"],
              ["Broadcaster", "behaviour.imageEmbeds.twitch.broadcaster", "checkbox"],
              ["Moderators", "behaviour.imageEmbeds.twitch.moderators", "checkbox"],
              ["VIPs", "behaviour.imageEmbeds.twitch.vips", "checkbox"],
              ["Subscribers", "behaviour.imageEmbeds.twitch.subscribers", "checkbox"]
            ]
          },
          {
            title: "YouTube",
            description: "Choose which YouTube roles can post direct media embeds.",
            path: "behaviour.imageEmbeds.youtube.enabled",
            type: "checkbox",
            controls: [
              ["Everyone", "behaviour.imageEmbeds.youtube.everyone", "checkbox"],
              ["Owner", "behaviour.imageEmbeds.youtube.owner", "checkbox"],
              ["Moderators", "behaviour.imageEmbeds.youtube.moderators", "checkbox"],
              ["Members", "behaviour.imageEmbeds.youtube.members", "checkbox"]
            ]
          },
          {
            title: "TikTok",
            description: "Choose whether TikTok chat can post direct media embeds.",
            path: "behaviour.imageEmbeds.tiktok.enabled",
            type: "checkbox",
            controls: [
              ["Everyone", "behaviour.imageEmbeds.tiktok.everyone", "checkbox"]
            ]
          },
          {
            title: "Kick",
            description: "Choose which Kick roles can post direct media embeds.",
            path: "behaviour.imageEmbeds.kick.enabled",
            type: "checkbox",
            controls: [
              ["Everyone", "behaviour.imageEmbeds.kick.everyone", "checkbox"],
              ["Broadcaster", "behaviour.imageEmbeds.kick.broadcaster", "checkbox"],
              ["Moderators", "behaviour.imageEmbeds.kick.moderators", "checkbox"],
              ["VIPs", "behaviour.imageEmbeds.kick.vips", "checkbox"],
              ["Subscribers", "behaviour.imageEmbeds.kick.subscribers", "checkbox"]
            ]
          }
        ]
      }
    ]
  },
  {
    title: "Animation",
    description: "Controls motion effects and enlarged emote behavior.",
    controls: [
      ["Animations", "animation.enabled", "checkbox"],
      ["Speed", "animation.preset", "select", ["normal", "subtle", "fast", "slow", "none"]],
      ["Style", "animation.type", "select", [["Pop (default)", "default"], ["Slide", "slide"], ["Dissolve", "dissolve"], ["Bounce", "bounce"]]],
      ["Animate Messages", "animation.messages", "checkbox"],
      ["Animate Alerts", "animation.alerts", "checkbox"],
      ["Animate Gifts", "animation.gifts", "checkbox"],
      ["Emote Bounce", "gigantified.bounceEmotes", "checkbox"],
      ["Gigantified", "gigantified.enabled", "checkbox"]
    ]
  },
  {
    title: "Sizing",
    description: "Tune dimensions and text size for the overlay.",
    controls: [
      ["Max Messages", "layout.maxMessages", "number", { min: 0, max: 500, step: 1 }],
      ["Chat Width", "layout.chatWidth", "sizingPreset", "chatWidth"],
      ["Message Width", "layout.maxMessageWidth", "sizingPreset", "messageWidth"],
      ["Avatar Size", "layout.avatarSize", "range", { min: 0, max: 120, step: 1 }],
      ["Avatar Distance", "layout.avatarGap", "range", { min: 0, max: 64, step: 1 }],
      ["Emote-Only Size", "style.emoteOnlyFontSize", "range", { min: 18, max: 64, step: 1 }],
      ["Gigantified Size", "style.gigantifiedFontSize", "range", { min: 24, max: 86, step: 1 }]
    ]
  },
];

const aliasByPath = {
  "behaviour.sources.twitch": "twitch",
  "behaviour.sources.youtube": "youtube",
  "behaviour.sources.tiktok": "tiktok",
  "behaviour.sources.kick": "kick",
  "behaviour.chat.twitch": "twitchChat",
  "behaviour.chat.youtube": "youtubeChat",
  "behaviour.chat.tiktok": "tiktokChat",
  "behaviour.chat.kick": "kickChat",
  "behaviour.alerts.kick.follows": "kickFollows",
  "behaviour.alerts.kick.subs": "kickSubs",
  "behaviour.alerts.kick.giftSubs": "kickGiftSubs",
  "behaviour.alerts.kick.rewardRedemptions": "kickRewards",
  "behaviour.showAlerts": "alerts",
  "behaviour.showAvatars": "avatars",
  "behaviour.showBadges": "badges",
  "behaviour.showPlatformIcons": "platformIcons",
  "behaviour.groupConsecutiveMessages": "stacked",
  "behaviour.ignoredUsers": "ignoredUsers",
  "filters.blockedPrefixes": "blockedPrefixes",
  "behaviour.showImageEmbeds": "images",
  "behaviour.showLinkPreviews": "previews",
  "behaviour.imageEmbeds.twitch.enabled": "twitchImages",
  "behaviour.imageEmbeds.twitch.everyone": "twitchImagesEveryone",
  "behaviour.imageEmbeds.twitch.broadcaster": "twitchImagesBroadcaster",
  "behaviour.imageEmbeds.twitch.moderators": "twitchImagesMods",
  "behaviour.imageEmbeds.twitch.vips": "twitchImagesVips",
  "behaviour.imageEmbeds.twitch.subscribers": "twitchImagesSubs",
  "behaviour.imageEmbeds.youtube.enabled": "youtubeImages",
  "behaviour.imageEmbeds.youtube.everyone": "youtubeImagesEveryone",
  "behaviour.imageEmbeds.youtube.owner": "youtubeImagesOwner",
  "behaviour.imageEmbeds.youtube.moderators": "youtubeImagesMods",
  "behaviour.imageEmbeds.youtube.members": "youtubeImagesMembers",
  "behaviour.imageEmbeds.tiktok.enabled": "tiktokImages",
  "behaviour.imageEmbeds.tiktok.everyone": "tiktokImagesEveryone",
  "behaviour.imageEmbeds.kick.enabled": "kickImages",
  "behaviour.imageEmbeds.kick.everyone": "kickImagesEveryone",
  "behaviour.imageEmbeds.kick.broadcaster": "kickImagesBroadcaster",
  "behaviour.imageEmbeds.kick.moderators": "kickImagesMods",
  "behaviour.imageEmbeds.kick.vips": "kickImagesVips",
  "behaviour.imageEmbeds.kick.subscribers": "kickImagesSubs",
  "behaviour.alerts.twitch.enabled": "twitchAlerts",
  "behaviour.alerts.twitch.announcements": "twitchAnnouncements",
  "behaviour.alerts.twitch.channelPointRedemptions": "twitchPoints",
  "behaviour.alerts.twitch.cheers": "twitchCheers",
  "behaviour.alerts.twitch.follows": "twitchFollows",
  "behaviour.alerts.twitch.subs": "twitchSubs",
  "behaviour.alerts.twitch.giftSubs": "twitchGiftSubs",
  "behaviour.alerts.twitch.raids": "twitchRaids",
  "behaviour.alerts.twitch.watchStreaks": "twitchWatchStreaks",
  "behaviour.alerts.twitch.upgrades": "twitchUpgrades",
  "behaviour.alerts.twitch.hype": "twitchHype",
  "behaviour.alerts.twitch.hypeTrain": "twitchHypeTrain",
  "behaviour.alerts.twitch.charity": "twitchCharity",
  "behaviour.alerts.twitch.goals": "twitchGoals",
  "behaviour.alerts.twitch.polls": "twitchPolls",
  "behaviour.alerts.twitch.predictions": "twitchPredictions",
  "behaviour.alerts.twitch.sharedChat": "twitchSharedChat",
  "behaviour.alerts.twitch.shoutouts": "twitchShoutouts",
  "behaviour.alerts.twitch.stream": "twitchStream",
  "behaviour.alerts.twitch.moderation": "twitchModeration",
  "behaviour.alerts.twitch.system": "twitchSystem",
  "behaviour.alertRoutes.twitch.watchStreaks": "twitchWatchStreakRoute",
  "behaviour.alerts.youtube.enabled": "youtubeAlerts",
  "behaviour.alerts.youtube.superChats": "youtubeSuperChats",
  "behaviour.alerts.youtube.superStickers": "youtubeStickers",
  "behaviour.alerts.youtube.members": "youtubeMembers",
  "behaviour.alerts.youtube.gifts": "youtubeGifts",
  "behaviour.alerts.youtube.polls": "youtubePolls",
  "behaviour.alerts.youtube.stream": "youtubeStream",
  "behaviour.alerts.youtube.moderation": "youtubeModeration",
  "behaviour.alerts.youtube.system": "youtubeSystem",
  "behaviour.alerts.tiktok.enabled": "tiktokAlerts",
  "behaviour.alerts.tiktok.follows": "tiktokFollows",
  "behaviour.alerts.tiktok.subscribers": "tiktokSubscribers",
  "behaviour.alerts.tiktok.gifts": "tiktokGifts",
  "behaviour.alerts.tiktok.likes": "tiktokLikes",
  "behaviour.alerts.tiktok.treasureBoxes": "tiktokTreasure",
  "behaviour.alerts.tiktok.shares": "tiktokShares",
  "behaviour.alerts.tiktok.joins": "tiktokJoins",
  "behaviour.alerts.tiktok.questions": "tiktokQuestions",
  "behaviour.alerts.tiktok.goals": "tiktokGoals",
  "behaviour.alerts.tiktok.polls": "tiktokPolls",
  "behaviour.alerts.tiktok.battles": "tiktokBattles",
  "behaviour.alerts.tiktok.stream": "tiktokStream",
  "behaviour.alerts.tiktok.system": "tiktokSystem",
  "behaviour.alerts.kick.stream": "kickStream",
  "behaviour.alerts.kick.moderation": "kickModeration",
  "behaviour.alerts.kick.system": "kickSystem",
  "behaviour.alerts.donations.enabled": "donations",
  "behaviour.alerts.donations.streamlabs": "streamlabs",
  "behaviour.alerts.donations.streamelements": "streamelements",
  "behaviour.alerts.donations.kofi": "kofi",
  "behaviour.alerts.donations.tipeeestream": "tipeeestream",
  "behaviour.alerts.donations.fourthwall": "fourthwall",
  "behaviour.alerts.donations.patreon": "patreon",
  "behaviour.alerts.donations.donordrive": "donordrive",
  "style.showNameBackgrounds": "nameBg",
  "style.showMessageBackgrounds": "messageBg",
  "style.showAlertBackgrounds": "alertBg",
  "style.showGiftBackgrounds": "giftBg",
  "style.showMediaBackgrounds": "mediaBg",
  "style.showPageBackground": "pageBg",
  "style.showAvatarGlow": "avatarGlow",
  "style.showEmoteGlow": "emoteGlow",
  "style.showColoredText": "coloredText",
  "style.stealthMode": "stealth",
  "style.borderGlow": "borderGlow",
  "style.nameIconPosition": "iconSide",
  "style.nameIconEdgeOverlap": "nameIconOverlap",
  "style.nameIconEdgeRadius": "nameIconRadius",
  "style.useTwitchChatNameColor": "twitchNameColor",
  "style.useCustomAccentColor": "customAccent",
  "style.accentColor": "accentColor",
  "style.titleTextColor": "titleColor",
  "style.messageTextColor": "messageColor",
  "style.colors.surfaces.pageBackground": "pageBgColor",
  "style.colors.surfaces.bubbleBase": "bubbleBase",
  "style.colors.surfaces.mediaBackground": "mediaBgColor",
  "style.colors.surfaces.badgeBackground": "badgeBg",
  "style.colors.surfaces.avatarBorder": "avatarBorder",
  "style.colors.effects.emoteSparkle": "emoteSparkle",
  "style.colors.effects.gigantifiedSparkle": "gigantifiedSparkle",
  "style.colors.effects.highlightGlow": "highlightGlow",
  "style.colors.effects.highlightWarmGlow": "highlightWarmGlow",
  "style.colors.rainbow.one": "rainbow1",
  "style.colors.rainbow.two": "rainbow2",
  "style.colors.rainbow.three": "rainbow3",
  "style.colors.rainbow.four": "rainbow4",
  "style.colors.rainbow.five": "rainbow5",
  "style.colors.rainbow.six": "rainbow6",
  "style.colors.rainbow.seven": "rainbow7",
  "style.colors.twitch.chat": "twitchChatColor",
  "style.colors.twitch.announcements": "twitchAnnouncementsColor",
  "style.colors.twitch.channelPointRedemptions": "twitchPointsColor",
  "style.colors.twitch.cheers": "twitchCheersColor",
  "style.colors.twitch.follows": "twitchFollowsColor",
  "style.colors.twitch.subs": "twitchSubsColor",
  "style.colors.twitch.giftSubs": "twitchGiftSubsColor",
  "style.colors.twitch.raids": "twitchRaidsColor",
  "style.colors.twitch.watchStreaks": "twitchWatchStreaksColor",
  "style.colors.twitch.upgrades": "twitchUpgradesColor",
  "style.colors.twitch.hype": "twitchHypeColor",
  "style.colors.twitch.hypeTrain": "twitchHypeTrainColor",
  "style.colors.twitch.charity": "twitchCharityColor",
  "style.colors.twitch.goals": "twitchGoalsColor",
  "style.colors.twitch.polls": "twitchPollsColor",
  "style.colors.twitch.predictions": "twitchPredictionsColor",
  "style.colors.twitch.sharedChat": "twitchSharedChatColor",
  "style.colors.twitch.shoutouts": "twitchShoutoutsColor",
  "style.colors.twitch.stream": "twitchStreamColor",
  "style.colors.twitch.moderation": "twitchModerationColor",
  "style.colors.twitch.system": "twitchSystemColor",
  "style.colors.youtube.chat": "youtubeChatColor",
  "style.colors.youtube.superChats": "youtubeSuperChatsColor",
  "style.colors.youtube.superStickers": "youtubeStickersColor",
  "style.colors.youtube.members": "youtubeMembersColor",
  "style.colors.youtube.gifts": "youtubeGiftsColor",
  "style.colors.youtube.polls": "youtubePollsColor",
  "style.colors.youtube.stream": "youtubeStreamColor",
  "style.colors.youtube.moderation": "youtubeModerationColor",
  "style.colors.youtube.system": "youtubeSystemColor",
  "style.colors.tiktok.chat": "tiktokChatColor",
  "style.colors.tiktok.follows": "tiktokFollowsColor",
  "style.colors.tiktok.subscribers": "tiktokSubscribersColor",
  "style.colors.tiktok.gifts": "tiktokGiftsColor",
  "style.colors.tiktok.likes": "tiktokLikesColor",
  "style.colors.tiktok.treasureBoxes": "tiktokTreasureColor",
  "style.colors.tiktok.shares": "tiktokSharesColor",
  "style.colors.tiktok.joins": "tiktokJoinsColor",
  "style.colors.tiktok.questions": "tiktokQuestionsColor",
  "style.colors.tiktok.goals": "tiktokGoalsColor",
  "style.colors.tiktok.polls": "tiktokPollsColor",
  "style.colors.tiktok.battles": "tiktokBattlesColor",
  "style.colors.tiktok.stream": "tiktokStreamColor",
  "style.colors.tiktok.system": "tiktokSystemColor",
  "style.colors.kick.chat": "kickChatColor",
  "style.colors.kick.follows": "kickFollowsColor",
  "style.colors.kick.subs": "kickSubsColor",
  "style.colors.kick.giftSubs": "kickGiftSubsColor",
  "style.colors.kick.rewardRedemptions": "kickRewardsColor",
  "style.colors.kick.stream": "kickStreamColor",
  "style.colors.kick.moderation": "kickModerationColor",
  "style.colors.kick.system": "kickSystemColor",
  "style.colors.text.kickName": "kickNameColor",
  "style.colors.donations.streamlabs": "streamlabsColor",
  "style.colors.donations.streamelements": "streamelementsColor",
  "style.colors.donations.kofi": "kofiColor",
  "style.colors.donations.tipeeestream": "tipeeestreamColor",
  "style.colors.donations.fourthwall": "fourthwallColor",
  "style.colors.donations.patreon": "patreonColor",
  "style.colors.donations.donordrive": "donordriveColor",
  "style.colors.special.rainbow": "rainbowChatColor",
  "style.accentFontFamily": "titleFont",
  "style.messageFontFamily": "messageFont",
  "style.titleFontSize": "titleSize",
  "style.titleLineHeight": "titleLineHeight",
  "style.messageLineHeight": "messageLineHeight",
  "style.bubbleLayout": "bubbleLayout",
  "style.bubbleShape": "bubbleShape",
  "style.nameBubbleRadius": "nameRadius",
  "style.nameTagOffsetX": "nameTagX",
  "style.nameTagOverlapY": "nameTagOverlap",
  "style.overlappedMessageTopPadding": "overlapTopPadding",
  "style.overlappedCardShadow": "overlapShadow",
  "style.overlappedRandomTilt": "overlapTilt",
  "style.overlappedTiltAmount": "overlapTiltAmount",
  "style.bubbleSlant": "slant",
  "style.bubbleNotch": "notch",
  "layout.fitToScreen": "fitToScreen",
  "layout.chatWidth": "chatWidth",
  "layout.maxMessageWidth": "messageWidth",
  "animation.enabled": "animations",
  "animation.preset": "animation",
  "gigantified.bounceEmotes": "bounce",
  "gigantified.enabled": "gigantified",
  "layout.maxMessages": "max",
  "style.messageFontSize": "messageSize",
  "layout.avatarSize": "avatarSize",
  "layout.avatarGap": "avatarGap",
  "behaviour.inlineChat": "inline",
  "behaviour.showTimestamps": "timestamps",
  "behaviour.timestampFormat": "timestampFormat",
  "behaviour.highlightMentions": "mentions",
  "behaviour.monitorMode": "monitor",
  "behaviour.compactAlerts": "compactAlerts",
  "behaviour.autoScroll": "autoScroll",
  "behaviour.scrollDirection": "scrollDirection",
  "behaviour.hideAfterFade": "fadeAfter",
  "style.minimalStyle": "minimal",
  "style.emoteOnlyFontSize": "emoteSize",
  "style.gigantifiedFontSize": "gigantifiedSize",
  "style.bubbleRadius": "bubbleRadius",
  "behaviour.removeMessagesAfterMs": "removeAfter",
  "scrollTest.enabled": "test",
  "scrollTest.autoScroll": "testAutoScroll",
  "scrollTest.intervalMs": "testInterval",
  "streamerbot.host": "streamerbotHost",
  "streamerbot.port": "streamerbotPort",
  "streamerbot.reconnectMs": "streamerbotReconnect",
  "tikfinity.enabled": "tikfinityEnabled",
  "tikfinity.host": "tikfinityHost",
  "tikfinity.port": "tikfinityPort",
  "tikfinity.reconnectMs": "tikfinityReconnect"
};

function toUrlPascalPart(value) {
  return String(value || "").replace(/^[a-z]/, char => char.toUpperCase());
}

function getFriendlyTypeStyleParam(path) {
  const match = String(path || "").match(/^style\.typeStyles\.([^.]+)\.([^.]+)\.([^.]+)$/);
  if (!match) return "";

  const [, group, type, field] = match;
  const friendlyField = field.endsWith("Enabled")
    ? field.slice(0, -"Enabled".length)
    : field;

  return `${group}${toUrlPascalPart(type)}${toUrlPascalPart(friendlyField)}`;
}

function getUrlParamName(path) {
  return aliasByPath[path] || getFriendlyTypeStyleParam(path) || path;
}

const pathByAlias = Object.fromEntries(
  Object.entries(aliasByPath).map(([path, alias]) => [alias, path])
);

function friendlyTypeStyleParamToPath(key) {
  const value = String(key || "");
  const typeStyles = readDefaultConfig("style.typeStyles") || {};
  const group = Object.keys(typeStyles)
    .sort((a, b) => b.length - a.length)
    .find(candidate => value.startsWith(candidate));

  if (!group) return "";

  const afterGroup = value.slice(group.length);
  const types = typeStyles[group] || {};
  const type = Object.keys(types)
    .map(candidate => ({
      raw: candidate,
      param: toUrlPascalPart(candidate)
    }))
    .sort((a, b) => b.param.length - a.param.length)
    .find(candidate => afterGroup.startsWith(candidate.param));

  if (!type) return "";

  const fieldParam = afterGroup.slice(type.param.length);
  if (!fieldParam) return "";

  const style = types[type.raw] || {};
  const field = Object.keys(style)
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

function resolveImportedUrlConfigPath(key) {
  if (key === "dock") return "behaviour.monitorMode";
  return pathByAlias[key] || friendlyTypeStyleParamToPath(key) || key;
}

function isAllowedImportedUrlConfigPath(path) {
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
  ].some(prefix => String(path || "").startsWith(prefix));
}

function parseImportedUrlConfigValue(value, path = "") {
  const text = String(value || "").trim();
  const lower = text.toLowerCase();

  if (isListConfigPath(path)) return parseListConfigValue(text);
  if (["true", "1", "yes", "on"].includes(lower)) return true;
  if (["false", "0", "no", "off"].includes(lower)) return false;
  if (lower === "null") return null;
  if (/^-?\d+(?:\.\d+)?$/.test(text)) return Number(text);

  return text;
}

function isListConfigPath(path) {
  return [
    "behaviour.ignoredUsers",
    "filters.blockedPrefixes"
  ].includes(String(path || ""));
}

function parseListConfigValue(value) {
  if (Array.isArray(value)) return value.map(item => String(item).trim()).filter(Boolean);

  return String(value || "")
    .split(/[\n,]+/)
    .map(item => item.trim())
    .filter(Boolean);
}

function formatListConfigValue(value) {
  return Array.isArray(value)
    ? value.join(", ")
    : String(value || "");
}

const packagedFontFamilies = [
  "Sora",
  "Inter",
  "Poppins",
  "Montserrat",
  "Roboto",
  "Oswald",
  "Bebas Neue",
  "Anton",
  "Bangers",
  "Black Ops One",
  "Caveat",
  "Chakra Petch",
  "Cinzel",
  "DM Sans",
  "Exo 2",
  "Fredoka",
  "Orbitron",
  "Permanent Marker",
  "Playfair Display",
  "Righteous",
  "Rubik",
  "Space Grotesk",
  "Teko",
  "Ubuntu",
  "Work Sans",
  "Arial",
  "Georgia",
  "Courier New"
];
const fontFallbacks = {
  Arial: "sans-serif",
  Georgia: "serif",
  "Courier New": "monospace"
};
const fontPickerRows = new Set();
let fontFamilies = [...packagedFontFamilies];
let localFontLoadPromise = null;

const sizingPresetGroups = {
  chatWidth: {
    path: "layout.chatWidth",
    options: [
      {
        label: "Compact",
        value: "clamp(320px, 70vw, 560px)",
        description: "A slimmer chat lane for tight scenes or side docks."
      },
      {
        label: "Standard",
        value: "clamp(320px, 92vw, 820px)",
        description: "Balanced default width for most overlays."
      },
      {
        label: "Wide",
        value: "clamp(420px, 96vw, 1100px)",
        description: "More room for long names, alerts, and wide scenes."
      }
    ],
    customDescription: "Use a custom CSS width for the whole chat lane."
  },
  messageWidth: {
    path: "layout.maxMessageWidth",
    options: [
      {
        label: "Auto",
        value: "var(--chat-content-width)",
        description: "Uses the available width after avatar and spacing."
      },
      {
        label: "Match Chat",
        value: "100%",
        description: "Lets message bubbles fill the chat lane."
      },
      {
        label: "Narrow",
        value: "min(520px, var(--chat-content-width))",
        description: "Keeps individual messages shorter and easier to scan."
      }
    ],
    customDescription: "Use a custom CSS width for individual message bubbles."
  }
};

function quoteFontFamily(family) {
  const clean = String(family || "").trim().replace(/^['"]|['"]$/g, "");
  if (!clean) return "'Sora', sans-serif";
  const fallback = fontFallbacks[clean] || "sans-serif";
  return `'${clean.replace(/'/g, "\\'")}', ${fallback}`;
}

function fontLabelFromCss(value) {
  const first = String(value || "")
    .split(",")[0]
    .trim()
    .replace(/^['"]|['"]$/g, "");

  return first || String(value || "").trim() || "Sora";
}

function fontValueFromInput(value) {
  const text = String(value || "").trim();
  if (!text) return "'Sora', sans-serif";
  if (text.includes(",") || /^['"].*['"]$/.test(text)) return text;
  return quoteFontFamily(text);
}

function normaliseFontList(families) {
  const seen = new Set();
  return families
    .map(fontLabelFromCss)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
    .filter(family => {
      const key = family.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

async function loadLocalFonts() {
  if (localFontLoadPromise) return localFontLoadPromise;

  localFontLoadPromise = (async () => {
    if (typeof window.queryLocalFonts !== "function") return fontFamilies;

    try {
      const fonts = await window.queryLocalFonts();
      fontFamilies = normaliseFontList([
        ...packagedFontFamilies,
        ...fonts.map(font => font.family || font.fullName)
      ]);
      refreshFontPickerRows();
    } catch (error) {
      fontFamilies = normaliseFontList(fontFamilies);
    }

    return fontFamilies;
  })();

  return localFontLoadPromise;
}

function closeFontPickerLists(except = null) {
  fontPickerRows.forEach(row => {
    if (row !== except) {
      row.querySelector(".font-picker-list")?.setAttribute("hidden", "");
    }
  });
}

function renderFontPickerOptions(row, query = "") {
  const list = row.querySelector(".font-picker-list");
  if (!list) return;

  const needle = String(query || "").trim().toLowerCase();
  const matches = fontFamilies
    .filter(family => !needle || family.toLowerCase().includes(needle))
    .slice(0, 140);

  list.replaceChildren();

  if (!matches.length) {
    const empty = document.createElement("div");
    empty.className = "font-picker-empty";
    empty.textContent = "Type a font name to use it";
    list.appendChild(empty);
    return;
  }

  matches.forEach(family => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "font-picker-option";
    option.textContent = family;
    option.style.fontFamily = quoteFontFamily(family);
    option.addEventListener("click", () => {
      const input = row.querySelector("[data-font-picker-input]");
      const value = quoteFontFamily(family);
      input.value = family;
      input.dataset.value = value;
      input.style.fontFamily = value;
      list.setAttribute("hidden", "");
      writeConfig(row.dataset.path, value);
    });
    list.appendChild(option);
  });
}

function refreshFontPickerRows() {
  fontPickerRows.forEach(row => {
    renderFontPickerOptions(row);
  });
}

function getActiveSizingPreset(group, value) {
  return group.options.find(option => String(option.value) === String(value)) || null;
}

function syncSizingPresetControl(row, value = readConfig(row.dataset.path)) {
  const group = sizingPresetGroups[row.dataset.presetGroup];
  if (!group) return;

  const active = getActiveSizingPreset(group, value);
  const customActive = !active;
  const description = row.querySelector(".preset-description");
  const customInput = row.querySelector(".preset-custom-input");

  row.querySelectorAll("[data-preset-value]").forEach(button => {
    button.classList.toggle("active", String(button.dataset.presetValue) === String(value));
  });
  row.querySelector("[data-preset-custom]")?.classList.toggle("active", customActive);

  if (description) {
    description.textContent = active?.description || group.customDescription;
  }

  if (customInput) {
    customInput.hidden = !customActive;
    customInput.value = value ?? "";
  }
}

function createSizingPresetControl(row, presetGroupKey, value) {
  const group = sizingPresetGroups[presetGroupKey];
  const wrap = document.createElement("span");
  const buttons = document.createElement("span");
  const description = document.createElement("span");
  const customInput = document.createElement("input");

  row.dataset.presetGroup = presetGroupKey;
  wrap.className = "preset-control";
  buttons.className = "preset-buttons";
  description.className = "preset-description";
  customInput.className = "preset-custom-input";
  customInput.type = "text";
  customInput.spellcheck = false;

  group.options.forEach(option => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.presetValue = option.value;
    button.textContent = option.label;
    button.addEventListener("click", () => {
      writeConfig(group.path, option.value);
    });
    buttons.appendChild(button);
  });

  const customButton = document.createElement("button");
  customButton.type = "button";
  customButton.dataset.presetCustom = "true";
  customButton.textContent = "Custom";
  customButton.addEventListener("click", () => {
    customInput.hidden = false;
    customInput.focus();
    customInput.select();
    syncSizingPresetControl(row, customInput.value || readConfig(group.path));
  });
  buttons.appendChild(customButton);

  customInput.addEventListener("change", () => {
    writeConfig(group.path, customInput.value);
  });

  customInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      customInput.blur();
    }
  });

  wrap.append(buttons, description, customInput);
  syncSizingPresetControl(row, value);
  return wrap;
}

function createFontPicker(path, value) {
  const picker = document.createElement("span");
  picker.className = "font-picker";

  const input = document.createElement("input");
  input.type = "text";
  input.autocomplete = "off";
  input.spellcheck = false;
  input.placeholder = "Type any font name";
  input.dataset.fontPickerInput = "true";
  input.value = fontLabelFromCss(value);
  input.dataset.value = value || fontValueFromInput(input.value);
  input.style.fontFamily = input.dataset.value;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "font-picker-button";
  button.textContent = "v";
  button.setAttribute("aria-label", "Show fonts");

  const list = document.createElement("div");
  list.className = "font-picker-list";
  list.setAttribute("hidden", "");

  const open = (query = "") => {
    const row = picker.closest(".config-control");
    closeFontPickerLists(row);
    renderFontPickerOptions(row, query);
    list.removeAttribute("hidden");
    loadLocalFonts();
  };

  input.addEventListener("focus", () => open());
  input.addEventListener("input", () => {
    const row = picker.closest(".config-control");
    input.dataset.value = fontValueFromInput(input.value);
    input.style.fontFamily = input.dataset.value;
    renderFontPickerOptions(row, input.value);
  });
  input.addEventListener("change", () => {
    const nextValue = fontValueFromInput(input.value);
    input.value = fontLabelFromCss(nextValue);
    input.dataset.value = nextValue;
    input.style.fontFamily = nextValue;
    writeConfig(path, nextValue);
  });
  button.addEventListener("click", () => {
    open();
    input.focus();
    input.select();
  });

  picker.append(input, button, list);
  return picker;
}

const initialValues = new Map();
let activeStylePresetMode = null;

function readConfig(path) {
  return window.getChatConfigValue?.(path);
}

function readDefaultConfig(path) {
  return window.getChatDefaultConfigValue?.(path);
}

function getActiveStylePreset() {
  if (activeStylePresetMode === "none") return null;
  if (activeStylePresetMode) return activeStylePresetMode;
  if (readConfig("style.stealthMode")) return "stealth";
  if (readConfig("style.minimalStyle")) return "minimal";
  return "default";
}

function resetActiveStylePresetMode() {
  activeStylePresetMode = null;
}

function setActiveStylePresetMode(preset) {
  activeStylePresetMode = preset || "none";
}

function applyStylePreset(preset) {
  activeStylePresetMode = preset || "none";

  window.applyChatStylePreset?.(preset);
  syncControls();
  refreshTypeStylePreview();
  updateUrlOutput();
}

function writeConfig(path, value, options = {}) {
  if (path === "style.stealthMode" || path === "style.minimalStyle") {
    resetActiveStylePresetMode();
  }

  if (typeStyleEditorState.group === GLOBAL_TYPE_STYLE_GROUP && isGlobalTypeStyleProxyPath(path)) {
    writeConfigEntries([[path, value]], options);
    return;
  }

  window.setChatConfigValue?.(path, value, options);

  if (path === "behaviour.groupConsecutiveMessages") {
    window.sendStackedMessageTest?.();
  }

  if (options.deferUiSync) {
    scheduleTypeStylePreviewRefresh();
    return;
  }

  syncControls();
  refreshTypeStylePreview();
  updateUrlOutput();
}

function writeConfigEntries(entries, options = {}) {
  if (entries.some(([path]) => path === "style.stealthMode" || path === "style.minimalStyle")) {
    resetActiveStylePresetMode();
  }

  const nextEntries =
    typeStyleEditorState.group === GLOBAL_TYPE_STYLE_GROUP
      ? expandGlobalTypeStyleEntries(entries)
      : entries;

  if (window.setChatConfigValues) {
    window.setChatConfigValues(nextEntries, options);
  } else {
    nextEntries.forEach(([path, value]) => window.setChatConfigValue?.(path, value, options));
  }

  if (options.deferUiSync) {
    scheduleTypeStylePreviewRefresh();
    return;
  }

  syncControls();
  refreshTypeStylePreview();
  updateUrlOutput();
}

function isGlobalTypeStyleProxyPath(path) {
  return String(path || "").startsWith(
    `style.typeStyles.${GLOBAL_TYPE_STYLE_PROXY_GROUP}.${GLOBAL_TYPE_STYLE_PROXY_TYPE}.`
  );
}

function expandGlobalTypeStyleEntries(entries) {
  const typeStyles = readConfig("style.typeStyles") || readDefaultConfig("style.typeStyles") || {};
  const expanded = [];

  entries.forEach(([path, value]) => {
    const match = String(path || "").match(/^style\.typeStyles\.[^.]+\.[^.]+\.(.+)$/);
    if (!match || !isGlobalTypeStyleProxyPath(path)) {
      expanded.push([path, value]);
      return;
    }

    const field = match[1];
    Object.entries(typeStyles).forEach(([group, types]) => {
      Object.keys(types || {}).forEach(type => {
        const targetPath = `style.typeStyles.${group}.${type}.${field}`;
        if (!initialValues.has(targetPath)) {
          initialValues.set(targetPath, readConfig(targetPath));
        }
        expanded.push([targetPath, cloneForSettings(value)]);
      });
    });
  });

  return expanded;
}

function cloneForSettings(value) {
  if (value === null || typeof value !== "object") return value;
  return JSON.parse(JSON.stringify(value));
}

let previewRefreshFrame = 0;

function scheduleTypeStylePreviewRefresh() {
  if (previewRefreshFrame) return;

  previewRefreshFrame = requestAnimationFrame(() => {
    previewRefreshFrame = 0;
    refreshTypeStylePreview();
  });
}

function flushTypeStylePreviewRefresh() {
  if (!previewRefreshFrame) return false;

  cancelAnimationFrame(previewRefreshFrame);
  previewRefreshFrame = 0;
  refreshTypeStylePreview();
  return true;
}

function collectControlPaths(control) {
  if (Array.isArray(control)) return [control[1]];

  if (control.kind === "gradient") {
    return [
      ...(control.prefix.includes("Border") || control.prefix.includes("Glow") ? [`${control.pathPrefix}Enabled`] : []),
      `${control.pathPrefix}Mode`,
      `${control.pathPrefix}Angle`,
      `${control.pathPrefix}Opacity`,
      ...gradientColorKeys.map(key => `${control.pathPrefix}${key}`),
      ...gradientStopKeys.map(key => `${control.pathPrefix}${key}`),
      ...gradientAlphaKeys.map(key => `${control.pathPrefix}${key}`)
    ];
  }

  return (control.controls || []).flatMap(collectControlPaths);
}

function resetControlGroup(group, render = null) {
  const entries = collectControlPaths(group)
    .map(path => [path, readDefaultConfig(path)])
    .filter(([, value]) => value !== undefined);

  writeConfigEntries(entries);

  if (typeof render === "function") {
    render();
  }
}

function syncControls() {
  document.querySelectorAll(".config-control[data-path], .config-control[data-preset-mode]").forEach(row => {
    if (row.dataset.presetMode) {
      const presetInput = row.querySelector("input");
      if (presetInput) {
        presetInput.checked = getActiveStylePreset() === row.dataset.presetMode;
      }
      return;
    }

    const path = row.dataset.path;
    const fontInput = row.querySelector("[data-font-picker-input]");
    const input = row.querySelector("input, select, textarea");
    const value = readConfig(path);

    if (fontInput) {
      fontInput.value = fontLabelFromCss(value);
      fontInput.dataset.value = value || fontValueFromInput(fontInput.value);
      fontInput.style.fontFamily = fontInput.dataset.value;
      return;
    }

    if (row.dataset.presetGroup) {
      syncSizingPresetControl(row, value);
      return;
    }

    if (!input) return;

    if (input.dataset.listControl === "true") {
      input.value = formatListConfigValue(value);
    } else if (input.type === "checkbox") {
      input.checked = !!value;
    } else {
      input.value = value;
    }

    const rangeValue = row.querySelector(".range-value");
    if (rangeValue) {
      rangeValue.textContent = input.value;
    }
  });
}

function createControl([label, path, type, options]) {
  const row = document.createElement("label");
  row.className = "config-control";
  row.classList.add(`config-control-${type}`);
  row.dataset.path = path;

  const text = document.createElement("span");
  text.textContent = label;
  row.appendChild(text);

  let input;
  const value = readConfig(path);
  initialValues.set(path, value);

  if (type === "font") {
    row.appendChild(createFontPicker(path, value));
    fontPickerRows.add(row);
    return row;
  }

  if (type === "sizingPreset") {
    row.classList.add("config-control-preset");
    row.appendChild(createSizingPresetControl(row, options, value));
    return row;
  }

  if (type === "select") {
    input = document.createElement("select");
    options.forEach(option => {
      const optionLabel = Array.isArray(option)
        ? option[0]
        : (option && typeof option === "object" ? option.label : option);
      const optionValue = Array.isArray(option)
        ? option[1]
        : (option && typeof option === "object" ? option.value : option);
      const el = document.createElement("option");
      el.value = optionValue;
      el.textContent = optionLabel;
      input.appendChild(el);
    });
    input.value = value;
  } else if (type === "list") {
    input = document.createElement("textarea");
    input.dataset.listControl = "true";
    input.spellcheck = false;
    input.rows = options?.rows || 5;
    input.placeholder = options?.placeholder || "One item per line";
    input.value = formatListConfigValue(value);
  } else {
    input = document.createElement("input");
    input.type = type;

    if (type === "checkbox") {
      input.checked = !!value;
    } else {
      input.value = value;
    }

    if (options && typeof options === "object") {
      Object.entries(options).forEach(([key, optionValue]) => {
        input.setAttribute(key, optionValue);
      });
    }
  }

  if (type === "range") {
    const wrap = document.createElement("span");
    const output = document.createElement("span");
    const number = document.createElement("input");
    wrap.className = "range-wrap";
    output.className = "range-value";
    number.type = "number";
    number.className = "range-number";
    number.value = input.value;
    ["min", "max", "step"].forEach(attr => {
      if (input.hasAttribute(attr)) number.setAttribute(attr, input.getAttribute(attr));
    });
    output.textContent = input.value;
    wrap.append(input, number, output);
    row.appendChild(wrap);
    input.addEventListener("input", () => {
      output.textContent = input.value;
      number.value = input.value;
      writeConfig(path, Number(input.value), { deferApply: true, deferUiSync: true });
    });
    input.addEventListener("change", () => {
      output.textContent = input.value;
      number.value = input.value;
      writeConfig(path, Number(input.value));
    });
    number.addEventListener("input", () => {
      input.value = number.value;
      output.textContent = number.value;
      writeConfig(path, Number(number.value), { deferApply: true, deferUiSync: true });
    });
    number.addEventListener("change", () => {
      input.value = number.value;
      output.textContent = number.value;
      writeConfig(path, Number(number.value));
    });
    return row;
  }

  const getInputValue = () =>
    type === "list"
      ? parseListConfigValue(input.value)
      : type === "checkbox"
      ? input.checked
      : type === "number"
        ? Number(input.value)
        : input.value;

  if (type === "color") {
    input.addEventListener("input", () => {
      writeConfig(path, getInputValue(), { deferApply: true, deferUiSync: true });
    });
    input.addEventListener("change", () => {
      writeConfig(path, getInputValue());
    });
    row.appendChild(input);
    return row;
  }

  const handleInputChange = () => {
    const nextValue =
      getInputValue();

    writeConfig(path, nextValue);
  };

  input.addEventListener("input", handleInputChange);
  input.addEventListener("change", handleInputChange);

  row.appendChild(input);
  return row;
}

const gradientSuffixes = ["", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const gradientColorKeys = gradientSuffixes.map(suffix => `Color${suffix}`);
const gradientStopKeys = gradientSuffixes.map(suffix => `Color${suffix}Stop`);
const gradientAlphaKeys = gradientSuffixes.map(suffix => `Color${suffix}Alpha`);

function clampPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.min(100, Math.max(0, Math.round(number)));
}

function hexToRgb(hex) {
  const match = String(hex || "").match(/^#?([0-9a-f]{6})$/i);
  if (!match) return { r: 145, g: 70, b: 255 };

  const value = match[1];
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  };
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b]
    .map(value => Math.round(value).toString(16).padStart(2, "0"))
    .join("")}`;
}

function rgbToHsv({ r, g, b }) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let h = 0;

  if (delta) {
    if (max === red) h = ((green - blue) / delta) % 6;
    if (max === green) h = (blue - red) / delta + 2;
    if (max === blue) h = (red - green) / delta + 4;
    h *= 60;
  }

  if (h < 0) h += 360;

  return {
    h,
    s: max === 0 ? 0 : delta / max,
    v: max
  };
}

function hsvToRgb({ h, s, v }) {
  const chroma = v * s;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const match = v - chroma;
  let rgb = [0, 0, 0];

  if (h < 60) rgb = [chroma, x, 0];
  else if (h < 120) rgb = [x, chroma, 0];
  else if (h < 180) rgb = [0, chroma, x];
  else if (h < 240) rgb = [0, x, chroma];
  else if (h < 300) rgb = [x, 0, chroma];
  else rgb = [chroma, 0, x];

  return {
    r: (rgb[0] + match) * 255,
    g: (rgb[1] + match) * 255,
    b: (rgb[2] + match) * 255
  };
}

function readGradientStops(pathPrefix) {
  const stops = gradientColorKeys.map((colorKey, index) => {
    const color = readConfig(`${pathPrefix}${colorKey}`);
    const fallbackColor = index === 0
      ? "#9146ff"
      : readConfig(`${pathPrefix}${gradientColorKeys[index - 1]}`) || "#9146ff";

    return {
      slot: index,
      color: color || fallbackColor,
      explicitColor: color || "",
      stop: clampPercent(readConfig(`${pathPrefix}${gradientStopKeys[index]}`)),
      alpha: readConfig(`${pathPrefix}${gradientAlphaKeys[index]}`)
    };
  });

  const explicitStops = stops.filter(stop => stop.explicitColor);
  const visibleStops = explicitStops.filter((stop, index) => {
    if (index < 2) return true;

    const previous = explicitStops[index - 1];
    return !(
      String(stop.color).toLowerCase() === String(previous.color).toLowerCase() &&
      clampPercent(stop.stop) === clampPercent(previous.stop)
    );
  });

  return visibleStops.sort((a, b) => a.stop - b.stop);
}

function writeGradientStops(pathPrefix, stops, options = {}) {
  const sorted = [...stops]
    .slice(0, 10)
    .sort((a, b) => a.stop - b.stop);
  const entries = [];

  for (let index = 0; index < 10; index += 1) {
    const stop = sorted[index];
    const last = sorted[sorted.length - 1] || { color: "#9146ff", stop: 100 };

    entries.push([
      `${pathPrefix}${gradientColorKeys[index]}`,
      stop ? stop.color : ""
    ]);
    entries.push([
      `${pathPrefix}${gradientStopKeys[index]}`,
      stop ? clampPercent(stop.stop) : clampPercent(last.stop)
    ]);
    entries.push([
      `${pathPrefix}${gradientAlphaKeys[index]}`,
      stop?.alpha ?? ""
    ]);
  }

  writeConfigEntries(entries, {
    deferApply: false,
    skipApply: !!options.deferUiSync,
    deferUiSync: !!options.deferUiSync
  });

  if (options.deferUiSync) {
    scheduleTypeStylePreviewRefresh();
  } else {
    if (!flushTypeStylePreviewRefresh()) {
      refreshTypeStylePreview();
    }
  }

  if (!options.deferUiSync) {
    syncControls();
    updateUrlOutput();
  }
}

function getGradientCss(stops) {
  const sorted = [...stops].sort((a, b) => a.stop - b.stop);
  return `linear-gradient(90deg, ${sorted
    .map(stop => `${stop.color} ${clampPercent(stop.stop)}%`)
    .join(", ")})`;
}

function createGradientEditor(group) {
  const details = document.createElement("details");
  details.className = "config-group";
  details.open = false;

  const summary = document.createElement("summary");
  summary.className = "config-control config-group-summary";

  const title = document.createElement("span");
  title.textContent = group.title;
  summary.appendChild(title);

  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.className = "config-reset";
  resetButton.textContent = "Reset";
  resetButton.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    resetControlGroup(group, render);
  });
  summary.appendChild(resetButton);

  const editor = document.createElement("div");
  editor.className = "gradient-editor";

  const pathPrefix = group.pathPrefix;
  let activeSlot = 0;
  let pickerHsv = rgbToHsv(hexToRgb("#9146ff"));

  initialValues.set(`${pathPrefix}Mode`, readConfig(`${pathPrefix}Mode`));
  gradientColorKeys.forEach(key => {
    initialValues.set(`${pathPrefix}${key}`, readConfig(`${pathPrefix}${key}`));
  });
  gradientStopKeys.forEach(key => {
    initialValues.set(`${pathPrefix}${key}`, readConfig(`${pathPrefix}${key}`));
  });
  gradientAlphaKeys.forEach(key => {
    initialValues.set(`${pathPrefix}${key}`, readConfig(`${pathPrefix}${key}`));
  });

  initialValues.set(`${pathPrefix}Angle`, readConfig(`${pathPrefix}Angle`));
  initialValues.set(`${pathPrefix}Opacity`, readConfig(`${pathPrefix}Opacity`));
  if (group.prefix.includes("Border") || group.prefix.includes("Glow")) {
    initialValues.set(`${pathPrefix}Enabled`, readConfig(`${pathPrefix}Enabled`));
  }

  const enabledRow = group.prefix.includes("Border") || group.prefix.includes("Glow")
    ? createControl(["Enabled", `${pathPrefix}Enabled`, "checkbox"])
    : null;

  const angleRow = document.createElement("label");
  angleRow.className = "gradient-tool-row";

  const angleLabel = document.createElement("span");
  angleLabel.textContent = "Angle";

  const angleControl = document.createElement("span");
  angleControl.className = "gradient-angle";

  const angleDial = document.createElement("span");
  angleDial.className = "gradient-angle-dial";

  const angleInput = document.createElement("input");
  angleInput.className = "gradient-angle-input";
  angleInput.type = "number";
  angleInput.min = "0";
  angleInput.max = "360";
  angleInput.step = "1";

  angleControl.append(angleDial, angleInput);
  angleRow.append(angleLabel, angleControl);

  const setAngle = (value, options = {}) => {
    const angleValue = Math.min(360, Math.max(0, Math.round(Number(value) || 0)));

    writeConfig(`${pathPrefix}Angle`, angleValue, {
      deferApply: false,
      skipApply: !!options.deferUiSync,
      deferUiSync: !!options.deferUiSync
    });
    angleInput.value = angleValue;
    angleDial.style.setProperty("--angle", `${angleValue}deg`);
    bar.style.background = getGradientCss(readGradientStops(pathPrefix));
    if (options.deferUiSync) {
      scheduleTypeStylePreviewRefresh();
    } else if (!flushTypeStylePreviewRefresh()) {
      refreshTypeStylePreview();
    }

    if (!options.deferUiSync) {
      updateUrlOutput();
    }
  };

  const updateAngleFromPointer = event => {
    const rect = angleDial.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    const degrees = (Math.atan2(y, x) * 180 / Math.PI + 450) % 360;
    setAngle(degrees, { deferUiSync: true });
  };

  angleDial.addEventListener("pointerdown", event => {
    event.preventDefault();
    if (angleDial.getAttribute("aria-disabled") === "true") return;
    angleDial.setPointerCapture(event.pointerId);
    updateAngleFromPointer(event);

    const move = moveEvent => updateAngleFromPointer(moveEvent);
    const up = () => {
      angleDial.removeEventListener("pointermove", move);
      angleDial.removeEventListener("pointerup", up);
      angleDial.removeEventListener("pointercancel", up);
      flushTypeStylePreviewRefresh();
      window.applyChatConfigToDocument?.();
      updateUrlOutput();
    };

    angleDial.addEventListener("pointermove", move);
    angleDial.addEventListener("pointerup", up);
    angleDial.addEventListener("pointercancel", up);
  });

  angleInput.addEventListener("input", () => {
    setAngle(angleInput.value, { deferUiSync: true });
  });
  angleInput.addEventListener("change", () => {
    setAngle(angleInput.value);
  });

  const opacityRow = document.createElement("label");
  opacityRow.className = "gradient-tool-row";

  const opacityLabel = document.createElement("span");
  opacityLabel.textContent = "Opacity";

  const opacityControl = document.createElement("span");
  opacityControl.className = "gradient-opacity-control";

  const opacityTrack = document.createElement("span");
  opacityTrack.className = "gradient-opacity-track";

  const opacityHandle = document.createElement("span");
  opacityHandle.className = "gradient-opacity-handle";
  opacityTrack.appendChild(opacityHandle);

  const opacityInput = document.createElement("input");
  opacityInput.className = "gradient-opacity-input";
  opacityInput.type = "number";
  opacityInput.min = "0";
  opacityInput.max = "1";
  opacityInput.step = "0.01";

  opacityControl.append(opacityTrack, opacityInput);
  opacityRow.append(opacityLabel, opacityControl);

  const clampUnit = value => {
    const number = Number(value);

    if (!Number.isFinite(number)) return 0;

    return Math.min(1, Math.max(0, number));
  };

  const setOpacity = (value, options = {}) => {
    const opacityValue = clampUnit(value);
    const stops = readGradientStops(pathPrefix);

    if (!stops[activeSlot]) return;

    stops[activeSlot].alpha = opacityValue;
    writeGradientStops(pathPrefix, stops, options);
    opacityInput.value = opacityValue;
    opacityHandle.style.left = `${opacityValue * 100}%`;
    opacityTrack.style.setProperty(
      "--opacity-color",
      stops[activeSlot]?.color || "#8bb8ff"
    );

    if (!options.deferUiSync) {
      updateUrlOutput();
    }
  };

  const updateOpacityFromPointer = (event, options = {}) => {
    const rect = opacityTrack.getBoundingClientRect();
    const nextValue = clampUnit((event.clientX - rect.left) / rect.width);

    setOpacity(nextValue, options);
  };

  opacityTrack.addEventListener("pointerdown", event => {
    event.preventDefault();
    opacityTrack.setPointerCapture(event.pointerId);
    updateOpacityFromPointer(event, { deferUiSync: true });

    const move = moveEvent => {
      updateOpacityFromPointer(moveEvent, { deferUiSync: true });
    };
    const up = () => {
      opacityTrack.removeEventListener("pointermove", move);
      opacityTrack.removeEventListener("pointerup", up);
      opacityTrack.removeEventListener("pointercancel", up);
      flushTypeStylePreviewRefresh();
      window.applyChatConfigToDocument?.();
      updateUrlOutput();
    };

    opacityTrack.addEventListener("pointermove", move);
    opacityTrack.addEventListener("pointerup", up);
    opacityTrack.addEventListener("pointercancel", up);
  });

  opacityInput.addEventListener("input", () => {
    setOpacity(opacityInput.value, { deferUiSync: true });
  });

  opacityInput.addEventListener("change", () => {
    setOpacity(opacityInput.value);
  });

  const modeRow = document.createElement("div");
  modeRow.className = "gradient-mode-row";

  const modeGroup = document.createElement("div");
  modeGroup.className = "gradient-mode";

  const syncAngleDisabledState = () => {
    const isRadial = String(readConfig(`${pathPrefix}Mode`) || "linear").toLowerCase() === "radial";
    angleDial.classList.toggle("disabled", isRadial);
    angleInput.disabled = isRadial;
    angleDial.setAttribute("aria-disabled", isRadial ? "true" : "false");
  };

  ["linear", "radial"].forEach(mode => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
    button.addEventListener("click", () => {
      writeConfig(`${pathPrefix}Mode`, mode);
      syncAngleDisabledState();
      bar.style.background = getGradientCss(readGradientStops(pathPrefix));
      render();
    });
    modeGroup.appendChild(button);
  });

  modeRow.appendChild(modeGroup);

  const bar = document.createElement("div");
  bar.className = "gradient-bar";

  const pickerGrid = document.createElement("div");
  pickerGrid.className = "gradient-picker-grid";

  const pickerColumn = document.createElement("div");
  const pickerLabel = document.createElement("span");
  pickerLabel.className = "gradient-picker-label";
  pickerLabel.textContent = "Picker";

  const colorPlane = document.createElement("div");
  colorPlane.className = "gradient-color-plane";

  const colorCursor = document.createElement("span");
  colorCursor.className = "gradient-picker-cursor";
  colorPlane.appendChild(colorCursor);

  const hue = document.createElement("input");
  hue.className = "gradient-hue";
  hue.type = "range";
  hue.min = "0";
  hue.max = "359";
  hue.step = "1";

  const colorFields = document.createElement("div");
  colorFields.className = "gradient-color-fields";

  const makeColorField = (label, type = "text") => {
    const wrap = document.createElement("label");
    const text = document.createElement("span");
    const input = document.createElement("input");

    text.textContent = label;
    input.type = type;
    wrap.append(text, input);

    return { wrap, input };
  };

  const hexField = makeColorField("Hex");
  const activeColor = document.createElement("input");
  activeColor.type = "color";

  const hexCombo = document.createElement("span");
  hexCombo.className = "gradient-hex-combo";
  hexCombo.append(activeColor, hexField.input);
  hexField.wrap.append(hexCombo);

  const redField = makeColorField("R", "number");
  const greenField = makeColorField("G", "number");
  const blueField = makeColorField("B", "number");

  [redField.input, greenField.input, blueField.input].forEach(input => {
    input.min = "0";
    input.max = "255";
    input.step = "1";
  });

  colorFields.append(
    hexField.wrap,
    redField.wrap,
    greenField.wrap,
    blueField.wrap
  );

  pickerColumn.append(pickerLabel, colorPlane, hue, colorFields, angleRow, opacityRow);

  const stopList = document.createElement("div");
  stopList.className = "gradient-stop-list";
  pickerGrid.append(pickerColumn, stopList);
  let pendingGradientUiSync = false;

  const finishGradientEdit = () => {
    flushTypeStylePreviewRefresh();
    window.applyChatConfigToDocument?.();

    if (!pendingGradientUiSync) return;

    pendingGradientUiSync = false;
    syncControls();
    updateUrlOutput();
  };

  const setActiveStopColor = (color, options = {}) => {
    const stops = readGradientStops(pathPrefix);
    if (!stops[activeSlot]) return stops;

    stops[activeSlot].color = color;
    writeGradientStops(pathPrefix, stops, options);
    pendingGradientUiSync = pendingGradientUiSync || !!options.deferUiSync;
    return stops;
  };

  const updatePickerUi = stop => {
    pickerHsv = rgbToHsv(hexToRgb(stop?.color || "#9146ff"));
    const rgb = hexToRgb(stop?.color || "#9146ff");
    const hueColor = rgbToHex(hsvToRgb({ h: pickerHsv.h, s: 1, v: 1 }));
    colorPlane.style.setProperty("--picker-hue-color", hueColor);
    hue.style.setProperty("--picker-hue-color", hueColor);
    hue.value = Math.round(pickerHsv.h);
    colorCursor.style.left = `${pickerHsv.s * 100}%`;
    colorCursor.style.top = `${(1 - pickerHsv.v) * 100}%`;
    hexField.input.value = stop?.color || "#9146ff";
    activeColor.value = stop?.color || "#9146ff";
    redField.input.value = rgb.r;
    greenField.input.value = rgb.g;
    blueField.input.value = rgb.b;
    opacityTrack.style.setProperty("--opacity-color", stop?.color || "#8bb8ff");
    opacityInput.value = stop?.alpha === "" || stop?.alpha === undefined
      ? readConfig(`${pathPrefix}Opacity`) ?? 1
      : stop.alpha;
    opacityHandle.style.left = `${clampUnit(opacityInput.value) * 100}%`;
  };

  const setActiveStopColorFromFields = () => {
    const color = rgbToHex({
      r: Math.min(255, Math.max(0, Number(redField.input.value) || 0)),
      g: Math.min(255, Math.max(0, Number(greenField.input.value) || 0)),
      b: Math.min(255, Math.max(0, Number(blueField.input.value) || 0))
    });

    setActiveStopColor(color);
    updatePickerUi({ color });
    render();
  };

  hexField.input.addEventListener("change", () => {
    if (!/^#[0-9a-f]{6}$/i.test(hexField.input.value)) {
      updatePickerUi(readGradientStops(pathPrefix)[activeSlot]);
      return;
    }

    setActiveStopColor(hexField.input.value);
    updatePickerUi({ color: hexField.input.value });
    render();
  });

  activeColor.addEventListener("input", () => {
    const stops = setActiveStopColor(activeColor.value, { deferUiSync: true });
    updatePickerUi({ color: activeColor.value });
    bar.style.background = getGradientCss(stops);
  });

  activeColor.addEventListener("change", () => {
    finishGradientEdit();
    render();
  });

  [redField.input, greenField.input, blueField.input].forEach(input => {
    input.addEventListener("change", setActiveStopColorFromFields);
  });

  const updateColorFromPicker = (event, options = {}) => {
    const rect = colorPlane.getBoundingClientRect();
    pickerHsv.s = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    pickerHsv.v = 1 - Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    const color = rgbToHex(hsvToRgb(pickerHsv));

    const stops = setActiveStopColor(color, options);
    updatePickerUi({ color });
    bar.style.background = getGradientCss(stops);
  };

  colorPlane.addEventListener("pointerdown", event => {
    event.preventDefault();
    colorPlane.setPointerCapture(event.pointerId);
    updateColorFromPicker(event, { deferUiSync: true });

    const move = moveEvent => updateColorFromPicker(moveEvent, { deferUiSync: true });
    const up = () => {
      colorPlane.removeEventListener("pointermove", move);
      colorPlane.removeEventListener("pointerup", up);
      colorPlane.removeEventListener("pointercancel", up);
      finishGradientEdit();
      render();
    };

    colorPlane.addEventListener("pointermove", move);
    colorPlane.addEventListener("pointerup", up);
    colorPlane.addEventListener("pointercancel", up);
  });

  hue.addEventListener("input", () => {
    pickerHsv.h = Number(hue.value);
    const color = rgbToHex(hsvToRgb(pickerHsv));

    const stops = setActiveStopColor(color, { deferUiSync: true });
    updatePickerUi({ color });
    bar.style.background = getGradientCss(stops);
  });

  hue.addEventListener("change", () => {
    finishGradientEdit();
    render();
  });

  const render = () => {
    const stops = readGradientStops(pathPrefix);
    activeSlot = Math.min(activeSlot, stops.length - 1);
    if (activeSlot < 0) activeSlot = 0;

    bar.style.background = getGradientCss(stops);
    bar.replaceChildren();
    stopList.replaceChildren();
    updatePickerUi(stops[activeSlot]);
    angleInput.value = readConfig(`${pathPrefix}Angle`) ?? 0;
    angleDial.style.setProperty("--angle", `${angleInput.value}deg`);
    syncAngleDisabledState();

    [...modeGroup.children].forEach(button => {
      button.classList.toggle(
        "active",
        button.textContent.toLowerCase() === String(readConfig(`${pathPrefix}Mode`) || "linear")
      );
    });

    stops.forEach((stop, index) => {
      const handle = document.createElement("button");
      handle.type = "button";
      handle.className = `gradient-stop${index === activeSlot ? " active" : ""}`;
      handle.style.left = `${clampPercent(stop.stop)}%`;
      handle.style.setProperty("--stop-color", stop.color);
      handle.setAttribute("aria-label", `Gradient stop ${index + 1}`);
      handle.addEventListener("pointerdown", event => {
        event.preventDefault();
        activeSlot = index;
        handle.setPointerCapture(event.pointerId);

        const move = moveEvent => {
          const rect = bar.getBoundingClientRect();
          const nextStops = readGradientStops(pathPrefix);
          nextStops[index].stop = clampPercent(
            ((moveEvent.clientX - rect.left) / rect.width) * 100
          );
          writeGradientStops(pathPrefix, nextStops, { deferUiSync: true });
          pendingGradientUiSync = true;
          activeSlot = index;
          handle.style.left = `${nextStops[index].stop}%`;
          bar.style.background = getGradientCss(nextStops);
        };

        const up = () => {
          handle.removeEventListener("pointermove", move);
          handle.removeEventListener("pointerup", up);
          handle.removeEventListener("pointercancel", up);
          finishGradientEdit();
          render();
        };

        handle.addEventListener("pointermove", move);
        handle.addEventListener("pointerup", up);
        handle.addEventListener("pointercancel", up);
      });
      handle.addEventListener("click", event => {
        event.stopPropagation();
        activeSlot = index;
        updatePickerUi(stop);
        render();
      });
      bar.appendChild(handle);

      const row = document.createElement("div");
      row.className = "gradient-stop-row";
      row.classList.toggle("active", index === activeSlot);

      const color = document.createElement("input");
      color.type = "color";
      color.value = stop.color;
      color.addEventListener("focus", () => {
        activeSlot = index;
        updatePickerUi(stop);
        render();
      });
      color.addEventListener("input", () => {
        const nextStops = readGradientStops(pathPrefix);
        nextStops[index].color = color.value;
        writeGradientStops(pathPrefix, nextStops, { deferUiSync: true });
        pendingGradientUiSync = true;
        activeSlot = index;
        bar.style.background = getGradientCss(nextStops);
      });

      color.addEventListener("change", () => {
        finishGradientEdit();
        render();
      });

      const hex = document.createElement("input");
      hex.type = "text";
      hex.value = stop.color;
      hex.addEventListener("focus", () => {
        activeSlot = index;
        updatePickerUi(stop);
        render();
      });
      hex.addEventListener("change", () => {
        if (!/^#[0-9a-f]{6}$/i.test(hex.value)) {
          hex.value = stop.color;
          return;
        }
        const nextStops = readGradientStops(pathPrefix);
        nextStops[index].color = hex.value;
        writeGradientStops(pathPrefix, nextStops);
        activeSlot = index;
        render();
      });

      const position = document.createElement("input");
      position.type = "number";
      position.min = "0";
      position.max = "100";
      position.step = "1";
      position.value = stop.stop;
      position.addEventListener("focus", () => {
        activeSlot = index;
        updatePickerUi(stop);
        render();
      });
      position.addEventListener("input", () => {
        const nextStops = readGradientStops(pathPrefix);
        nextStops[index].stop = clampPercent(position.value);
        writeGradientStops(pathPrefix, nextStops, { deferUiSync: true });
        pendingGradientUiSync = true;
        activeSlot = index;
        bar.style.background = getGradientCss(nextStops);
      });

      position.addEventListener("change", () => {
        finishGradientEdit();
        render();
      });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "gradient-remove";
      remove.textContent = "x";
      remove.disabled = stops.length <= 2;
      remove.addEventListener("click", () => {
        const nextStops = readGradientStops(pathPrefix);
        nextStops.splice(index, 1);
        activeSlot = Math.max(0, index - 1);
        writeGradientStops(pathPrefix, nextStops);
        render();
      });

      row.append(color, hex, position, remove);
      row.addEventListener("click", event => {
        if (event.target !== row) return;
        activeSlot = index;
        updatePickerUi(stop);
        render();
      });
      stopList.appendChild(row);
    });
  };

  bar.addEventListener("click", event => {
    if (event.target !== bar) return;

    const stops = readGradientStops(pathPrefix);
    if (stops.length >= 10) return;

    const rect = bar.getBoundingClientRect();
    const stop = clampPercent(((event.clientX - rect.left) / rect.width) * 100);
    const nearest = [...stops].sort(
      (a, b) => Math.abs(a.stop - stop) - Math.abs(b.stop - stop)
    )[0];

    stops.push({
      color: nearest?.color || "#9146ff",
      stop
    });
    activeSlot = stops.length - 1;
    writeGradientStops(pathPrefix, stops);
    render();
  });

  render();
  editor.append(...[enabledRow, bar, modeRow, pickerGrid].filter(Boolean));
  details.append(summary, editor);
  return details;
}

function createControlGroup(group) {
  if (group.kind === "gradient") {
    return createGradientEditor(group);
  }

  if (group.kind === "url") {
    return createUrlEditor(group);
  }

  const details = document.createElement("details");
  details.className = "config-group";

  const summary = document.createElement("summary");
  summary.className = "config-control config-group-summary";
  if (group.path) {
    summary.dataset.path = group.path;
  }
  if (group.preset) {
    summary.dataset.presetMode = group.preset;
  }

  const text = document.createElement("span");
  text.textContent = group.title;
  summary.appendChild(text);

  const paths = collectControlPaths(group);
  const canResetSection = paths.some(path => String(path).startsWith("style.typeStyles."));

  if (canResetSection) {
    const resetButton = document.createElement("button");
    resetButton.type = "button";
    resetButton.className = "config-reset";
    resetButton.textContent = "Reset";
    resetButton.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      resetControlGroup(group);
    });
    summary.appendChild(resetButton);
  }

  if (group.preset) {
    const input = document.createElement("input");
    input.type = group.type || "checkbox";
    input.checked = getActiveStylePreset() === group.preset;
    if (group.path) {
      initialValues.set(group.path, readConfig(group.path));
    }
    input.addEventListener("click", event => event.stopPropagation());
    input.addEventListener("input", () => {
      if (input.checked) {
        applyStylePreset(group.preset);
      } else if (getActiveStylePreset() === group.preset) {
        applyStylePreset("default");
      } else {
        syncControls();
      }
    });
    summary.appendChild(input);
  } else if (group.path) {
    const input = document.createElement("input");
    input.type = group.type || "checkbox";
    input.checked = !!readConfig(group.path);
    initialValues.set(group.path, readConfig(group.path));
    input.addEventListener("click", event => event.stopPropagation());
    input.addEventListener("input", () => {
      writeConfig(group.path, input.checked);
    });
    summary.appendChild(input);
  }

  const controls = document.createElement("div");
  controls.className = "config-group-controls";

  if (group.description) {
    const description = document.createElement("p");
    description.className = "config-group-description";
    description.textContent = group.description;
    controls.appendChild(description);
  }

  if (group.actions) {
    const actions = document.createElement("div");
    actions.className = "config-actions";

    group.actions.forEach(([label, preset]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.addEventListener("click", () => {
        applyStylePreset(preset);
      });
      actions.appendChild(button);
    });

    controls.appendChild(actions);
  }

  (group.controls || []).forEach(control => {
    controls.appendChild(
      Array.isArray(control)
        ? createControl(control)
        : createControlGroup(control)
    );
  });

  details.append(summary, controls);
  return details;
}

const typeStyleEditorState = {
  group: "",
  type: "",
  label: "",
  sectionTitle: "",
  previewBg: "checker",
  previewBgColor: "#080810"
};

const testAreaSurfaceState = {
  mode: "checker",
  color: "#080810"
};

function isHexColor(value) {
  return /^#[0-9a-f]{6}$/i.test(String(value || ""));
}

function applySurfacePickerState(root, state) {
  root?.querySelectorAll("[data-surface-mode]").forEach(button => {
    button.classList.toggle("active", button.dataset.surfaceMode === state.mode);
  });

  const colorInput = root?.querySelector("[data-surface-color]");
  if (colorInput && isHexColor(state.color)) {
    colorInput.value = state.color;
  }
}

function setTypeStylePreviewBackground(mode, color = typeStyleEditorState.previewBgColor) {
  const preview = document.getElementById("typeStyleModalPreview");
  const nextMode = mode === "color" ? "color" : "checker";
  const nextColor = isHexColor(color) ? color : "#080810";
  typeStyleEditorState.previewBg = nextMode;
  typeStyleEditorState.previewBgColor = nextColor;

  preview?.classList.toggle("preview-surface-checker", nextMode === "checker");
  preview?.style.setProperty("--type-preview-bg", nextMode === "color" ? nextColor : "");
  preview?.style.setProperty("--type-preview-bg-position", "");
  preview?.style.setProperty("--type-preview-bg-size", "");
  applySurfacePickerState(
    document.querySelector("[data-surface-picker='type-preview']"),
    { mode: nextMode, color: nextColor }
  );
}

function setTestAreaSurface(mode, color = testAreaSurfaceState.color) {
  const pane = document.querySelector(".preview-pane");
  const nextMode = mode === "color" ? "color" : "checker";
  const nextColor = isHexColor(color) ? color : "#080810";
  testAreaSurfaceState.mode = nextMode;
  testAreaSurfaceState.color = nextColor;

  pane?.classList.toggle("preview-surface-checker", nextMode === "checker");
  pane?.style.setProperty("--test-area-bg", nextMode === "color" ? nextColor : "");
  pane?.style.setProperty("--test-area-bg-position", "");
  pane?.style.setProperty("--test-area-bg-size", "");
  applySurfacePickerState(
    document.querySelector("[data-surface-picker='test-area']"),
    { mode: nextMode, color: nextColor }
  );
}

function buildSurfacePicker(scope, label, state, onChange) {
  const root = document.createElement("div");
  root.className = "surface-picker";
  root.dataset.surfacePicker = scope;
  root.setAttribute("aria-label", label);

  ["checker", "color"].forEach(mode => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.surfaceMode = mode;
    button.textContent = mode === "checker" ? "Checker" : "Colour";
    button.addEventListener("click", () => onChange(mode, state.color));
    root.appendChild(button);
  });

  const colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.value = state.color;
  colorInput.dataset.surfaceColor = "";
  colorInput.setAttribute("aria-label", `${label} colour`);
  colorInput.addEventListener("input", () => onChange("color", colorInput.value));
  root.appendChild(colorInput);

  applySurfacePickerState(root, state);
  return root;
}

function getTypeStylePreviewPlatform(group, type = "") {
  if (group === "youtube") return "YouTube";
  if (group === "tiktok") return "TikTok";
  if (group === "kick") return "Kick";
  if (group === "special") return "Twitch";
  if (group === "donations") {
    return donationPreviewPlatforms[type] || donationTypeOptions[0][0];
  }
  return "Twitch";
}

function getAnnouncementPreviewDetails(type) {
  const variants = {
    announcementsDefault: ["default", "twitch.announcements.default"],
    announcementsBlue: ["blue", "twitch.announcements.blue"],
    announcementsGreen: ["green", "twitch.announcements.green"],
    announcementsOrange: ["orange", "twitch.announcements.orange"],
    announcementsPurple: ["purple", "twitch.announcements.purple"],
    announcementsPrimary: ["primary", "twitch.announcements.primary"]
  };

  return variants[type] || ["primary", "twitch.announcements.primary"];
}

function getTypeStylePreviewItem(group, type, label) {
  if (group === GLOBAL_TYPE_STYLE_GROUP) {
    return {
      kind: "chat",
      platform: "Twitch",
      user: "GlobalStylePig",
      text: "Global chat and alert styling preview"
    };
  }

  const platform = getTypeStylePreviewPlatform(group, type);

  if (type === "chat") {
    return {
      kind: "chat",
      platform,
      user: platform === "TikTok" ? "TikTok Chat Pig" : `${platform} Chat Pig`,
      text: "Preview chat message"
    };
  }

  if (group === "special" && type === "rainbow") {
    return {
      kind: "chat",
      platform,
      user: "Rainbow Chat Pig",
      text: "Preview rainbow chat message",
      special: "highlight",
      styleType: "rainbow"
    };
  }

  if (group === "tiktok" && type === "gifts") {
    return {
      kind: "tiktokGift",
      platform: "TikTok",
      alertType: "tiktok.gifts",
      user: "GiftPig",
      giftName: "Rose",
      count: 7
    };
  }

  if (group === "donations") {
    return {
      kind: "alert",
      platform,
      alertType: `donations.${type}`,
      user: label,
      text: "Donation alert preview"
    };
  }

  if (group === "twitch" && type.startsWith("announcements")) {
    const [variant, alertType] = getAnnouncementPreviewDetails(type);
    return {
      kind: "alert",
      platform,
      alertType,
      special: `announcement-${variant}`,
      user: label,
      text: "Twitch announcement preview"
    };
  }

  return {
    kind: "alert",
    platform,
    alertType: `${group}.${type}`,
    user: label,
    text: `${label} alert preview`
  };
}

function getGlobalTypeStylePreviewItems() {
  return [
    {
      kind: "chat",
      platform: "Twitch",
      user: "TwitchPig",
      text: "Global chat message preview"
    },
    {
      kind: "chat",
      platform: "YouTube",
      user: "YouTubePig",
      text: "YouTube chat uses the same global type style"
    },
    {
      kind: "alert",
      platform: "TikTok",
      alertType: "tiktok.subscribers",
      user: "TikTok Subscriber Pig",
      text: "Global alert card preview"
    },
    {
      kind: "tiktokGift",
      platform: "TikTok",
      alertType: "tiktok.gifts",
      user: "GiftPig",
      giftName: "Rose",
      count: 7
    },
    {
      kind: "alert",
      platform: "Streamlabs",
      alertType: "donations.streamlabs",
      user: "StreamlabsDonor",
      text: "Donation alert preview"
    },
    {
      kind: "chat",
      platform: "Twitch",
      user: "RainbowPig",
      text: "Special/rainbow message preview",
      special: "highlight",
      styleType: "rainbow"
    }
  ];
}

function makePreviewAvatar() {
  const avatar = document.createElement("div");
  avatar.className = "avatar preview-avatar";
  return avatar;
}

function makePreviewNameBubble(item) {
  const nameBubble = document.createElement("div");
  nameBubble.className = "name-bubble";

  const glow = document.createElement("span");
  glow.className = "bubble-glow title-glow-layer";
  glow.setAttribute("aria-hidden", "true");

  const badges = document.createElement("span");
  badges.className = "badges";

  const badge = document.createElement("span");
  badge.className = "badge-text";
  badge.textContent = item.kind === "alert" ? "ALERT" : "VIP";
  badges.appendChild(badge);

  const name = document.createElement("span");
  name.className = "name";
  name.textContent = item.user;

  const icon = document.createElement("img");
  icon.className = "platform-icon";
  icon.alt = "";
  icon.src = window.getPlatformIcon?.(item.platform) || "";

  nameBubble.append(glow, badges, name);
  if (icon.src) {
    nameBubble.appendChild(icon);
  }
  return nameBubble;
}

function createTypeStylePreviewElement(item) {
  const el = document.createElement("div");
  el.className = `msg platform-${String(item.platform).toLowerCase()}`;
  el.dataset.kind = item.kind;
  el.dataset.platform = item.platform;
  el.dataset.alertType = item.alertType || "";
  el.dataset.styleType = item.styleType || "";

  if (item.kind === "alert") {
    el.classList.add("alert");
  }

  if (item.special) {
    el.classList.add(`special-${item.special}`);
  }

  if (item.kind === "tiktokGift") {
    el.className = "msg tiktok-gift platform-tiktok gift-tier-2";
    el.dataset.kind = "tiktokGift";
    el.dataset.platform = "TikTok";
    el.dataset.alertType = item.alertType;

    const avatarWrap = document.createElement("div");
    avatarWrap.className = "avatar-wrap";
    avatarWrap.appendChild(makePreviewAvatar());

    const card = document.createElement("div");
    card.className = "tiktok-gift-card";

    const glow = document.createElement("span");
    glow.className = "bubble-glow gift-glow-layer";
    glow.setAttribute("aria-hidden", "true");

    const info = document.createElement("div");
    info.className = "tiktok-gift-info";

    const user = document.createElement("div");
    user.className = "tiktok-gift-user";
    user.textContent = item.user;

    const text = document.createElement("div");
    text.className = "tiktok-gift-text";
    text.textContent = `sent ${item.giftName}`;

    const count = document.createElement("div");
    count.className = "tiktok-gift-count";
    count.textContent = `x${item.count}`;

    info.append(user, text);
    card.append(glow, info, count);
    el.append(avatarWrap, card);
  } else {
    const avatarWrap = document.createElement("div");
    avatarWrap.className = "avatar-wrap";
    avatarWrap.appendChild(makePreviewAvatar());

    const stack = document.createElement("div");
    stack.className = "bubble-stack";

    if (item.kind === "alert") {
      const glow = document.createElement("span");
      glow.className = "bubble-glow alert-glow-layer";
      glow.setAttribute("aria-hidden", "true");
      stack.appendChild(glow);
    }

    const messageBubble = document.createElement("div");
    messageBubble.className = "message-bubble";

    const messageGlow = document.createElement("span");
    messageGlow.className = "bubble-glow message-glow-layer";
    messageGlow.setAttribute("aria-hidden", "true");

    const messageText = document.createElement("span");
    messageText.className = "text";
    messageText.textContent = item.text;

    messageBubble.append(messageGlow, messageText);
    stack.append(makePreviewNameBubble(item), messageBubble);
    el.append(avatarWrap, stack);
  }

  window.applyPreviewPlatformVariables?.(el, item.platform, item);
  return el;
}

function buildTypeStylePreview() {
  const preview = document.getElementById("typeStyleModalPreview");
  if (!preview || !typeStyleEditorState.group) return;

  const items = typeStyleEditorState.group === GLOBAL_TYPE_STYLE_GROUP
    ? getGlobalTypeStylePreviewItems()
    : [
        getTypeStylePreviewItem(
          typeStyleEditorState.group,
          typeStyleEditorState.type,
          typeStyleEditorState.label
        )
      ];

  preview.replaceChildren(...items.map(createTypeStylePreviewElement));
}

function refreshTypeStylePreview() {
  if (!typeStyleEditorState.group) return;

  if (typeStyleEditorState.group === GLOBAL_TYPE_STYLE_GROUP) {
    buildTypeStylePreview();
    return;
  }

  const preview = document.getElementById("typeStyleModalPreview");
  const el = preview?.querySelector(".msg");

  if (!el) {
    buildTypeStylePreview();
    return;
  }

  const item = getTypeStylePreviewItem(
    typeStyleEditorState.group,
    typeStyleEditorState.type,
    typeStyleEditorState.label
  );

  el.className = `msg platform-${String(item.platform).toLowerCase()}`;
  if (item.kind === "alert") el.classList.add("alert");
  if (item.kind === "tiktokGift") el.className = "msg tiktok-gift platform-tiktok gift-tier-2";
  if (item.special) el.classList.add(`special-${item.special}`);
  el.dataset.kind = item.kind;
  el.dataset.platform = item.platform;
  el.dataset.alertType = item.alertType || "";
  el.dataset.styleType = item.styleType || "";

  const name = el.querySelector(".name");
  if (name) name.textContent = item.user || item.label || typeStyleEditorState.label;

  const text = el.querySelector(".text");
  if (text) text.textContent = item.text || "";

  const icon = el.querySelector(".platform-icon");
  if (icon) icon.src = window.getPlatformIcon?.(item.platform) || "";

  window.applyPreviewPlatformVariables?.(el, item.platform, item);
}

function openTypeStyleEditor({ group, type, label, sectionTitle }) {
  typeStyleEditorState.group = group;
  typeStyleEditorState.type = type;
  typeStyleEditorState.label = label;
  typeStyleEditorState.sectionTitle = sectionTitle;

  const modal = document.getElementById("typeStyleModal");
  const title = document.getElementById("typeStyleModalTitle");
  const controls = document.getElementById("typeStyleModalControls");

  title.textContent =
    group === GLOBAL_TYPE_STYLE_GROUP
      ? "Global Type Styling"
      : `${sectionTitle}: ${label}`;
  controls.replaceChildren();

  getTypeStyleControls(group, type)
    .map(control => mapTypeStyleControl(control, group, type))
    .forEach(control => {
      controls.appendChild(
        Array.isArray(control)
          ? createControl(control)
          : createControlGroup(control)
      );
    });

  buildTypeStylePreview();
  syncControls();
  modal.hidden = false;
}

function closeTypeStyleEditor() {
  document.getElementById("typeStyleModal").hidden = true;
  typeStyleEditorState.group = "";
  typeStyleEditorState.type = "";
  typeStyleEditorState.label = "";
  typeStyleEditorState.sectionTitle = "";
  setTypeStylePreviewBackground(typeStyleEditorState.previewBg, typeStyleEditorState.previewBgColor);
}

function buildTypeStyleButtonGrid(section) {
  const grid = document.createElement("div");
  grid.className = "type-style-button-grid";

  section.typeStyleButtons.forEach(buttonConfig => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "type-style-edit-button";
    button.textContent = buttonConfig.label;
    button.addEventListener("click", () => openTypeStyleEditor(buttonConfig));
    grid.appendChild(button);
  });

  return grid;
}

function createUrlTools() {
  const tools = document.createElement("div");
  tools.className = "url-tools";

  const status = document.createElement("div");
  status.className = "url-import-status";
  status.setAttribute("aria-live", "polite");

  const outputLabel = document.createElement("label");
  outputLabel.textContent = "Generated URL";

  const output = document.createElement("input");
  output.className = "url-output";
  output.type = "text";
  output.readOnly = true;
  output.dataset.urlOutput = "";
  output.addEventListener("click", () => copyUrlOutput(output, status));
  outputLabel.appendChild(output);

  const dockOutputLabel = document.createElement("label");
  dockOutputLabel.textContent = "OBS Dock URL";

  const dockOutput = document.createElement("input");
  dockOutput.className = "url-output";
  dockOutput.type = "text";
  dockOutput.readOnly = true;
  dockOutput.dataset.obsDockUrlOutput = "";
  dockOutput.addEventListener("click", () => copyUrlOutput(dockOutput, status));
  dockOutputLabel.appendChild(dockOutput);

  const importLabel = document.createElement("label");
  importLabel.textContent = "Paste URL";

  const importRow = document.createElement("div");
  importRow.className = "url-import-row";

  const importInput = document.createElement("input");
  importInput.className = "url-import-input";
  importInput.type = "text";
  importInput.placeholder = "Paste a previously generated overlay URL";

  const importButton = document.createElement("button");
  importButton.className = "url-import-button";
  importButton.type = "button";
  importButton.textContent = "Apply";

  const applyImport = () => importConfigFromUrl(importInput.value, status);
  importButton.addEventListener("click", applyImport);
  importInput.addEventListener("keydown", event => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    applyImport();
  });
  importInput.addEventListener("paste", () => {
    requestAnimationFrame(() => {
      if (importInput.value.trim()) {
        applyImport();
      }
    });
  });

  importRow.append(importInput, importButton);
  importLabel.appendChild(importRow);
  tools.append(outputLabel, dockOutputLabel, importLabel, status);

  return tools;
}

function createUrlEditor(group) {
  const details = document.createElement("details");
  details.className = "config-group";
  details.open = true;

  const summary = document.createElement("summary");
  summary.className = "config-control config-group-summary";

  const text = document.createElement("span");
  text.textContent = group.title;
  summary.appendChild(text);

  const controls = document.createElement("div");
  controls.className = "config-group-controls";

  if (group.description) {
    const description = document.createElement("p");
    description.className = "config-group-description";
    description.textContent = group.description;
    controls.appendChild(description);
  }

  const tools = createUrlTools();
  controls.appendChild(tools);
  details.append(summary, controls);

  return details;
}

function buildUrlQuickControls() {
  const root = document.getElementById("urlQuickControls");
  if (!root) return;

  root.appendChild(createUrlTools());
}

async function copyUrlOutput(input, statusEl = null) {
  const value = String(input?.value || "");
  if (!value) return;

  input.focus();
  input.select();

  try {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
    } else {
      document.execCommand("copy");
    }

    if (statusEl) {
      statusEl.textContent = "Copied URL to clipboard.";
      statusEl.classList.remove("error");
    }
  } catch {
    if (statusEl) {
      statusEl.textContent = "Could not copy automatically. The URL is selected.";
      statusEl.classList.add("error");
    }
  }
}

function buildPanel() {
  const root = document.getElementById("configControls");

  controlSections.forEach(section => {
    const sectionEl = document.createElement("section");
    sectionEl.className = "config-section";

    const title = document.createElement("h2");
    title.textContent = section.title;
    sectionEl.appendChild(title);

    if (section.description) {
      const description = document.createElement("p");
      description.className = "config-description";
      description.textContent = section.description;
      sectionEl.appendChild(description);
    }

    if (section.actions) {
      const actions = document.createElement("div");
      actions.className = "config-actions";

      section.actions.forEach(([label, preset]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.addEventListener("click", () => {
          applyStylePreset(preset);
        });
        actions.appendChild(button);
      });

      sectionEl.appendChild(actions);
    }

    if (section.typeStyleButtons) {
      sectionEl.appendChild(buildTypeStyleButtonGrid(section));
    }

    section.controls?.forEach(control => {
      sectionEl.appendChild(
        Array.isArray(control)
          ? createControl(control)
          : createControlGroup(control)
      );
    });

    root.appendChild(sectionEl);
  });

  updateUrlOutput();
}

function updateUrlOutput() {
  const changedValues = new Map();
  const activePreset = getActiveStylePreset();
  const currentConfig = window.getChatConfigSnapshot?.() || {};
  const baselineConfig =
    activePreset && activePreset !== "default"
      ? window.getChatPresetConfigSnapshot?.(activePreset)
      : window.getChatDefaultConfigSnapshot?.();
  const baseline = baselineConfig || {};

  flattenConfig(currentConfig).forEach(([path, current]) => {
    if (!isAllowedImportedUrlConfigPath(path)) return;
    if (shouldSkipGeneratedConfigPath(path)) return;

    const baselineValue = getValueAtPath(baseline, path);

    if (String(current) === String(baselineValue)) return;

    changedValues.set(path, current);
  });

  const overlayParams = new URLSearchParams();
  const dockParams = new URLSearchParams();

  if (activePreset && activePreset !== "default") {
    overlayParams.set("preset", activePreset);
    dockParams.set("preset", activePreset);
  }

  changedValues.forEach((current, path) => {
    if (shouldOmitGeneratedUrlParam(path, changedValues)) return;

    const paramName = getUrlParamName(path);
    const paramValue = formatGeneratedUrlValue(current);

    if (!isScrollTestConfigPath(path)) {
      overlayParams.set(paramName, paramValue);
    }

    dockParams.set(paramName, paramValue);
  });

  const url = getOverlayUrl();
  applyGeneratedParamsToUrl(url, overlayParams);
  document.querySelectorAll("[data-url-output]").forEach(output => {
    output.value = serializeOverlayUrl(url);
  });

  const dockUrl = getObsDockUrl(dockParams);
  document.querySelectorAll("[data-obs-dock-url-output]").forEach(output => {
    output.value = serializeOverlayUrl(dockUrl);
  });
}

function applyGeneratedParamsToUrl(url, params) {
  const raw = params.toString();

  if (raw.length < 1800) {
    url.search = raw;
    url.hash = "";
    return;
  }

  url.search = "";
  url.hash = raw;
}

function flattenConfig(value, prefix = "", output = []) {
  if (value === undefined || typeof value === "function") return output;

  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    if (prefix) output.push([prefix, value]);
    return output;
  }

  Object.entries(value).forEach(([key, child]) => {
    flattenConfig(child, prefix ? `${prefix}.${key}` : key, output);
  });

  return output;
}

function getValueAtPath(target, path) {
  return String(path || "")
    .split(".")
    .filter(Boolean)
    .reduce((value, key) => value?.[key], target);
}

function shouldSkipGeneratedConfigPath(path) {
  return [
    "streamerbot.connected",
    "tikfinity.connected"
  ].includes(String(path || ""));
}

function isScrollTestConfigPath(path) {
  return String(path || "").startsWith("scrollTest.");
}

function getObsDockUrl(baseParams) {
  const params = new URLSearchParams(baseParams);

  params.set("dock", "true");
  params.set("autoScroll", "true");
  params.set("removeAfter", "0");
  params.set("max", "0");
  params.set("twitchStream", "true");
  params.set("twitchModeration", "true");
  params.set("twitchSystem", "true");
  params.set("youtubeStream", "true");
  params.set("youtubeModeration", "true");
  params.set("youtubeSystem", "true");
  params.set("kickStream", "true");
  params.set("kickModeration", "true");
  params.set("kickSystem", "true");
  params.set("tiktokJoins", "true");
  params.set("tiktokBattles", "true");
  params.set("tiktokStream", "true");
  params.set("tiktokSystem", "true");

  const url = getOverlayUrl();
  applyGeneratedParamsToUrl(url, params);

  return url;
}

function formatGeneratedUrlValue(value) {
  if (typeof value === "boolean") return value ? "1" : "0";
  return value;
}

function shouldOmitGeneratedUrlParam(path, changedValues) {
  const value = String(path || "");
  const chatSource = value.match(/^behaviour\.chat\.(twitch|youtube|tiktok|kick)$/);

  if (chatSource && changedValues.has(`behaviour.sources.${chatSource[1]}`)) {
    return true;
  }

  const alertSource = value.match(/^behaviour\.alerts\.(twitch|youtube|tiktok)\.(enabled|[^.]+)$/);

  if (alertSource && changedValues.has(`behaviour.sources.${alertSource[1]}`)) {
    return true;
  }

  if (
    alertSource &&
    alertSource[2] !== "enabled" &&
    changedValues.has(`behaviour.alerts.${alertSource[1]}.enabled`)
  ) {
    return true;
  }

  return false;
}

function serializeOverlayUrl(url) {
  const serialized = url.toString();

  if (url.protocol !== "file:") return serialized;

  return serialized.replace(/^file:\/\/\/([A-Za-z])%3A/i, "file:///$1:");
}

function parseImportUrl(value) {
  const text = String(value || "").trim();
  if (!text) return null;

  const base = getOverlayUrl();

  if (text.startsWith("?")) {
    base.search = text;
    base.hash = "";
    return base;
  }

  return new URL(text, base);
}

function importConfigFromUrl(value, statusEl = null) {
  const setStatus = (message, isError = false) => {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.toggle("error", !!isError);
  };

  let url;

  try {
    url = parseImportUrl(value);
  } catch {
    setStatus("That does not look like a valid URL.", true);
    return;
  }

  if (!url || !url.searchParams.size) {
    setStatus("No config parameters found in that URL.", true);
    return;
  }

  const entries = [];
  let requestedStylePreset = "";
  let ignored = 0;

  url.searchParams.forEach((rawValue, rawKey) => {
    if (rawKey === "preset" || rawKey === "stylePreset") {
      requestedStylePreset = String(rawValue || "");
      return;
    }

    const path = resolveImportedUrlConfigPath(rawKey);

    if (!isAllowedImportedUrlConfigPath(path)) {
      ignored += 1;
      return;
    }

    const parsedValue = parseImportedUrlConfigValue(rawValue, path);

    if (path === "style.stealthMode" && parsedValue) {
      requestedStylePreset = "stealth";
      return;
    }

    if (path === "style.minimalStyle" && parsedValue) {
      requestedStylePreset = "minimal";
      return;
    }

    entries.push([path, parsedValue]);
  });

  const baselineEntries = [...initialValues.entries()]
    .filter(([, initial]) => initial !== undefined)
    .map(([path, initial]) => [path, initial]);

  window.setChatConfigValues?.(baselineEntries, { deferApply: true });

  if (requestedStylePreset) {
    window.applyChatStylePreset?.(requestedStylePreset);
    setActiveStylePresetMode(requestedStylePreset);
  }

  entries.forEach(([path, parsedValue]) => {
    window.setChatConfigValue?.(path, parsedValue, { deferApply: true });
  });

  window.applyChatConfigToDocument?.();
  syncControls();
  refreshTypeStylePreview();
  updateUrlOutput();

  const appliedCount = entries.length + (requestedStylePreset ? 1 : 0);
  setStatus(`Applied ${appliedCount} setting${appliedCount === 1 ? "" : "s"}${ignored ? `, ignored ${ignored}` : ""}.`);
}

function getOverlayUrl() {
  const url = new URL(window.location.href);
  const path = url.pathname;
  const withoutTrailingSlash = path.replace(/\/+$/, "");

  if (/\/(?:settings|config)(?:\/index\.html)?$/i.test(withoutTrailingSlash)) {
    url.pathname = `${withoutTrailingSlash.replace(/\/(?:settings|config)$/i, "") || "/"}`;
    url.pathname = `${url.pathname.replace(/\/(?:settings|config)\/index\.html$/i, "") || "/"}`;
    if (!url.pathname.endsWith("/")) {
      url.pathname += "/";
    }
    return url;
  }

  if (/\/[^/]+\.html$/i.test(path)) {
    url.pathname = path.replace(/[^/]+\.html$/i, "index.html");
  }

  return url;
}

function buildAutoscrollQuickControls() {
  const root = document.getElementById("autoscrollQuickControls");
  if (!root) return;

  const row = document.createElement("div");
  row.className = "autoscroll-control-row";

  [
    ["Enabled", "scrollTest.enabled", "checkbox"],
    ["Auto Scroll", "scrollTest.autoScroll", "checkbox"],
    ["Interval", "scrollTest.intervalMs", "number", { min: 200, max: 10000, step: 100 }]
  ].forEach(control => {
    row.appendChild(createControl(control));
  });

  const restartButton = document.createElement("button");
  restartButton.type = "button";
  restartButton.textContent = "Restart";
  restartButton.addEventListener("click", () => {
    window.restartScrollTestMessages?.();
  });

  const stopButton = document.createElement("button");
  stopButton.type = "button";
  stopButton.textContent = "Stop";
  stopButton.addEventListener("click", () => {
    window.stopScrollTestMessages?.("Manual stop");
  });

  row.append(
    buildSurfacePicker("test-area", "Test area background", testAreaSurfaceState, setTestAreaSurface),
    restartButton,
    stopButton
  );

  root.appendChild(row);
}

document.getElementById("typeStyleModalClose")?.addEventListener("click", closeTypeStyleEditor);
document.getElementById("typeStyleModal")?.addEventListener("click", event => {
  if (event.target.id === "typeStyleModal") {
    closeTypeStyleEditor();
  }
});
document.querySelector("[data-surface-picker='type-preview']")?.querySelectorAll("[data-surface-mode]").forEach(button => {
  button.addEventListener("click", () => {
    setTypeStylePreviewBackground(button.dataset.surfaceMode);
  });
});
document.querySelector("[data-surface-picker='type-preview']")?.querySelector("[data-surface-color]")?.addEventListener("input", event => {
  setTypeStylePreviewBackground("color", event.target.value);
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !document.getElementById("typeStyleModal")?.hidden) {
    closeTypeStyleEditor();
  }
  if (event.key === "Escape") {
    closeFontPickerLists();
  }
});
document.addEventListener("click", event => {
  if (!event.target.closest(".font-picker")) {
    closeFontPickerLists();
  }
});

buildUrlQuickControls();
buildPanel();
buildAutoscrollQuickControls();
updateUrlOutput();
setTypeStylePreviewBackground(typeStyleEditorState.previewBg, typeStyleEditorState.previewBgColor);
setTestAreaSurface(testAreaSurfaceState.mode, testAreaSurfaceState.color);
syncControls();
