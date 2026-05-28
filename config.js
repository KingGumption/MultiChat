// URL overrides are supported for quick OBS/browser-source variants.
// Examples:
// index.html?tiktok=false&alerts=false
// index.html?images=false&previews=false&max=25&fitToScreen=true
// index.html?borderGlow=false&animations=false
// index.html?behaviour.alerts.twitch.raids=false&layout.fitToScreen=true
window.CHAT_CONFIG = {
  streamerbot: {
    host: "127.0.0.1",
    port: 8080,
    reconnectMs: 2000
  },

  tikfinity: {
    enabled: true,
    host: "127.0.0.1",
    port: 21213,
    reconnectMs: 2000
  },

  layout: {
    maxMessages: 50,
    chatWidth: "clamp(320px, 92vw, 820px)",
    left: "clamp(12px, 4vw, 32px)",
    bottom: "clamp(12px, 4vw, 32px)",
    rowGap: 18,
    groupedMessageGap: 0,
    avatarGap: 10,
    avatarSize: 52,
    avatarSizeGigantified: 64,
    maxMessageWidth: "var(--chat-content-width)",
    fitToScreen: false
  },

  style: {
    fontFamily: "'Sora', sans-serif",

    accentFontFamily: "'Sora', sans-serif",
    messageFontFamily: "'Sora', sans-serif",
    titleFontSize: 12,
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
        raids: "#9146ff"
      },

      youtube: {
        chat: "#ff0033",
        superChats: "#ff0033",
        superStickers: "#ff0033",
        members: "#ff0033"
      },

      tiktok: {
        chat: "#25f4ee",
        follows: "#25f4ee",
        subscribers: "#25f4ee",
        gifts: "#25f4ee",
        likes: "#25f4ee",
        treasureBoxes: "#25f4ee"
      },
      kick: {
        chat: "#53fc18",
        follows: "#53fc18",
        subs: "#53fc18",
        giftSubs: "#53fc18",
        rewardRedemptions: "#53fc18"
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
    bubbleShape: "rounded",
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
    stealth: {
      chatBackgrounds: false,
      nameBackgrounds: false,
      messageBackgrounds: false,
      alertBackgrounds: false,
      giftBackgrounds: false,
      mediaBackgrounds: false,
      emoteGlow: false,
      avatarGlow: false,
      coloredText: false,
      badges: true,
      platformIcons: true
    },

    messageFontSize: 17,
    titleLineHeight: 1.05,
    messageLineHeight: 1.28,
    emoteOnlyFontSize: 30,
    gigantifiedFontSize: 44,

    bubbleRadius: 21,
    nameBubbleRadius: 20,
    minimalStyle: false
  },

  behaviour: {
    removeMessagesAfterMs: 0,
    groupConsecutiveMessages: true,
    groupWindowMs: 30000,
    showTimestamps: false,
    timestampFormat: "time",
    inlineChat: false,
    highlightMentions: true,
    autoScroll: true,
    scrollDirection: "up",
    hideAfterFade: true,
    showAlerts: true,
    compactAlerts: true,
    showImageEmbeds: true,
    showLinkPreviews: true,
    showPlatformIcons: true,
    imageEmbeds: {
      twitch: {
        enabled: true,
        everyone: false,
        broadcaster: true,
        moderators: true,
        vips: false,
        subscribers: false
      },

      youtube: {
        enabled: true,
        everyone: false,
        owner: true,
        moderators: true,
        members: false
      },

      tiktok: {
        enabled: true,
        everyone: false
      },

      kick: {
        enabled: true,
        everyone: false,
        broadcaster: true,
        moderators: true,
        vips: false,
        subscribers: false
      }
    },
    showBadges: true,
    showAvatars: true,
    twitchAvatarsViaDecApi: true,

    sources: {
      twitch: true,
      youtube: true,
      tiktok: true,
      kick: true
    },

    chat: {
      twitch: true,
      youtube: true,
      tiktok: true,
      kick: true
    },

    alerts: {
      twitch: {
        enabled: true,
        announcements: true,
        channelPointRedemptions: true,
        cheers: true,
        follows: true,
        subs: true,
        giftSubs: true,
        raids: true
      },

      youtube: {
        enabled: true,
        superChats: true,
        superStickers: true,
        members: true
      },

      tiktok: {
        enabled: true,
        follows: true,
        subscribers: true,
        gifts: true,
        likes: true,
        treasureBoxes: true
      },
      kick: {
        enabled: true,
        follows: true,
        subs: true,
        giftSubs: true,
        rewardRedemptions: true
      },

      donations: {
        enabled: true,
        streamlabs: true,
        streamelements: true,
        kofi: true,
        tipeeestream: true,
        fourthwall: true,
        patreon: true,
        donordrive: true
      }
    },

    ignoredUsers: [
      "StreamElements",
      "Streamlabs",
      "Nightbot",
      "Moobot",
      "Fossabot",
      "Piggynator",
      "Piggynator-l1k",
      "PokemonCommunityGame",
      "piggernatorbot"
    ]
  },

  animation: {
    enabled: true,
    preset: "normal"
  },

  platforms: {
    twitch: {
      color: "#9146ff",
      glow: "rgba(145, 70, 255, 0.55)"
    },

    youtube: {
      color: "#ff0033",
      glow: "rgba(255, 0, 51, 0.52)"
    },

    tiktok: {
      color: "#25f4ee",
      glow: "rgba(37, 244, 238, 0.48)"
    },

    kick: {
      color: "#53fc18",
      glow: "rgba(83, 252, 24, 0.48)"
    }
  },

  highlight: {
    enabled: true
  },

  gigantified: {
    enabled: true,
    bounceEmotes: true
  },

  thirdPartyEmotes: {
    enabled: true,

    seventv: {
      enabled: true
    },

    bttv: {
      enabled: true,
      twitchUserId: ""
    },

    ffz: {
      enabled: true,
      twitchChannelName: ""
    }
  },

  filters: {
    blockedPrefixes: ["!"]
  },
};
