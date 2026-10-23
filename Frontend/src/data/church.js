// ─────────────────────────────────────────────────────────────
// All church details live here. Edit this file and every page
// that shows these details updates automatically.
// Anything marked TODO is still waiting for real information.
// ─────────────────────────────────────────────────────────────

export const church = {
  name: "Revive Gospel Embassy",
  shortName: "RGE",
  tagline: "…to infect men with the undying fire and zeal for the kingdom of God.",
  vision: "To infect men with the undying fire and zeal for the kingdom of God.",
  mission:
    "To set territories burning for the kingdom without reservation and denominational biasness.",

  phone: "07069713612",
  phoneHref: "tel:07069713612",
  email:["revivegospelnetwork@gmail.com","revivegospelembassyglobal@gmail.com"]

  ,

  // Where Sunday and Friday services hold
  headquarters: {
    label: "Headquarters",
    lines: ["Revive Gospel Embassy Global by Ochendo, Obofia Road,", "Texaco Junction, Nkanu West, Enugu State"],
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Omar%27s+Lodge+Agbani+Enugu",
  },

  //Branch
  venue: {
    label: "Campus Expression",
    lines: ["SUG Complex, behind ESUT Senior Staff Club", "Agbani, Enugu State"],
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=SUG+Complex+ESUT+Agbani+Enugu",
  },

  services: [
    { day: "Sunday", time: "8:00 AM", name: "Arise Service" },
    { day: "Friday", time: "5:00 PM", name: "Revival Atmosphere" },
    { day: "Thursday", time: "5PM - 6PM", name: "Prayer Uproar" },
    { day: "Every day", time: "1:00 AM", name: "Daily Prayer Watch" },
  ],

  // TODO: add real social media links (leave "" to hide an icon)
  socials: {
    facebook: "",
    instagram: "",
    youtube: "",
  },
};

export const navLinks = [
  { to: "/about", label: "About" },
  { to: "/sermons", label: "Sermons" },
  { to: "/leadership", label: "Leadership" },
  { to: "/first-time", label: "First time?" },
  { to: "/give", label: "Give" },
];
