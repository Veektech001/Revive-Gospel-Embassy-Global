import brothersImage from "../assets/Images/brothersConclave.jpg";
import sistersImage from "../assets/Images/sistersConclave.jpg";
import serveImage from "../assets/Images/serve.jpg";

// TODO: paste the real WhatsApp group invite links (https://chat.whatsapp.com/...)
// A group with an empty link shows "Link coming soon" instead of a button.
export default [
  {
    id: "brothers",
    title: "Brothers Conclave",
    text: "Men of RGE growing together in prayer, the Word and accountability.",
    cta: "Join the Brothers Conclave",
    whatsappLink: "",
    image: { src: brothersImage, alt: "A brother praying during service" },
  },
  {
    id: "sisters",
    title: "Sisters Conclave",
    text: "Women of RGE building one another up in faith, friendship and service.",
    cta: "Join the Sisters Conclave",
    whatsappLink: "",
    image: { src: sistersImage, alt: "Sisters worshipping together" },
  },
  {
    id: "workers",
    title: "Serve as a worker",
    text: "Choir, ushering, media, protocol and more. Use your gifts to build the house.",
    cta: "Become a worker",
    whatsappLink: "",
    image: { src: serveImage, alt: "Choir ministering on stage" },
  },
];
