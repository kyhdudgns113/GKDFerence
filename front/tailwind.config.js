module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "gkd-sakura-bg": "#FCEDEC",
        "gkd-sakura-border": "#F2BCB8",
        "gkd-sakura-text": "#F89992",
        "gkd-sakura-placeholder": "#FAC3BF",
        "gkd-sakura-hover-button": "#FAB7B2",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp"), require("daisyui")],
};
