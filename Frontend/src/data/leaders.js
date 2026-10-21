import apostleImage from "../assets/Images/firstHero.jpg";
import mama from "../assets/Images/mama.jpeg";
// TODO: add real bios and photos.
// image: null shows an initials placeholder until a photo is added.
export default [
  {
    id: "apostle",
    name: "Apostle Light Iwuh",
    role: "Senior Pastor",
    image: { src: apostleImage, alt: "Apostle Light Iwuh" },
    bio: [
      "Apostle Iwuh Onyekachi Light is the founder and bishop of Revive Gospel Embassy Global, Nigeria. He is married to Pastor Mrs. Nchedochukwu Iwuh and they don't are blessed with lovely children. He studied food science and technology and works as a Nutritionist with the university of Nigeria teaching hospital (UNTH). He is a passionate and sound teacher of the word of God. A theologian, trained in the institute of mission's and theology and other noble school of ministry. He has been in active ministry from his youth,with great demonstration of God's power and wisdom. He is a leadership coach, and runs a leadership school, where many people especially young people are raised to lead in different sphere of life.",
    ],
    bioPending: false,
  },
  {
    id: "mama",
    name: "Pst. Mrs. Lilly Iwuh",
    role: "Senior Pastor",
    image: { src: mama, alt: "Pst Lillian" },
    bio: [
      "Pastor Mrs. Nchedochukwu Iwuh is a dedicated follower of Christ who began her walk with God in August 2013. By the grace of God, she serves as a Co-labourer at Revive Gospel Embassy. She holds a degree in Industrial Chemistry. She is happily married to Apostle Iwuh Onyekachi and their union is blessed with lovely children. She is passionate about seeing young people grow into their full potential in Christ, with a deep burden for Godly and effective parenting. A passionate children teacher at heart, she delights in nurturing young souls in the way of the Lord. She loves good and Godly music.",
    ],
    bioPending: false,
  },
  {
    id: "chidimma",
    name: "Pastor Chidimma",
    role: "First-timers & Follow-up",
    image: null,
    bio: [
      "Pastor Chidimma welcomes everyone who visits RGE for the first time and helps new members find their place in the family.",
    ],
    bioPending: false,
  },
];
