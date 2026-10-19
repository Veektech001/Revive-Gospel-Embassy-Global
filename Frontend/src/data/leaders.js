import apostleImage from "../assets/Images/firstHero.jpg";

// TODO: add real bios and photos.
// image: null shows an initials placeholder until a photo is added.
export default [
  {
    id: "apostle",
    name: "Apostle Light Iwuh",
    role: "Senior Pastor",
    image: { src: apostleImage, alt: "Apostle Light Iwuh" },
    bio: [
      "Apostle Light Iwuh leads Revive Gospel Embassy with a burden to see men and women set ablaze for the kingdom of God.",
    ],
    bioPending: true,
  },
  {
    id: "mama",
    name: "Pst. Mrs. Lilly Iwuh",
    role: "Senior Pastor",
    image: null,
    bio: [
      "Pastor Lilly Iwuh serves alongside Apostle Light in building a church where people encounter God and become more like Jesus.",
    ],
    bioPending: true,
  },
  {
    id: "joy",
    name: "Pastor Joy",
    role: "First-timers & Follow-up",
    image: null,
    bio: [
      "Pastor Joy welcomes everyone who visits RGE for the first time and helps new members find their place in the family.",
    ],
    bioPending: true,
  },
];
