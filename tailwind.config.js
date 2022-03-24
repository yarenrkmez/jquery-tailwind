module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        card:{
          green:'#2ECC71',
          blue:'#007AE9',
          gray:'#B1B4B9'
        },
      },
      spacing: {
        '1': '8px',
        '2': '12px',
        '3': '16px',
        '4': '24px',
        '5': '32px',
        '6': '48px',
        '2/3':"66.666667%"
      }
    },
  },
  plugins: [],
}